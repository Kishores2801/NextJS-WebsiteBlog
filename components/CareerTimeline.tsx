"use client";

import { useEffect, useState, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import CareerDial from "./CareerDial";
import CareerDetails from "./CareerDetails";

interface CareerItem {
  _id: string;
  type: "work" | "education";
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  logo?: any;
  description?: string;
  skills?: string[];
}

export interface OrganizationGroup {
  organization: string;
  logo?: any;
  roles: CareerItem[];
}

export default function CareerTimeline() {
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [activeOrgIndex, setActiveOrgIndex] = useState(0);
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);

  useEffect(() => {
    const fetchCareer = async () => {
      const data = await client.fetch(`
        *[_type == "career"] | order(startDate asc) {
          _id, type, title, organization, startDate, endDate, isCurrent, logo, description, skills
        }
      `);
      setCareers(data);
    };
    fetchCareer();
  }, []);

  // Group by Organization
  const groupedCareers = useMemo(() => {
    const groups: OrganizationGroup[] = [];
    careers.forEach((item) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.organization === item.organization) {
        lastGroup.roles.push(item);
      } else {
        groups.push({
          organization: item.organization,
          logo: item.logo,
          roles: [item],
        });
      }
    });
    return groups;
  }, [careers]);

  // Auto-play Logic
  useEffect(() => {
    if (!groupedCareers.length) return;

    const interval = setInterval(() => {
      const currentGroup = groupedCareers[activeOrgIndex];
      
      // If there are more roles in the current group, go to next role
      if (activeRoleIndex < currentGroup.roles.length - 1) {
        setActiveRoleIndex((prev) => prev + 1);
      } else {
        // Otherwise, go to next group (and reset role to 0)
        const nextOrgIndex = (activeOrgIndex + 1) % groupedCareers.length;
        setActiveOrgIndex(nextOrgIndex);
        setActiveRoleIndex(0);
      }
    }, 5000); // 5 seconds per item

    return () => clearInterval(interval);
  }, [groupedCareers, activeOrgIndex, activeRoleIndex]);

  if (!groupedCareers.length) return null;

  const activeGroup = groupedCareers[activeOrgIndex];
  const activeRole = activeGroup.roles[activeRoleIndex];

  const handleRestart = () => {
    setActiveOrgIndex(0);
    setActiveRoleIndex(0);
  };

  const handlePrev = () => {
    const currentGroup = groupedCareers[activeOrgIndex];
    if (activeRoleIndex > 0) {
      setActiveRoleIndex(prev => prev - 1);
    } else {
      const prevOrgIndex = (activeOrgIndex - 1 + groupedCareers.length) % groupedCareers.length;
      setActiveOrgIndex(prevOrgIndex);
      setActiveRoleIndex(groupedCareers[prevOrgIndex].roles.length - 1);
    }
  };

  const handleNext = () => {
    const currentGroup = groupedCareers[activeOrgIndex];
    if (activeRoleIndex < currentGroup.roles.length - 1) {
      setActiveRoleIndex(prev => prev + 1);
    } else {
      const nextOrgIndex = (activeOrgIndex + 1) % groupedCareers.length;
      setActiveOrgIndex(nextOrgIndex);
      setActiveRoleIndex(0);
    }
  };

  return (
    <section id="Career" className="w-full h-auto py-12 overflow-hidden relative flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="text-left mb-10 pl-4 lg:pl-0">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-2">
            My Journey
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl text-sm">
            A timeline of my professional experience and education.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center p-4">
          {/* LEFT: Details */}
          <div className="order-2 lg:order-1 relative z-10 h-full flex items-center">
            <CareerDetails 
              item={activeRole} 
              roleIndex={activeRoleIndex} 
              totalRoles={activeGroup.roles.length} 
            />
          </div>

          {/* RIGHT: Dial */}
          <div className="order-1 lg:order-2 h-fit lg:h-full relative">
             <CareerDial 
               groups={groupedCareers} 
               activeOrgIndex={activeOrgIndex} 
               onOrgChange={(index) => {
                 setActiveOrgIndex(index);
                 setActiveRoleIndex(0);
               }}
             />
          </div>
        </div>

        {/* Manual Controls for Testing */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-50">
          <button 
            onClick={handleRestart}
            className="px-3 py-1 bg-[var(--card)] border border-[var(--border)] rounded-full text-xs hover:bg-[var(--primary)] hover:text-white transition-colors"
          >
            Restart
          </button>
          
          <button 
            onClick={handlePrev}
            className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors"
          >
            ←
          </button>

          <button 
            onClick={handleNext}
            className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors"
          >
            →
          </button>
        </div>

      </div>
    </section>
  );
}
