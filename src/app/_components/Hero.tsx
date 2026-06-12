"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import ChatInterface from "~/app/_components/ChatInterface";
import AuroraBackground from "~/app/_components/AuroraBackground";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning,";
  if (hour >= 12 && hour < 17) return "afternoon,";
  if (hour >= 17 && hour < 21) return "evening,";
  return "hello,";
};

export default function Hero({ roles }: { roles: string[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const scrambleRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // --- Headline: masked character rise ---
        // Wait for fonts so SplitText measures the real glyphs.
        let split: SplitText | undefined;
        const run = () => {
          if (!titleRef.current) return;
          split = SplitText.create(titleRef.current, {
            type: "chars,lines",
            mask: "lines",
            linesClass: "split-line-mask",
          });
          gsap.from(split.chars, {
            yPercent: 110,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.025,
            delay: 0.2,
          });
        };
        if (document.fonts.status === "loaded") {
          run();
        } else {
          void document.fonts.ready.then(run);
        }

        // --- Supporting elements stagger in after the headline ---
        gsap.to(".hero-reveal", {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.7,
        });

        // --- Roles: darkroom scramble cycle ---
        const tl = gsap.timeline({ repeat: -1, delay: 1.6 });
        roles.forEach((role) => {
          tl.to(scrambleRef.current, {
            duration: 1,
            scrambleText: {
              text: role,
              chars: "lowerCase",
              speed: 0.4,
            },
          }).to({}, { duration: 1.6 }); // hold
        });

        // --- Scroll out: hero sinks and dims as you leave it ---
        gsap.to(".hero-inner", {
          yPercent: -8,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom 80%",
            end: "bottom 20%",
            scrub: true,
          },
        });

        return () => split?.revert();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-reveal", { autoAlpha: 1, y: 0 });
        if (scrambleRef.current && roles[0]) {
          scrambleRef.current.textContent = roles[0];
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[92svh] flex-col justify-center px-6 pt-24 pb-12 md:px-16 lg:px-24"
    >
      <AuroraBackground />

      <div className="hero-inner relative mx-auto w-full max-w-6xl">
        {/* Top meta row — like a contact sheet header */}
        <div className="hero-reveal mb-10 flex items-center justify-between">
          <p className="eyebrow">portfolio — singapore</p>
          <p className="film-edge-text hidden md:block">
            anselm 400 ▸ fr 001 ▸ daylight
          </p>
        </div>

        <h1
          ref={titleRef}
          className="font-bricolage text-foreground-high text-[17vw] leading-[0.92] font-extralight tracking-tight md:text-[9.5rem] lg:text-[11rem]"
        >
          {getGreeting()}
          <br />
          i&apos;m <span className="display-accent">anselm.</span>
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="hero-reveal text-foreground text-xl font-light md:text-2xl">
              — <span ref={scrambleRef} className="scramble-line" />
            </p>
            <p className="hero-reveal text-muted-foreground mt-4 max-w-md text-base leading-relaxed font-light text-pretty md:text-lg">
              studying computer science @ nus, working at the intersection of
              design and engineering.
            </p>
            <p className="hero-reveal display-accent mt-3 text-lg tracking-tight md:text-xl">
              constantly learning, always improving, never boring.
            </p>
          </div>

          {/* Chat as a compact snippet — it expands on focus */}
          <div className="hero-reveal">
            <p className="film-edge-text mb-2 pl-4">
              ▸ ask the archive anything
            </p>
            <ChatInterface />
          </div>
        </div>
      </div>

      <div className="fade-in hero-arrow absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center">
        <h6 className="scroll-text text-muted-foreground mb-2 font-sans text-xs tracking-[0.2em] uppercase">
          scroll
        </h6>
        <svg
          className="scroll-arrow text-muted-foreground size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
