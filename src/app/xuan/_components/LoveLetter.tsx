"use client";
import React from "react";

type Props = {
  onNext: () => void;
  onBack?: () => void;
};

const message = (
  <div>
    <p>my beloved huang shao xuan...</p>
    <p>when i first set eyes on you i was mesmerized...</p>
    <p>love you always,<br />your boyfriend!! (anselm pius long)</p>
  </div>
)

export default function LoveLetter({ onNext, onBack }: Props) {
  const [revealLetter, setRevealLetter] = React.useState(false);
  return (
  <section className="relative bg-gradient-to-br from-[#232946] via-[#1a1a2e] to-[#121629] text-[#eebbc3] rounded-xl p-6 md:p-10 shadow-2xl border border-[#232946]/30 animate-fadeIn font-sans">
      {onBack && (
        <button
          onClick={onBack}
          className="text-[#b8c1ec]/70 hover:text-[#eebbc3] transition-colors text-sm mb-4 font-medium font-sans"
          aria-label="Go back"
        >
          &larr; back
        </button>
      )}
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#fff] drop-shadow-lg animate-fadeIn font-sans">
          a little note for you ❤️
        </h2>
      </div>
      <button
        onClick={() => setRevealLetter((v) => !v)}
        aria-pressed={revealLetter}
        className="mb-6 px-4 py-2 bg-[#eebbc3]/20 hover:bg-[#eebbc3]/30 rounded-lg text-[#eebbc3] hover:text-[#fff] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#eebbc3]/40 font-sans"
      >
        {revealLetter ? "hide letter" : "reveal letter"}
      </button>
      {revealLetter && (
        <div className="space-y-4 text-lg md:text-xl leading-relaxed mb-8 text-[#f6f6f6] animate-fadeIn font-sans">
          {message}
        </div>
      )}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-[#232946] bg-gradient-to-br from-[#fff] to-[#b8c1ec] shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#eebbc3]/40 font-sans"
        >
          continue &rarr;
        </button>
      </div>
    </section>
  );
}
