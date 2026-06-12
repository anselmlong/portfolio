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

/**
 * ExperienceTimeline — editorial index rows under a scroll-drawn
 * copper spine. No cards: hairlines, a period column, and a name
 * that warms to copper on hover.
 */
export default function ExperienceTimeline({
  experiences,
}: {
  experiences: Experience[];
}) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Copper spine draws down as the list scrolls through view
        gsap.to(".xp-spine", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".xp-list",
            start: "top 75%",
            end: "bottom 40%",
            scrub: true,
          },
        });

        // Header reveal
        gsap.from(".xp-header", {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        // Rows rise in sequence
        gsap.utils.toArray<HTMLElement>(".xp-row").forEach((row) => {
          gsap.from(row, {
            autoAlpha: 0,
            y: 36,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative mt-40 px-6">
      <span
        className="ghost-numeral absolute -top-10 right-2 md:right-16"
        aria-hidden="true"
      >
        02
      </span>

      <div className="xp-header relative mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">experience</p>
            <h2 className="font-bricolage text-foreground text-4xl leading-tight font-light tracking-tight text-balance md:text-5xl lg:text-6xl">
              my journey <span className="display-accent">so far</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-base text-pretty">
            internships, schools, and programs that have shaped how i build.
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-14 max-w-5xl">
        <span className="xp-spine hidden md:block" aria-hidden="true" />
        <div className="xp-list border-t border-[oklch(0.25_0.012_85/0.7)]">
          {experiences.map((exp) => (
            <article key={exp.name} className="xp-row">
              <span className="display-accent text-sm tracking-wide md:pt-1">
                {exp.period}
              </span>
              <div>
                <h3 className="xp-name text-foreground text-2xl font-medium tracking-tight">
                  {exp.name}
                </h3>
                <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed text-pretty">
                  {exp.description}
                </p>
                {exp.url && (
                  <a
                    href={exp.url}
                    className="font-geist text-primary hover:text-foreground mt-3 inline-flex items-center gap-1 text-sm font-semibold transition-all duration-200 hover:gap-2"
                  >
                    read more <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
