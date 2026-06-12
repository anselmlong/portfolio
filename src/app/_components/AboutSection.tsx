"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * AboutSection — parallax portrait beside line-masked prose.
 * The paragraph develops line by line as it enters the viewport.
 */
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const proseRef = useRef<HTMLParagraphElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Portrait drifts slower than the page (parallax) and reveals
        gsap.from(".about-portrait", {
          autoAlpha: 0,
          x: -60,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.to(".about-portrait", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        // Heading + eyebrow rise
        gsap.from(".about-head", {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        // Prose develops line by line
        let split: SplitText | undefined;
        const run = () => {
          if (!proseRef.current) return;
          split = SplitText.create(proseRef.current, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line-mask",
          });
          gsap.from(split.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.07,
            scrollTrigger: {
              trigger: proseRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        };
        if (document.fonts.status === "loaded") {
          run();
        } else {
          void document.fonts.ready.then(run);
        }

        return () => split?.revert();
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative mt-32 px-6 pb-10 md:mt-40 md:px-40"
    >
      <span
        className="ghost-numeral absolute -top-10 left-2 md:left-16"
        aria-hidden="true"
      >
        01
      </span>
      <div className="relative container mx-auto flex flex-col items-center justify-center gap-10 md:flex-row md:gap-16">
        <div className="about-portrait portrait-frame flex-none">
          <img
            src="/photos/main/portrait.jpeg"
            alt="Anselm Long"
            className="size-48 rounded-full border-2 border-white/5 object-cover opacity-90 transition-opacity duration-200 ease-out hover:opacity-100 md:size-64"
          />
        </div>
        <div className="max-w-2xl text-left">
          <p className="about-head eyebrow mb-5">about</p>
          <h2 className="about-head font-bricolage text-foreground-high mb-4 text-4xl leading-tight font-light tracking-tight text-balance md:mb-6 md:text-5xl lg:text-6xl">
            design <span className="display-accent">×</span> engineering
          </h2>
          <p
            ref={proseRef}
            className="text-muted-foreground max-w-prose text-lg leading-relaxed font-light md:text-xl"
          >
            i&apos;m a year 3 computer science student at nus with deep
            interests in photography and tech — i love working at the
            intersection of design and engineering. i delight in reducing
            friction: most of what i build starts as a small tool to make my
            own life smoother. off-screen, you&apos;ll find me bouldering,
            behind a camera, or attempting latte art (though i&apos;ll always
            take a good matcha).
          </p>
        </div>
      </div>
    </section>
  );
}
