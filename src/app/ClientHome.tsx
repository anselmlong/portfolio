// app/ClientHome.tsx
"use client";

import ChatInterface from "~/app/_components/ChatInterface";
import TypingLine from "~/app/_components/TypingLine";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { RouterOutputs } from "~/trpc/react";
import { useRef } from "react";
import { log } from "console";
import LogosGrid from "~/app/_components/LogosGrid";
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
];


const experiences = [
  {
    name: "machine learning intern @ imda",
    period: "may 2025 - aug 2025",
    description: "machine learning for cybersecurity use cases - detecting malicious certificates!",
    url: "/blog/machine-learning-intern"
  },
  {
    name: "strategic digital projects intern @ imda",
    period: "may 2024 - aug 2024",
    description: "technical research on emerging technologies applied to companies.",
    url: "/blog/sdp-intern"
  },
  {
    name: "national university of singapore",
    period: "2023-2027 (expected)",
    description: "pursuing bachelor of computer science, ridge view residential college programme",
    url: ""
  },
  {
    name: "eunoia junior college",
    period: "2019-2020",
    description: "joined ejc media",
    url: ""
  }
]

const projects = [
  {
    name: "personal portfolio website",
    tech: "Next.js, TypeScript, Tailwind CSS, tRPC, GSAP, LangChain.js",
    description: "a portfolio website to showcase my projects, experiences, and skills. features interactive animations, a chat interface powered by ai, and a sleek responsive design.",
    url: "/blog/portfolio-website"
  },
  {
    name: "freak-cha",
    tech: "Next.js, TypeScript, Tailwind CSS, tRPC, Supabase, YOLOv8",
    description: "CAPTCHA-inspired challenge to distinguish humans from AI using facial expression recognition; awarded Funniest Hack at HackHarvard 2025",
    url: "/blog/freak-cha"
  },
  {
    name: "miccdrop",
    tech: "React Native, Node.js, Supabase, Spotify API",
    description: "a mobile app that rewards users for singing off key with pitch detection and karaoke style lyrics.",
    url: "/blog/miccdrop"
  },
  {
    name: "vbook",
    tech: "Java, JavaFX",
    description: "a fast and efficient contact manager for developers, with empahsis on keyboard shortcuts and productivity.",
    url: "/blog/vbook"
  }
]
const logos = [
  { src: "/elements/logos/c++.png", alt: "C++" },
  { src: "/elements/logos/c.png", alt: "C" },
  { src: "/elements/logos/java.png", alt: "Java" },
  { src: "/elements/logos/javascript.png", alt: "JavaScript" },
  { src: "/elements/logos/latex.png", alt: "LaTeX" },
  { src: "/elements/logos/nextjs.png", alt: "Next.js" },
  { src: "/elements/logos/numpy.png", alt: "NumPy" },
  { src: "/elements/logos/pandas.png", alt: "Pandas" },
  { src: "/elements/logos/postgresql.png", alt: "PostgreSQL" },
  { src: "/elements/logos/react.png", alt: "React" },
  { src: "/elements/logos/scikit-learn.png", alt: "Scikit Learn" },
  { src: "/elements/logos/supabase.png", alt: "Supabase" },
  { src: "/elements/logos/tailwind.png", alt: "Tailwind" },
  { src: "/elements/logos/trpc.png", alt: "tRPC" },
  { src: "/elements/logos/typescript.png", alt: "TypeScript" },
];
export default function ClientHome() {
  // Use a separate ref per section and scope GSAP contexts to each ref.
  const headerRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Header/stagger animations (stagger-in)
  useGSAP(() => {
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
        }
      );
    }, headerRef);

    return () => ctx.revert();
  }, { dependencies: [], scope: headerRef });

  // About section: animate image left / text right using scoped selectors
  useGSAP(() => {
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
  }, { dependencies: [], scope: aboutRef });

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
    <main className="font-mono py-20 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <section ref={headerRef} className="relative py-20">
  <div className="mx-auto text-center">
          <div className="mb-8">
            <h1 className="stagger-in text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              hi, i&apos;m anselm.
            </h1>
            <TypingLine strings={roles} />
            <p className="stagger-in text-base text-gray-400 mb-3 max-w-4xl mx-auto leading-relaxed">
              i'm currently studying computer science @ nus, with an interest in AI and ML. ask me anything!
            </p>
          </div>
        </div>

        <div className="stagger-in">
          <ChatInterface />
        </div>

        <div className="flex flex-col items-center fade-in hero-arrow mt-20">
          <h6 className="text-gray-400 mb-2 ml-3 animate-bounce">scroll</h6>
          <svg
            className="ml-2 w-6 h-6 text-gray-400 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="absolute inset-0 overflow pointer-events-none">
          <div className="absolute top-1/4 left-0 w-32 h-32 bg-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gray-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

      </section>

  <section ref={aboutRef} className="px-0 md:px-40 mt-40 pb-10 vh-50">
        <div className="stagger-in container mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <img
            src="/photos/main/portrait.jpeg"
            alt="Anselm Long"
            className="animate-left flex-none pt-4 w-48 h-48 md:w-64 md:h-64 rounded-full object-cover"
          />
          <div className="animate-right text-left md:text-left max-w-2xl">
            <h2 className=" text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              welcome to my portfolio!
            </h2>
            <p className=" text-base text-justify md:text-lg leading-relaxed text-gray-300 max-w-prose">
              i am a year 3 computer science major at nus. i'm interested in machine learning and how computers can do cool stuff. i love all things bouldering, exploring new things, as well as photography and videography! other than that, i have small interests in doing latte art, and i love a good matcha!
            </p>
          </div>
        </div>
      </section>

      <LogosGrid logos={logos} />

      <ExperienceTimeline experiences={experiences} />

      <ProjectsGrid projects={projects} />

      <section ref={bottomRef}>
        <div className="animate-up mt-50 mb-20 px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent text-center">
            still have more questions? ask!
          </h1>
          <ChatInterface />
        </div>
      </section>
    </main>
  );
}
