// app/ClientHome.tsx
"use client";

import ChatInterface from "~/app/_components/ChatInterface";
import Hero from "~/app/_components/Hero";
import Marquee from "~/app/_components/Marquee";
import AboutSection from "~/app/_components/AboutSection";
import ExperienceTimeline from "~/app/_components/ExperienceTimeline";
import ProjectsFilmStrip from "~/app/_components/ProjectsFilmStrip";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

// Register plugins once at module scope
gsap.registerPlugin(ScrollTrigger, useGSAP);

const roles = [
  "student.",
  "coffee lover.",
  "machine learning enthusiast.",
  "software engineer.",
  "data analyst.",
  "web developer.",
  "storyteller.",
  "photographer.",
  "rock toucher.",
  "creator.",
  "builder.",
];

const experiences = [
  {
    name: "machine learning intern @ imda",
    period: "may 2025 - aug 2025",
    description:
      "machine learning for cybersecurity use cases - detecting malicious certificates!",
    url: "/blog/machine-learning-intern",
  },
  {
    name: "lead developer, project aegis @ national cybersecurity olympiad",
    period: "jan 2025 - mar 2025",
    description:
      "led full-stack development of an ai-access platform for ~90 ctf participants, with rate limiting, llm-guard middleware, playwright e2e tests, and docker containerisation.",
    url: "",
  },
  {
    name: "strategic digital projects intern @ imda",
    period: "may 2024 - aug 2024",
    description:
      "technical research on emerging technologies applied to companies.",
    url: "/blog/sdp-intern",
  },
  {
    name: "national university of singapore",
    period: "2023-2027 (expected)",
    description:
      "pursuing bachelor of computer science, ridge view residential college programme",
    url: "",
  },
  {
    name: "eunoia junior college",
    period: "2019-2020",
    description: "joined ejc media",
    url: "",
  },
];

const projects = [
  {
    name: "confessit.space",
    tech: "Next.js, Supabase, anonymous posting",
    description:
      "an anonymous confession board for campus communities, deployed as a small social product with moderation and fast posting flows.",
    url: "https://confessit.space",
    status: "live site",
  },
  {
    name: "@sg_daily_gospel_bot",
    tech: "Telegram Bot API, scheduled messages",
    description:
      "a telegram bot that sends a daily gospel reading to subscribers without making them open another app or newsletter.",
    url: "https://t.me/sg_daily_gospel_bot",
    status: "telegram bot",
  },
  {
    name: "@aircon_checker_bot",
    tech: "Python, Telegram Bot API, reverse-engineered EVS2 API",
    description:
      "a telegram bot that checks nus aircon credits from the EVS2 portal. type /balance and get the current balance instantly.",
    url: "https://t.me/aircon_checker_bot",
    status: "telegram bot",
  },
  {
    name: "canvas scraper",
    tech: "Python, SQLite, Beautiful Soup",
    description:
      "a cli that syncs canvas files, filters out noisy downloads, and emails daily summaries of announcements and assignments.",
    url: "https://github.com/anselmlong/canvas-scraper",
    status: "cli",
  },
  {
    name: "linkedin shitpost generator",
    tech: "Next.js, React, Tailwind CSS, Google Gemini, OpenRouter",
    description:
      "a satirical web app that generates absurd linkedin-style posts powered by ai. enter a topic, get six comedic personas, from tech-bro earnestness to singapore uncle vibes.",
    url: "https://shitpost.anselmlong.com",
    status: "live site",
  },
  {
    name: "personal portfolio website",
    tech: "Next.js, TypeScript, Tailwind CSS, tRPC, GSAP, LangChain.js",
    description:
      "this site: a portfolio with interactive animation, blog posts, and an ai chat interface backed by rag over my work and experience.",
    url: "/blog/portfolio-website",
    status: "live site",
  },
  {
    name: "miccdrop",
    tech: "React Native, Node.js, Supabase, Spotify API",
    description:
      "a mobile app that rewards users for singing off key with pitch detection and karaoke style lyrics.",
    url: "/blog/miccdrop",
    status: "project write-up",
  },
  {
    name: "freak-cha",
    tech: "Next.js, TypeScript, Tailwind CSS, tRPC, Supabase, YOLOv8",
    description:
      "a captcha-inspired challenge to distinguish humans from ai using facial expression recognition. awarded funniest hack at HackHarvard 2025.",
    url: "/blog/freak-cha",
    status: "hackathon build",
  },
  {
    name: "vbook",
    tech: "Java, JavaFX",
    description:
      "a fast and efficient contact manager for developers, with emphasis on keyboard shortcuts and productivity.",
    url: "/blog/vbook",
    status: "school project",
  },
];

export default function ClientHome() {
  const mainRef = useRef<HTMLElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Global: film frame counter tracks overall scroll progress
  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (counterRef.current) {
            counterRef.current.textContent = `fr ${String(
              Math.round(self.progress * 99) + 1,
            ).padStart(3, "0")} / 100`;
          }
        },
      });
      return () => trigger.kill();
    },
    { scope: mainRef },
  );

  // Closing CTA reveal
  useGSAP(
    () => {
      gsap.from(".animate-up", {
        y: 80,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bottomRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: bottomRef },
  );

  return (
    <main
      ref={mainRef}
      className="bg-background text-foreground selection:bg-primary/20 min-h-screen pt-10"
    >
      <Hero roles={roles} />

      <Marquee
        items={[
          "constantly learning",
          "always improving",
          "never boring",
          "design × engineering",
          "reducing friction",
        ]}
      />

      <AboutSection />

      <ExperienceTimeline experiences={experiences} />

      <ProjectsFilmStrip projects={projects} />

      <section ref={bottomRef} className="relative">
        <div className="animate-up mt-40 mb-24 px-6">
          <p className="eyebrow eyebrow-center mb-6 flex justify-center">
            one more thing
          </p>
          <h1 className="font-bricolage text-foreground-high mb-10 text-center text-4xl leading-tight font-light tracking-tight text-balance md:text-6xl lg:text-7xl">
            still curious? <span className="display-accent">ask.</span>
          </h1>
          <ChatInterface />
        </div>
      </section>

      {/* Fixed film frame counter (desktop) */}
      <span ref={counterRef} className="frame-counter" aria-hidden="true">
        fr 001 / 100
      </span>
    </main>
  );
}
