"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  "aria-current"?: "page" | "step" | "location" | "date" | "time" | boolean;
}

export default function NavLink({
  href,
  children,
  onClick,
  className = "",
  "aria-current": ariaCurrent,
}: NavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let cmd/ctrl click open in new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    e.preventDefault();
    if (onClick) onClick();

    const isHash = href.startsWith("#") || href.startsWith("/#");
    const hashId = href.startsWith("/#") ? href.slice(1) : href;

    if (isHash) {
      if (pathname === "/") {
        const el = document.querySelector(hashId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", hashId);
          return;
        }
      }
      router.push("/" + hashId);
    } else {
      router.push(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      aria-current={ariaCurrent}
    >
      {children}
    </a>
  );
}
