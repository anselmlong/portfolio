"use client";
import React, { useRef } from "react";
import type { GiftSelections } from "./GiftSelector";

type Props = {
  selections: GiftSelections;
  onBack?: () => void;
};

export default function VoucherGenerator({ selections, onBack }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-950 rounded-xl p-6 md:p-8 shadow-2xl border border-slate-800/30 font-sans">
      {onBack && (
        <button
          onClick={onBack}
          className="text-indigo-300 hover:text-stone-200 transition-colors text-sm mb-4"
          aria-label="Go back"
        >
          ← back
        </button>
      )}
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow font-sans">
        your birthday gifts are ready! 🎉
      </h2>
  <div ref={ref} className="rounded-lg bg-white p-4 text-slate-900 font-sans">
  <ul className="list-disc pl-5 space-y-1">
          <li>🎵 {selections.vinylPlayer}</li>
          <li>💿 {selections.record ?? "(record)"}</li>
          <li>🌸 {selections.perfume ?? "(perfume)"}</li>
          <li>👖 {selections.pants ?? "(pants)"}</li>
          <li>🎁 {selections.voucher}</li>
        </ul>
        {/* personal message removed */}
      </div>
      <div className="mt-4">
        <button
          className="px-5 py-3 rounded-lg font-semibold text-slate-900 bg-gradient-to-br from-stone-200 to-indigo-300 shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-stone-200/40 font-sans opacity-60 cursor-not-allowed"
          title="Download will be enabled in full implementation"
        >
          download voucher (stub)
        </button>
      </div>
    </section>
  );
}
