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
        <p className="text-sm uppercase text-muted-foreground font-sans">experience</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-4 text-foreground text-balance">
          my journey so far
        </h2>
        <p className="text-base md:text-lg text-muted-foreground text-pretty">
          internships, schools, and programs that have shaped how i build.
        </p>
      </div>
      <div className="relative mx-auto mt-14 max-w-5xl">
        <span className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-border md:block"></span>
        <div className="space-y-8 md:space-y-10">
          {experiences.map((exp) => (
            <article
              key={exp.name}
              className="timeline-item relative rounded-xl border border-border bg-card p-6 md:pl-12 shadow-sm"
            >
              <span className="absolute -left-[0.4rem] top-8 hidden size-4 rounded-full bg-primary shadow-sm md:block outline outline-4 outline-background"></span>
              <div className="flex flex-wrap items-center gap-3 text-sm uppercase text-muted-foreground font-sans">
                <span>{exp.period}</span>
              </div>
              <h3 className="mt-3 text-2xl font-medium text-card-foreground">{exp.name}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed text-pretty">{exp.description}</p>
              {exp.url && (
                <a
                  href={exp.url}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:text-foreground transition-colors duration-200 font-sans"
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
