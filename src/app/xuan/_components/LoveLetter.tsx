"use client";
import React from "react";

type Props = {
  onNext: () => void;
};

export default function LoveLetter({ onNext }: Props) {
  return (
    <section className="relative bg-[#f5ebe0] text-[#5d4037] rounded-xl p-6 md:p-10 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "#c17767" }}>
          a little note for you ❤️
        </h2>
      </div>
      
      <div className="space-y-4 text-base md:text-lg leading-relaxed mb-6">
        <p>
          my beloved huang shao xuan...
        </p>
        
        <p>
          when i first set eyes on you i was mesmerized...
        </p>
        
        <p>
          love you always,<br />
          your boyfriend!! (anselm pius long)
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="inline-flex items-center px-5 py-3 rounded-md text-white"
          style={{ backgroundColor: "#c17767" }}
        >
          continue →
        </button>
      </div>
    </section>
  );
}
