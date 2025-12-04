"use client";
import { usePathname, useRouter } from "next/navigation";

export default function NavLink({
  href,
  children,
  onClick,
  className,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (onClick) onClick();

    // Handle section links (anchors)
    if (href.startsWith("#")) {
      if (pathname === "/") {
        // already on home → smooth scroll
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // navigate to home with hash, Next will scroll automatically
        router.push("/" + href);
      }
    } else {
      // for normal pages like /blog
      router.push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
