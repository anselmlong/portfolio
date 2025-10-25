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
    name: "eunoia junior college",
    period: "2019-2020",
    description: "joined ejc media",
    url: ""
  },
  {
    name: "national university of singapore",
    period: "2023-2027 (expected)",
    description: "pursuing bachelor of computer science, ridge view residential college programme",
    url: ""
  },
  {
    name: "strategic digital projects intern @ imda",
    period: "may 2024 - aug 2024",
    description: "technical research on emerging technologies applied to companies. read more below!",
    url: "/blog/sdp-intern"
  },
  {
    name: "machine learning intern @ imda",
    period: "may 2025 - aug 2025",
    description: "machine learning for cybersecurity use cases - detecting malicious certificates!",
    url: "/blog/machine-learning-intern"
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
  const logosRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);

  // Header/stagger animations (stagger-in)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stagger-in",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }
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
            toggleActions: "play none none reverse",
          },
        });
      });
    }, aboutRef);

    return () => ctx.revert();
  }, { dependencies: [], scope: aboutRef });

  // Logos: simple fade/scale in
  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Headline slides in from the right when section enters viewport
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
          },
        });
      });

      // Fade/scale logos in with a staggered fromTo animation scoped to this section
      gsap.fromTo(
        ".logo-item",
        { opacity: 0, scale: 0.9, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: logosRef.current,
            start: "top 60%",
            // ensure the animation runs once when the section enters
            toggleActions: "play none none reverse",
          },
        }
      );
    }, logosRef);

    return () => ctx.revert();
  }, { dependencies: [], scope: logosRef });

  // Experience timeline: individual cards fade/slide up
  useGSAP(() => {
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
          },
        });
      });
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((elem, index) => {
        gsap.from(elem, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          delay: index * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, experienceRef);

    return () => ctx.revert();
  }, { dependencies: [], scope: experienceRef });

  // Projects grid: cards zoom/fade with stagger
  useGSAP(() => {
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
          },
        });
      });
      gsap.from(".project-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.25,
        scrollTrigger: {
          trigger: projectsRef.current,
          start: "top 75%",
        },
      });
    }, projectsRef);

    return () => ctx.revert();
  }, { dependencies: [], scope: projectsRef });

  return (
    <main className="font-mono py-20 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <section ref={headerRef} className="relative py-20">
        <div className="container mx-auto text-center">
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

        <div className="absolute inset-0 overflow pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gray-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
      </section>

      <section ref={aboutRef} className="px-4 md:px-40 mt-40 pb-10 vh-50">
        <div className="stagger-in container mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 justify-center">
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

      <section ref={logosRef} className="mt-40 mb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="animate-right text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
            what i've worked with
          </h1>
        </div>

        <div className="relative mt-12">
          {/* grid wrapper: responsive columns and gap; max width centers content */}
          <div className="stagger-in grid grid-cols-3 gap-6">
            {logos.map((logo) => (
              <div
                key={logo.alt}
                className="logo-item group flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/60 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-white/40 hover:bg-white/10"
              >
                <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg ring-1 ring-black/5 transition-all duration-300 group-hover:ring-white/60">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-10 w-10 md:h-16 md:w-16 object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-sm uppercase tracking-wide text-gray-400 group-hover:text-gray-100">
                  {logo.alt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience timeline */}
      <section ref={experienceRef} className="mt-40 px-6">
        <div className="animate-right max-w-5xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">experience</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
            my journey so far
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            internships, schools, and programs that have shaped how i build.
          </p>
        </div>
        <div className="relative mx-auto mt-14 max-w-5xl">
          <span className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent md:block"></span>
          <div className="space-y-8 md:space-y-10">
            {experiences.map((exp) => (
              <article
                key={exp.name}
                className="timeline-item relative rounded-3xl border border-white/5 bg-slate-900/40 p-6 md:pl-12"
              >
                <span className="absolute -left-[0.4rem] top-8 hidden h-4 w-4 rounded-full bg-white shadow-lg md:block"></span>
                <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.25em] text-gray-400">
                  <span>{exp.period}</span>
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-gray-100">{exp.name}</h3>
                <p className="mt-3 text-gray-300">{exp.description}</p>
                {exp.url && (
                  <a
                    href={exp.url}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-sky-300 hover:text-white"
                  >
                    read more →
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section ref={projectsRef} className="mt-32 px-6 pb-24">
        <div className="animate-right max-w-6xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">projects</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
            stuff i've built
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            hackathons, school and personal projects.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {projects.map((proj, index) => (
            <article
              key={proj.name}
              className="project-card group flex h-full flex-col rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/60 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:-translate-y-3"
            >
              <h3 className="mt-4 text-2xl font-semibold text-gray-100">{proj.name}</h3>
              <p className="mt-2 text-sm font-medium text-sky-200">{proj.tech}</p>
              <p className="mt-4 flex-1 text-gray-300">{proj.description}</p>
              {proj.url && (
                <a
                  href={proj.url}
                  className="mt-6 inline-flex items-center font-semibold text-sky-300 transition-colors hover:text-white"
                >
                  read more →
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
