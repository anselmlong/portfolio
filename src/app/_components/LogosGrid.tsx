"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Logo = { src: string; alt: string };

export default function LogosGrid({ logos }: { logos: Logo[] }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scoped GSAP animation for the logos grid
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        // Headline slide (if any) is handled by parent; animate the logo items here
        gsap.fromTo(
          ".logo-item",
          { opacity: 0, scale: 0.9, y: 10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.2,
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
        <h1 className="animate-right text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
          what i've worked with
        </h1>
      </div>

      <div className="relative mt-12">
        {/* grid wrapper: responsive columns and gap; max width centers content */}
        <div className="stagger-in grid grid-cols-3 gap-6">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="logo-item group flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/60 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-white/40 hover:bg-white/10"
            >
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg ring-1 ring-black/5 transition-all duration-300 group-hover:ring-white/60">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-10 w-10 md:h-16 md:w-16 object-contain rounded-full drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-sm uppercase tracking-wide text-gray-400 group-hover:text-gray-100">
                {logo.alt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
