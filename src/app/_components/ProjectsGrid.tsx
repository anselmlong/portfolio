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
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    },
    { dependencies: [], scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="mt-32 px-6 pb-24">
      <div className="animate-right max-w-6xl mx-auto text-center">
        <p className="text-sm uppercase text-muted-foreground font-sans">projects</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-4 text-foreground text-balance">
          stuff i've built
        </h2>
        <p className="text-base md:text-lg text-muted-foreground text-pretty">hackathons, school and personal projects.</p>
      </div>
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 grid-cols-2">
        {projects.map((proj) => (
          <article
            key={proj.name}
            className="project-card group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-colors duration-200 hover:border-primary/40"
          >
            <a href={proj.url}>
              <h3 className="mt-4 text-2xl font-medium text-card-foreground">{proj.name}</h3>
              <p className="mt-2 text-sm font-medium text-primary font-sans">{proj.tech}</p>
              <p className="mt-4 flex-1 text-muted-foreground leading-relaxed text-pretty">{proj.description}</p>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
