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
    <section className="bg-gradient-to-br from-[#232946] via-[#1a1a2e] to-[#121629] rounded-xl p-6 md:p-8 shadow-2xl border border-[#232946]/30 font-sans">
      {onBack && (
        <button
          onClick={onBack}
          className="text-[#5d4037]/60 hover:text-[#5d4037] transition-colors text-sm mb-4"
          aria-label="Go back"
        >
          ← back
        </button>
      )}
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#fff] drop-shadow font-sans">
        your birthday gifts are ready! 🎉
      </h2>
  <div ref={ref} className="rounded-lg bg-[#fff] p-4 text-[#232946] font-sans">
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
          className="px-5 py-3 rounded-lg font-semibold text-[#232946] bg-gradient-to-br from-[#eebbc3] to-[#b8c1ec] shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#eebbc3]/40 font-sans opacity-60 cursor-not-allowed"
          title="Download will be enabled in full implementation"
        >
          download voucher (stub)
        </button>
      </div>
    </section>
  );
}
