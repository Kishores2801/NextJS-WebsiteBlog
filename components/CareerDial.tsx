"use client";

import React, { useEffect } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { OrganizationGroup } from "./CareerTimeline";

interface CareerDialProps {
  groups: OrganizationGroup[];
  activeOrgIndex: number;
  onOrgChange: (index: number) => void;
}

const DIAL_RADIUS = 550; 
const ACTIVE_POSITION_ANGLE = 180; // 9 o'clock position

export default function CareerDial({ groups, activeOrgIndex, onOrgChange }: CareerDialProps) {
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  const anglePerItem = 360 / Math.max(groups.length, 1);

  useEffect(() => {
    const targetRotation = ACTIVE_POSITION_ANGLE - (activeOrgIndex * anglePerItem);
    
    controls.start({
      rotate: targetRotation,
      transition: { type: "spring", stiffness: 40, damping: 20, mass: 1 },
    });
    rotation.set(targetRotation);
  }, [activeOrgIndex, anglePerItem, controls, rotation]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      
      {/* The Wheel Container */}
      {/* Centered off-screen to the right to create 1/4 circle effect */}
      <div className="absolute right-[-700px] top-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full flex items-center justify-center pointer-events-none bg-transparent">
         
         {/* The "Finger Stop" Indicator */}
         {/* Positioned exactly on the left edge (9 o'clock) of the container */}
         <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 z-30 flex items-center justify-center">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[var(--primary)] shadow-[0_0_30px_var(--primary)] opacity-80" />
            {/* Inner Dark Circle */}
            <div className="w-24 h-24 rounded-full bg-transparent backdrop-blur-md border border-[var(--border)]" />
            
            {/* Triangle Pointer */}
            <div className="absolute -right-6 w-0 h-0 border-t-[12px] border-t-transparent border-l-[18px] border-l-[var(--primary)] border-b-[12px] border-b-transparent" />
         </div>
      </div>

      {/* The Rotating Dial */}
      <motion.div
        className="absolute right-[-700px] w-[1100px] h-[1100px] rounded-full border-[2px] border-[var(--primary)]/20"
        style={{ rotate: rotation, transformOrigin: "center" }}
        animate={controls}
      >
        {/* Decorative Dashed Ring */}
        <div className="absolute inset-[20px] rounded-full border border-[var(--border)]/10 border-dashed" />

        {groups.map((group, index) => {
          const angle = index * anglePerItem;
          const rad = (angle * Math.PI) / 180;
          
          // Position items on the circle
          const x = DIAL_RADIUS * Math.cos(rad);
          const y = DIAL_RADIUS * Math.sin(rad);

          const isActive = index === activeOrgIndex;

          return (
            <motion.div
              key={group.organization + index}
              className="absolute top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10 flex items-center justify-center cursor-pointer z-20"
              style={{ x, y }}
              onClick={() => onOrgChange(index)}
              whileHover={{ scale: 1.1 }}
            >
               {/* Logo Container */}
               {/* We counter-rotate this so the logo stays upright */}
               <CounterRotator parentRotation={rotation}>
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "scale-125" : "opacity-70 grayscale"}`}>
                    {group.logo ? (
                        <div className="relative w-12 h-12">
                            <Image
                            src={urlFor(group.logo).width(100).height(100).url()}
                            alt={group.organization}
                            fill
                            className="object-contain"
                            />
                        </div>
                    ) : (
                        <span className="text-xs font-bold text-[var(--foreground)]">
                        {group.organization.substring(0, 2)}
                        </span>
                    )}
                  </div>
               </CounterRotator>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

// Helper to keep items upright
function CounterRotator({ children, parentRotation }: { children: React.ReactNode, parentRotation: any }) {
    const rotate = useTransform(parentRotation, (v: number) => -v);
    return <motion.div style={{ rotate }}>{children}</motion.div>;
}
