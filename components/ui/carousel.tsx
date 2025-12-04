"use client";
import { useEffect, useRef, useState, useId } from "react";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface SlideData {
  title: string;
  description?: string;
  src: string;
}

const Slide = ({
  slide,
  index,
  current,
  handleSlideClick,
}: {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (i: number) => void;
}) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      slideRef.current.style.setProperty("--x", `${xRef.current}px`);
      slideRef.current.style.setProperty("--y", `${yRef.current}px`);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    xRef.current = e.clientX - (r.left + r.width / 2);
    yRef.current = e.clientY - (r.top + r.height / 2);
  };

  const onLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  return (
    <div className="[perspective:800px] sm:[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="
          relative z-10 
          mx-[3vmin] 
          flex flex-col items-center justify-center 
          h-[32vmin] w-[58vw]          /* Compact mobile size */
          sm:h-[35vmin] sm:w-[28vmin]
          text-center text-white 
          transition-all duration-300 ease-in-out
        "
        onClick={() => handleSlideClick(index)}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          transform:
            current !== index ? "scale(0.92) rotateX(6deg)" : "scale(1) rotateX(0deg)",
          transformOrigin: "bottom",
        }}
      >
        {/* Image */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[3%] bg-[#1D1F2F] transition-all"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x)/40), calc(var(--y)/40), 0)"
                : "none",
          }}
        >
          <img
            src={slide.src}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: current === index ? 1 : 0.6 }}
          />

          {current === index && (
            <div className="absolute inset-0 bg-black/30 transition-all" />
          )}
        </div>

        {/* Text */}
        <article
          className={`
            relative p-2 sm:p-4 
            transition-opacity duration-700
            ${current === index ? "opacity-100" : "invisible opacity-0"}
          `}
        >
          {/* Title always shown */}
          <h2 className="mb-1 text-sm sm:text-lg font-semibold lg:text-xl">
            {slide.title}
          </h2>

          {/* Description hidden on mobile */}
          {slide.description && (
            <p className="hidden sm:block text-xs sm:text-sm text-gray-300 line-clamp-3">
              {slide.description}
            </p>
          )}
        </article>
      </li>
    </div>
  );
};

const CarouselControl = ({
  type,
  title,
  onClick,
}: {
  type: "previous" | "next";
  title: string;
  onClick: () => void;
}) => (
  <button
    className={`
      mx-2 flex h-8 w-8 items-center justify-center 
      rounded-full bg-neutral-200 dark:bg-neutral-800
      transition duration-200 hover:-translate-y-0.5
      ${type === "previous" ? "rotate-180" : ""}
    `}
    title={title}
    onClick={onClick}
  >
    <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
  </button>
);

export default function Carousel() {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [current, setCurrent] = useState(0);
  const id = useId();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "about"][0]{
            items[] {
              title,
              description,
              image
            }
          }
        `);

        if (!data?.items?.length) return setSlides([]);

        const nextSlides: SlideData[] = data.items
          .filter((it: any) => it?.image)
          .map((it: any) => ({
            title: it.title ?? "Untitled",
            description: it.description ?? "",
            src: urlFor(it.image).width(900).height(600).url(),
          }));

        setSlides(nextSlides);
      } catch (err) {
        console.error("Failed to fetch About data:", err);
        setSlides([]);
      }
    };

    fetchAbout();
  }, []);

  if (!slides.length)
    return (
      <p className="mt-10 text-center text-[var(--muted-foreground)]">
        No About items found.
      </p>
    );

  const prev = () => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));
  const next = () => setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));
  const go = (i: number) => current !== i && setCurrent(i);

  return (
    <div
      className="
        relative mx-auto 
        w-[90vw] h-[40vmin]           /* Compact mobile container */
        sm:w-[45vmin] sm:h-[45vmin]
      "
      aria-labelledby={`carousel-heading-${id}`}
    >
      <h2 className="mb-4 sm:mb-6 text-center text-xl sm:text-2xl font-bold">
        More About <span className="text-[var(--color-primary)]">Me</span>
      </h2>

      {/* Slides */}
      <ul
        className="absolute mx-[-2vmin] flex transition-transform duration-1000 ease-in-out touch-pan-x"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, i) => (
          <Slide
            key={`${slide.title}-${i}`}
            slide={slide}
            index={i}
            current={current}
            handleSlideClick={go}
          />
        ))}
      </ul>

      {/* Controls */}
      <div className="absolute top-[calc(100%+0.5rem)] flex w-full justify-center space-x-3">
        <CarouselControl type="previous" title="Previous" onClick={prev} />
        <CarouselControl type="next" title="Next" onClick={next} />
      </div>
    </div>
  );
}
