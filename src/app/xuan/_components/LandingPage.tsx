"use client";
import React from "react";

type Props = {
  onNext: () => void;
};

export default function LandingPage({ onNext }: Props) {
  return (
  <section className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-gray-950 text-stone-200 rounded-xl p-6 md:p-10 shadow-2xl border border-slate-800/30 animate-fadeIn font-sans">
      <div className="mb-4">
  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg animate-fadeIn font-sans" style={{ letterSpacing: "-1px" }}>
          happy 22nd birthday baby!! + six months!!
        </h1>
      </div>
  <p className="text-lg leading-relaxed mb-8 text-[var(--color-white)]/90 animate-fadeIn font-sans">
        heyyy pookie!! love you so much and i hope you have a gr88 birthday!! here's a little
        coder boyfriend thing i cooked up for you !! hope you enjoy teehee...!
      </p>
      <div className="mb-8 grid grid-cols-3 place-items-center">
        <img src="/photos/landing/xuan_2.png" alt="Xuan 2" className="w-48 max-w-md mb-4 rounded-lg shadow-lg" />
        <img src="/photos/landing/xuan_dick.png" alt="Xuan Dick" className="w-48 max-w-md mb-4 rounded-lg shadow-lg" />
        <img src="/photos/landing/xuan_1.png" alt="Xuan 1" className="w-48 max-w-md mb-4 rounded-lg shadow-lg" />
      </div>
      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-slate-900 bg-gradient-to-br from-white to-indigo-300 shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-stone-200/40 font-sans"
        >
          start &rarr;
        </button>
      </div>
    </section>
  );
}
