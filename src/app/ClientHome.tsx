// app/ClientHome.tsx
"use client";

import ChatInterface from "~/app/_components/ChatInterface";
import TypingLine from "~/app/_components/TypingLine";
import AuroraBackground from "~/app/_components/AuroraBackground";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import ExperienceTimeline from "~/app/_components/ExperienceTimeline";
import ProjectsGrid from "~/app/_components/ProjectsGrid";

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
      "a cli that syncs canvas files, filters out noisy downloads, and emails daily summaries of announcements and assignments. next step: a small hero site at canvas.anselmlong.com.",
    url: "https://github.com/anselmlong/canvas-scraper",
    status: "cli, hero site next",
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
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning,";
  if (hour >= 12 && hour < 17) return "afternoon,";
  if (hour >= 17 && hour < 21) return "evening,";
  return "hi,";
};

export default function ClientHome() {
  // Use a separate ref per section and scope GSAP contexts to each ref.
  const headerRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Header/stagger animations (stagger-in)
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        // Fade the hero arrow out as the user scrolls past the header.
        // Using fromTo + scrub maps scroll progress to the opacity/position.
        gsap.fromTo(
          ".hero-arrow",
          { autoAlpha: 1, y: 0 },
          {
            autoAlpha: 0,
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top top",
              end: "bottom 50%",
              scrub: true,
              // markers: true, // enable while tuning start/end
            },
          },
        );
      }, headerRef);

      return () => ctx.revert();
    },
    { dependencies: [], scope: headerRef },
  );

  // About section: animate image left / text right using scoped selectors
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".animate-left").forEach((elem) => {
          gsap.from(elem, {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 70%",
              scrub: 1,
              toggleActions: "play none none reverse",
            },
          });
        });

        gsap.utils.toArray<HTMLElement>(".animate-right").forEach((elem) => {
          gsap.from(elem, {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 70%",
              scrub: 1,
              toggleActions: "play none none reverse",
            },
          });
        });
      }, aboutRef);

      return () => ctx.revert();
    },
    { dependencies: [], scope: aboutRef },
  );

  useGSAP(() => {
    return gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".animate-up").forEach((elem) => {
        gsap.from(elem, {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, bottomRef);
  });

  // Logos section extracted to LogosGrid component (handles its own GSAP scope)

  // Experience timeline extracted to ExperienceTimeline component

  // Projects grid extracted to ProjectsGrid component

  return (
    <main className="bg-background text-foreground selection:bg-primary/20 min-h-screen py-20">
      <section ref={headerRef} className="relative py-20">
        <AuroraBackground />
        <div className="mx-auto text-center">
          <div className="mb-8">
            <h1 className="stagger-in font-bricolage text-foreground-high mb-6 text-5xl leading-none font-extralight tracking-tight text-balance md:text-7xl">
              {getGreeting()} i&apos;m anselm.
            </h1>
            <TypingLine strings={roles} />
            <p className="stagger-in text-muted-foreground mx-auto mb-3 max-w-2xl text-lg leading-relaxed font-light text-pretty">
              i&apos;m currently studying computer science @ nus, with an
              interest in AI and ML. ask me anything!
            </p>
          </div>
        </div>

        <div className="stagger-in">
          <ChatInterface />
        </div>

        <div className="fade-in hero-arrow mt-20 flex flex-col items-center">
          <h6 className="scroll-text text-muted-foreground mb-2 ml-3 font-sans text-xs uppercase">
            scroll
          </h6>
          <svg
            className="scroll-arrow text-muted-foreground ml-2 size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      <section ref={aboutRef} className="vh-50 mt-40 px-0 pb-10 md:px-40">
        <div className="stagger-in container mx-auto flex flex-col items-center justify-center gap-8 md:flex-row md:gap-12">
          <img
            src="/photos/main/portrait.jpeg"
            alt="Anselm Long"
            className="animate-left size-48 flex-none rounded-full border-2 border-white/5 object-cover pt-4 opacity-90 transition-opacity duration-200 ease-out hover:opacity-100 md:size-64"
          />
          <div className="animate-right max-w-2xl text-left md:text-left">
            <h2 className="font-bricolage text-foreground-high mb-4 text-4xl leading-tight font-light tracking-tight text-balance md:mb-6 md:text-5xl lg:text-6xl">
              welcome to my portfolio!
            </h2>
            <p className="text-muted-foreground max-w-prose text-justify text-lg leading-relaxed font-light text-pretty md:text-xl">
              i am a year 3 computer science major at nus. i&apos;m interested
              in machine learning and how computers can do cool stuff. i love
              all things bouldering, exploring new things, as well as
              photography and videography! other than that, i have small
              interests in doing latte art, and i love a good matcha!
            </p>
          </div>
        </div>
      </section>

      <ExperienceTimeline experiences={experiences} />

      <ProjectsGrid projects={projects} />

      <section ref={bottomRef}>
        <div className="animate-up mt-50 mb-20 px-6">
          <h1 className="font-bricolage text-foreground-high mb-8 text-center text-3xl leading-tight font-light tracking-tight text-balance md:text-5xl">
            still have more questions? ask!
          </h1>
          <ChatInterface />
        </div>
      </section>
    </main>
  );
}
