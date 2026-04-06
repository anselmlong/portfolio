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

export default function ExperienceTimeline({
  experiences,
}: {
  experiences: Experience[];
}) {
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

        gsap.utils
          .toArray<HTMLElement>(".timeline-item")
          .forEach((elem, index) => {
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
    { dependencies: [], scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="mt-40 px-6">
      <div className="animate-right mx-auto max-w-5xl text-center">
        <p className="font-geist text-muted-foreground text-xs tracking-[0.15em] uppercase">
          experience
        </p>
        <h2 className="font-bricolage text-foreground mb-4 text-4xl leading-tight font-light tracking-tight text-balance md:text-5xl lg:text-6xl">
          my journey so far
        </h2>
        <p className="text-muted-foreground text-base text-pretty md:text-lg">
          internships, schools, and programs that have shaped how i build.
        </p>
      </div>
      <div className="relative mx-auto mt-14 max-w-5xl">
        <span className="bg-border pointer-events-none absolute top-0 left-4 hidden h-full w-px md:block"></span>
        <div className="space-y-8 md:space-y-10">
          {experiences.map((exp) => (
            <article
              key={exp.name}
              className="timeline-item group border-border bg-card hover:border-primary/40 hover:shadow-primary/5 relative rounded-xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:pl-12"
            >
              <span className="bg-primary outline-background group-hover:shadow-primary/50 absolute top-8 -left-[0.4rem] hidden size-4 rounded-full shadow-sm outline outline-4 transition-transform duration-300 group-hover:scale-125 md:block"></span>
              <div className="font-geist text-muted-foreground flex flex-wrap items-center gap-3 text-xs tracking-[0.12em] uppercase">
                <span>{exp.period}</span>
              </div>
              <h3 className="text-card-foreground mt-3 text-2xl font-medium">
                {exp.name}
              </h3>
              <p className="text-muted-foreground mt-3 leading-relaxed text-pretty">
                {exp.description}
              </p>
              {exp.url && (
                <a
                  href={exp.url}
                  className="font-geist text-primary hover:text-foreground mt-4 inline-flex items-center text-sm font-semibold transition-all duration-200 group-hover/link:translate-x-1"
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
