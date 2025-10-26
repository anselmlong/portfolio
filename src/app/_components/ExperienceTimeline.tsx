"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Experience = {
  name: string;
  period: string;
  description: string;
  url?: string;
};

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        // Animate headline / intro elements that use .animate-right inside this section
        gsap.utils.toArray<HTMLElement>(".animate-right").forEach((elem) => {
          gsap.from(elem, {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 70%",
              toggleActions: "play none none reverse",
              scrub: 1,
            },
          });
        });

        // Timeline items
        gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((elem, index) => {
          gsap.from(elem, {
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 80%",
              toggleActions: "play none none reverse",
              scrub: 1,
            },
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { dependencies: [], scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="mt-40 px-6">
      <div className="animate-right max-w-5xl mx-auto text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">experience</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
          my journey so far
        </h2>
        <p className="text-base md:text-lg text-gray-400">
          internships, schools, and programs that have shaped how i build.
        </p>
      </div>
      <div className="relative mx-auto mt-14 max-w-5xl">
        <span className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent md:block"></span>
        <div className="space-y-8 md:space-y-10">
          {experiences.map((exp) => (
            <article
              key={exp.name}
              className="timeline-item relative rounded-3xl border border-white/5 bg-slate-900/40 p-6 md:pl-12"
            >
              <span className="absolute -left-[0.4rem] top-8 hidden h-4 w-4 rounded-full bg-white shadow-lg md:block"></span>
              <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.25em] text-gray-400">
                <span>{exp.period}</span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-gray-100">{exp.name}</h3>
              <p className="mt-3 text-gray-300">{exp.description}</p>
              {exp.url && (
                <a
                  href={exp.url}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-sky-300 hover:text-white"
                >
                  read more →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
