"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ecosystemSites } from "~/data/sites";

gsap.registerPlugin(ScrollTrigger);

/**
 * EcosystemSection — the live sub-sites of anselmlong.com, each on its own
 * subdomain. Data lives in src/data/sites.ts; adding a site is one line there.
 */
export default function EcosystemSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      gsap.from(".eco-card", {
        autoAlpha: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative mt-40">
      <span
        className="ghost-numeral absolute -top-10 left-2 md:left-16"
        aria-hidden="true"
      >
        04
      </span>

      <div className="mx-auto w-full max-w-6xl px-6">
        <p className="eyebrow mb-4">the ecosystem</p>
        <h2 className="font-bricolage text-foreground text-4xl leading-tight font-light tracking-tight text-balance md:text-5xl lg:text-6xl">
          live on their own{" "}
          <span className="display-accent">subdomains</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
          deployed side projects, each with its own corner of anselmlong.com.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ecosystemSites.map((site) => (
            <a
              key={site.url}
              href={site.url}
              target="_blank"
              rel="noopener"
              className="eco-card group border-border hover:border-primary/40 bg-card/50 flex flex-col rounded-lg border p-5 transition-colors duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {site.emoji}
                </span>
                <span
                  className="text-primary shrink-0 text-lg opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
              <h3 className="text-card-foreground group-hover:text-primary mt-3 text-lg font-medium tracking-tight transition-colors duration-300">
                {site.name}
              </h3>
              <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed text-pretty">
                {site.tagline}
              </p>
              <p className="font-geist text-muted-foreground/80 mt-4 text-xs">
                {site.url.replace("https://", "")}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
