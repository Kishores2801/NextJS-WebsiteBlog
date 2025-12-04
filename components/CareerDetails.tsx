"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CareerItem {
  _id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  skills?: string[];
}

interface CareerDetailsProps {
  item: CareerItem;
  roleIndex: number;
  totalRoles: number;
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function CareerDetails({ item, roleIndex, totalRoles }: CareerDetailsProps) {
  const start = formatDate(item.startDate);
  const end = item.isCurrent ? "Present" : formatDate(item.endDate);

  return (
    <div className="flex flex-col justify-center h-full max-w-lg w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={item._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* Organization & Role Progress */}
          <div className="flex items-center gap-3 mb-4">
             <span className="text-sm font-bold text-[var(--primary)] tracking-widest uppercase">
               {item.organization}
             </span>
             {totalRoles > 1 && (
               <div className="flex gap-1">
                 {Array.from({ length: totalRoles }).map((_, i) => (
                   <div 
                     key={i} 
                     className={`w-2 h-2 rounded-full ${i === roleIndex ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}
                   />
                 ))}
               </div>
             )}
          </div>

          <h3 className="text-2xl md:text-4xl font-bold text-[var(--foreground)] mb-4 leading-tight">
            {item.title}
          </h3>
          
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-widest mb-6 border-l-2 border-[var(--primary)] pl-3">
            {start} — {end}
          </p>
          
          <p className="text-[var(--foreground)]/80 leading-relaxed mb-6 text-base">
            {item.description}
          </p>

          {item.skills && item.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
