"use client";
import React from "react";

type Props = {
  onNext: () => void;
};

export default function LandingPage({ onNext }: Props) {
  return (
    <section className="relative bg-orange-50 text-[#5d4037] rounded-xl p-6 md:p-10 shadow-lg">
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "#5c1809ff" }}>
          happy birthday baby!! + six months!!
        </h1>
      </div>
      <p className="text-lg leading-relaxed mb-6">
        heyyy pookie!! love you so much and i hope you have a gr888 birthday!! here's a little
        coder boyfriend thing i coded up for you !! hope you enjoy teehee...
      </p>
      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="inline-flex items-center px-5 py-3 rounded-md text-white hover:cursor-auto"
          style={{ backgroundColor: "#c17767" }}
        >
          start →
        </button>
      </div>
    </section>
  );
}
