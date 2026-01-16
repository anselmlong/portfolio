"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Logo = { src: string; alt: string };

export default function LogosGrid({ logos }: { logos: Logo[] }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".logo-item",
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    },
    { dependencies: [], scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="mt-40 mb-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="animate-right text-5xl md:text-7xl font-bold mb-4 text-foreground-high text-balance">
          what i've worked with
        </h1>
      </div>

      <div className="relative mt-12">
        <div className="stagger-in grid grid-cols-3 gap-6">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="logo-item group flex flex-col items-center gap-3 rounded-2xl bg-card p-5 border border-border transition-colors duration-200 hover:border-primary/40 hover:bg-card/80"
            >
              <div className="flex size-16 md:size-20 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm ring-1 ring-black/5">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="size-10 md:size-16 object-contain rounded-full"
                />
              </div>
              <span className="text-sm uppercase text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                {logo.alt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
