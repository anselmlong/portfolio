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
        // Animate heading elements within this section
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

        // Project cards
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
        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">projects</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
          stuff i've built
        </h2>
        <p className="text-base md:text-lg text-gray-400">hackathons, school and personal projects.</p>
      </div>
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 grid-cols-2">
        {projects.map((proj) => (
          <article
            key={proj.name}
            className="project-card group flex h-full flex-col rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/60 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:-translate-y-3"
          >
            <a href={proj.url}>
              <h3 className="mt-4 text-2xl font-semibold text-gray-100">{proj.name}</h3>
              <p className="mt-2 text-sm font-medium text-sky-200">{proj.tech}</p>
              <p className="mt-4 flex-1 text-gray-300">{proj.description}</p>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
