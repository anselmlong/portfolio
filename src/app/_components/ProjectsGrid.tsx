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
  status?: string;
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
      <div className="animate-right mx-auto grid max-w-6xl gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p className="font-geist text-primary text-xs tracking-[0.15em] uppercase">
            deployed work
          </p>
          <h2 className="font-bricolage text-foreground mt-3 text-4xl leading-tight font-light tracking-tight text-balance md:text-5xl lg:text-6xl">
            projects people can actually use
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed text-pretty md:text-lg">
          live sites, telegram bots, tools, and a few build notes. technology is
          still there, but the emphasis is what shipped and why it exists.
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2">
        {projects.map((proj) => (
          <article
            key={proj.name}
            className="project-card group border-border bg-card/80 hover:border-primary/50 hover:shadow-primary/5 flex h-full flex-col rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-6"
          >
            <a
              href={proj.url}
              className="flex h-full flex-col"
              target={proj.url?.startsWith("http") ? "_blank" : undefined}
              rel={
                proj.url?.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-card-foreground text-2xl font-medium tracking-tight">
                  {proj.name}
                </h3>
                {proj.status ? (
                  <span className="border-primary/30 text-primary shrink-0 rounded-full border px-3 py-1 text-xs leading-none">
                    {proj.status}
                  </span>
                ) : null}
              </div>
              <p className="text-muted-foreground mt-4 flex-1 leading-relaxed text-pretty">
                {proj.description}
              </p>
              <p className="font-geist text-muted-foreground/80 mt-6 text-xs leading-relaxed">
                {proj.tech}
              </p>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
