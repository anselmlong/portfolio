"use client";
import React from "react";

type Props = {
  onNext: () => void;
};

export default function LandingPage({ onNext }: Props) {
  return (
  <section className="relative bg-gradient-to-br from-[#232946] via-[#1a1a2e] to-[#121629] text-[#eebbc3] rounded-xl p-6 md:p-10 shadow-2xl border border-[#232946]/30 animate-fadeIn font-sans">
      <div className="mb-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#fff] drop-shadow-lg animate-fadeIn font-sans" style={{ letterSpacing: "-1px" }}>
          happy birthday baby!! + six months!!
        </h1>
      </div>
  <p className="text-lg leading-relaxed mb-8 text-[#f6f6f6] animate-fadeIn font-sans">
        heyyy pookie!! love you so much and i hope you have a gr888 birthday!! here's a little
        coder boyfriend thing i coded up for you !! hope you enjoy teehee...
      </p>
      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-[#232946] bg-gradient-to-br from-[#fff] to-[#b8c1ec] shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#eebbc3]/40 font-sans"
        >
          start &rarr;
        </button>
      </div>
    </section>
  );
}
