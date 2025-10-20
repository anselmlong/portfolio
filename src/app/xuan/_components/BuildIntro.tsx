"use client";
import React from "react";
import confetti from "canvas-confetti";

type Props = {
  onBuild: () => void;
  onBack?: () => void;
};

export default function BuildIntro({ onBuild, onBack }: Props) {
  const handleBuild = () => {
    // Trigger confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Call the original onBuild after a brief delay to let confetti start
    setTimeout(() => onBuild(), 300);
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-gray-950 text-stone-200 rounded-xl p-6 md:p-10 shadow-2xl border border-slate-800/30 animate-fadeIn font-sans">
      {onBack && (
        <button
          onClick={onBack}
          className="text-indigo-300 hover:text-stone-200 transition-colors text-sm mb-6"
          aria-label="Go back"
        >
          ← back
        </button>
      )}

	<h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow mb-6">
	  you get to build your own birthday gifts! 🎁
	</h2>
	<div className="max-w-prose text-white/85 font-serif leading-relaxed space-y-4">
	  <p>
		long distance sucks! i can't give you presents in person, so i wanted to let you choose your perfect birthday gifts from a curated selection of things i think you'd like!
	  </p>
	  <p>
		hopefully some of them surprise you! there are a few stages that correspond to your interests - so i tried to get you something from every part of your life that makes you, you!
	  </p>
	  <p>
		whatever you select, i'll procure and pass you in prague/singapore :) if you don't like any of the options, there'll be a text box where you can hint what you're eyeing at the particular moment, and i'll make it happen ;)
	  </p>
	  <p>
		without further ado!! let's build!!!
	  </p>
	</div>

      <div className="flex justify-center">
        <button
          onClick={handleBuild}
          className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-slate-900 bg-gradient-to-br from-stone-200 to-indigo-300 shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-stone-200/40"
        >
          build!
        </button>
      </div>
    </section>
  );
}
