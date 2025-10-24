// app/ClientHome.tsx
"use client";

import ChatInterface from "~/app/_components/ChatInterface";
import TypingLine from "~/app/_components/TypingLine";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function ClientHome({ hello }: { hello: any }) {
  useGSAP(() => {
    gsap.fromTo(
      ".stagger-in",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, ease: "power2.out", stagger: 0.5 }
    );
  }, []);

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
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="stagger-in text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              hi, i'm anselm.
            </h1>
            <TypingLine strings={roles} />
            <p className="stagger-in text-base text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed">
              want to know more about me? just ask!
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
    </main>
  );
}
