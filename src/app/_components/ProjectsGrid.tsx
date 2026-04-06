"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  name: string;
  tech: string;
  description: string;
  url?: string;
};

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
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

        gsap.fromTo(
          ".project-card",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.25,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }, sectionRef);

      return () => ctx.revert();
    },
    { dependencies: [], scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="mt-32 px-6 pb-24">
      <div className="animate-right mx-auto max-w-6xl text-center">
        <p className="font-geist text-muted-foreground text-xs tracking-[0.15em] uppercase">
          projects
        </p>
        <h2 className="font-bricolage text-foreground mb-4 text-4xl leading-tight font-light tracking-tight text-balance md:text-5xl lg:text-6xl">
          stuff i&apos;ve built
        </h2>
        <p className="text-muted-foreground text-base text-pretty md:text-lg">
          hackathons, school and personal projects.
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-6">
        {projects.map((proj) => (
          <article
            key={proj.name}
            className="project-card group border-border bg-card hover:border-primary/40 hover:shadow-primary/5 flex h-full flex-col rounded-xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <a href={proj.url}>
              <h3 className="text-card-foreground mt-4 text-2xl font-medium">
                {proj.name}
              </h3>
              <p className="font-geist text-primary mt-2 text-xs font-medium tracking-wide uppercase">
                {proj.tech}
              </p>
              <p className="text-muted-foreground mt-4 flex-1 leading-relaxed text-pretty">
                {proj.description}
              </p>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
