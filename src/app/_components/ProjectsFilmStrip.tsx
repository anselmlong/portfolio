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

/**
 * ProjectsFilmStrip — a contact-sheet strip of work.
 * Desktop: the section pins and scroll drives the strip horizontally,
 * like pulling a roll of film across a light table.
 * Mobile / reduced motion: frames stack vertically.
 */
export default function ProjectsFilmStrip({
  projects,
}: {
  projects: Project[];
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current;
          const section = sectionRef.current;
          if (!track || !section) return;

          const getDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth + 96);

          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + getDistance(),
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          // Frames develop (fade up from black) as they enter the strip
          gsap.from(".film-frame", {
            autoAlpha: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });
        },
      );

      // Mobile: simple reveal per frame as it scrolls into view
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.utils.toArray<HTMLElement>(".film-frame").forEach((frame) => {
            gsap.from(frame, {
              autoAlpha: 0,
              y: 40,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: frame,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            });
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative mt-40 flex min-h-svh flex-col justify-center overflow-hidden py-16"
    >
      <span
        className="ghost-numeral absolute top-2 left-2 md:left-16"
        aria-hidden="true"
      >
        03
      </span>

      <div className="relative mx-auto mb-12 w-full max-w-6xl px-6 md:px-0">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">deployed work</p>
            <h2 className="font-bricolage text-foreground text-4xl leading-tight font-light tracking-tight text-balance md:text-5xl lg:text-6xl">
              projects people can{" "}
              <span className="display-accent">actually use</span>
            </h2>
          </div>
          <p className="film-edge-text hidden md:block">
            ▸ scroll to advance the roll
          </p>
        </div>
      </div>

      <div ref={trackRef} className="film-track px-6 md:pl-[max(1.5rem,calc((100vw-72rem)/2))]">
        {projects.map((proj, index) => (
          <article key={proj.name} className="film-frame group">
            <div className="film-sprockets" aria-hidden="true" />

            <a
              href={proj.url}
              className="flex flex-1 flex-col p-6 md:p-7"
              target={proj.url?.startsWith("http") ? "_blank" : undefined}
              rel={
                proj.url?.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              <div className="flex items-start justify-between gap-4">
                <span className="film-frame-number">
                  fr {String(index + 1).padStart(2, "0")}
                </span>
                {proj.status ? (
                  <span className="border-primary/30 text-primary shrink-0 rounded-full border px-3 py-1 text-xs leading-none">
                    {proj.status}
                  </span>
                ) : null}
              </div>

              <h3 className="text-card-foreground group-hover:text-primary mt-4 text-2xl font-medium tracking-tight transition-colors duration-300">
                {proj.name}
              </h3>

              <p className="text-muted-foreground mt-3 flex-1 leading-relaxed text-pretty">
                {proj.description}
              </p>

              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="font-geist text-muted-foreground/80 text-xs leading-relaxed">
                  {proj.tech}
                </p>
                <span
                  className="text-primary shrink-0 text-lg opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
            </a>

            <div className="flex items-center justify-between px-6 pb-1.5">
              <span className="film-edge-text">anselm 400</span>
              <span className="film-edge-text">
                ▸▸ {String(index + 1).padStart(2, "0")}a
              </span>
            </div>
            <div className="film-sprockets" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
