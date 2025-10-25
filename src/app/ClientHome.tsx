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

const logos = [
  { src: "/elements/logos/C++_Logo.svg", alt: "C++" },
  { src: "/elements/logos/C_Programming_Language.svg", alt: "C" },
  { src: "/elements/logos/java.png", alt: "Java" },
  { src: "/elements/logos/js.png", alt: "JavaScript" },
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
            start: "top 50%",
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
            start: "top 50%",
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
      gsap.fromTo(
        ".logo-item",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: logosRef.current,
            start: "top 80%",
          },
        }
      );
    }, logosRef);

    return () => ctx.revert();
  }, { dependencies: [], scope: logosRef });

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

  <section ref={logosRef} className="mt-40 mb-20 text-center">
        <h1 className="animate-left text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
          what i've worked with
        </h1>
        <div className="stagger-in flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {logos.map(logo => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="logo-item h-24 md:h-32 object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
