"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Briefcase, GraduationCap, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import SectionHeader from "@/components/ui/SectionHeader";

export interface CareerItem {
  _id: string;
  type?: "work" | "education";
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
  earliestDate?: string;
  latestDate?: string;
  isCurrent?: boolean;
}

// Consistent date formatting helper using en-dash instead of em-dash
function formatDate(dateStr?: string, isCurrent?: boolean): string {
  if (isCurrent) return "Present";
  if (!dateStr) return "Present";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function CareerTimeline({
  initialData = [],
}: {
  initialData?: CareerItem[];
}) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  if (!initialData || initialData.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Group roles by organization while preserving chronological progression
  const sorted = [...initialData].sort((a, b) => {
    const aTime = a.isCurrent ? Infinity : new Date(a.startDate).getTime();
    const bTime = b.isCurrent ? Infinity : new Date(b.startDate).getTime();
    return bTime - aTime;
  });

  const groupedList: OrganizationGroup[] = [];

  sorted.forEach((item) => {
    const existing = groupedList.find((g) => g.organization === item.organization);
    if (existing) {
      existing.roles.push(item);
      if (item.isCurrent) existing.isCurrent = true;
    } else {
      groupedList.push({
        organization: item.organization,
        logo: item.logo,
        roles: [item],
        earliestDate: item.startDate,
        latestDate: item.isCurrent ? "Present" : item.endDate || item.startDate,
        isCurrent: !!item.isCurrent,
      });
    }
  });

  return (
    <section id="Career" className="w-full py-10 sm:py-14 scroll-mt-24">
      <SectionHeader
        eyebrow="Experience"
        title="Career Journey"
        subtitle="Professional progression across business analytics, web survey insights, and analytical leadership."
      />

      {/* Vertical Timeline */}
      <div className="max-w-4xl mx-auto relative">
        {/* Timeline subtle guide line */}
        <div
          className="absolute left-4 sm:left-6 top-6 bottom-6 w-px bg-border/70"
          aria-hidden="true"
        />

        <div className="space-y-8 sm:space-y-10">
          {groupedList.map((group, groupIdx) => {
            const hasMultipleRoles = group.roles.length > 1;

            return (
              <div key={groupIdx} className="relative flex items-start gap-4 sm:gap-6">
                {/* Node icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-colors shrink-0 ${
                    group.isCurrent
                      ? "bg-foreground text-background border-foreground shadow-xs"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {group.roles[0]?.type === "education" ? (
                    <GraduationCap size={15} />
                  ) : (
                    <Briefcase size={15} />
                  )}
                </div>

                {/* Organization Card */}
                <div className="flex-1 rounded-xl border border-border/70 bg-card text-card-foreground p-5 sm:p-6 overflow-hidden">
                  {/* Employer Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      {group.logo?.asset && (
                        <div className="relative w-7 h-7 rounded overflow-hidden bg-muted/40 shrink-0 border border-border/40">
                          <Image
                            src={urlFor(group.logo).width(56).height(56).url()}
                            alt={group.organization}
                            fill
                            className="object-contain p-0.5"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                          {group.organization}
                        </h3>
                        {hasMultipleRoles && (
                          <span className="text-xs text-muted-foreground font-medium">
                            {group.roles.length} Roles • Career Progression
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground self-start sm:self-center">
                      <Calendar size={12} />
                      <span>
                        {formatDate(group.earliestDate)} to {formatDate(group.latestDate, group.isCurrent)}
                      </span>
                    </div>
                  </div>

                  {/* Roles progression */}
                  <div className="space-y-5">
                    {group.roles.map((role) => {
                      const isExpanded = expandedIds[role._id];
                      const dateRange = `${formatDate(role.startDate)} to ${formatDate(role.endDate, role.isCurrent)}`;

                      return (
                        <div
                          key={role._id}
                          className={hasMultipleRoles ? "pl-3.5 sm:pl-4 border-l-2 border-primary/25" : ""}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className="text-sm sm:text-base font-semibold text-foreground">
                              {role.title}
                            </h4>
                            <span className="text-xs text-muted-foreground font-medium">
                              {dateRange}
                            </span>
                          </div>

                          {role.description && (
                            <div className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              <p className={!isExpanded && role.description.length > 140 ? "line-clamp-2" : ""}>
                                {role.description}
                              </p>
                              {role.description.length > 140 && (
                                <button
                                  onClick={() => toggleExpand(role._id)}
                                  type="button"
                                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                >
                                  <span>{isExpanded ? "Show Less" : "Read More"}</span>
                                  {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                </button>
                              )}
                            </div>
                          )}

                          {role.skills && role.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {role.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-0.5 text-[11px] font-medium bg-secondary text-secondary-foreground rounded border border-border/40"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
