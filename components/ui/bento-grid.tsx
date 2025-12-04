import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  image,
  href,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  image?: string;
  href?: string;
}) => {
  const Wrapper: any = href ? Link : "div";

  return (
    <Wrapper
      href={href || "#"}
      className={cn(
        "group/bento relative row-span-1 flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 transition duration-300 hover:shadow-lg dark:border-white/20 dark:bg-neutral-950 overflow-hidden",
        className
      )}
    >
      {/* 🖼 Image Section */}
      {image && (
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={typeof title === "string" ? title : "Bento Item"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover/bento:scale-105"
            priority={true}
          />
        </div>
      )}

      {/* 🧾 Text Content */}
      <div className="transition-transform duration-300 group-hover/bento:translate-x-1 mt-3">
        {icon && <div className="mb-2">{icon}</div>}
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
          {description}
        </p>
      </div>
    </Wrapper>
  );
};
