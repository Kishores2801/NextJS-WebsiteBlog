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

export default function CareerTimeline({ initialData = [] }: { initialData?: CareerItem[] }) {
  const [careers, setCareers] = useState<CareerItem[]>(initialData);
  const [activeOrgIndex, setActiveOrgIndex] = useState(0);
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);

  useEffect(() => {
    if (initialData.length > 0) {
      setCareers(initialData);
    }
  }, [initialData]);


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
    <section id="Career" className="w-full h-auto pt-12 pb-20 sm:pb-12 overflow-hidden relative flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="text-left mb-10 pl-4 lg:pl-0">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-2">
            My Journey
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl text-sm">
            A timeline of my professional experience and education.
          </p>
        </div>

        {/* Desktop View: Grid with Details and Dial */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-20 items-center p-4">
          {/* LEFT: Details */}
          <div className="relative z-10 h-full flex items-center">
            <CareerDetails 
              item={activeRole} 
              roleIndex={activeRoleIndex} 
              totalRoles={activeGroup.roles.length} 
            />
          </div>

          {/* RIGHT: Dial */}
          <div className="h-fit lg:h-full relative">
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

        {/* Mobile/Tablet View: Clean Boxes */}
        <div className="lg:hidden flex flex-col gap-6 px-4">
          {careers.slice().reverse().map((career) => (
            <div 
              key={career._id} 
              className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-3xl shadow-sm hover:border-[var(--primary)]/50 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest">
                    {career.organization}
                  </span>
                  <span className="text-[10px] text-[var(--muted-foreground)] uppercase">
                    {new Date(career.startDate).getFullYear()} - {career.isCurrent ? "Present" : career.endDate ? new Date(career.endDate).getFullYear() : ""}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  {career.title}
                </h3>
                
                {career.description && (
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-3">
                    {career.description}
                  </p>
                )}

                {career.skills && career.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {career.skills.slice(0, 4).map((skill) => (
                      <span 
                        key={skill} 
                        className="px-2 py-0.5 text-[10px] rounded-md bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop ONLY Manual Controls */}
        <div className="hidden lg:flex absolute -bottom-6 sm:bottom-4 right-4 sm:right-4 items-center gap-2 z-50">
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
