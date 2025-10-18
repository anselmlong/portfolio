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
    <section className="bg-[#f5ebe0] rounded-xl p-6 md:p-8 shadow-lg">
      {onBack && (
        <button
          onClick={onBack}
          className="text-[#5d4037]/60 hover:text-[#5d4037] transition-colors text-sm mb-4"
          aria-label="Go back"
        >
          ← back
        </button>
      )}
      <h2 className="text-xl font-semibold mb-4" style={{ color: "#5d4037" }}>
        your birthday gifts are ready! 🎉
      </h2>
      <div ref={ref} className="rounded-lg bg-white p-4 text-[#5d4037]">
        <ul className="list-disc pl-5 space-y-1">
          <li>🎵 {selections.vinylPlayer}</li>
          <li>💿 {selections.record ?? "(record)"}</li>
          <li>🌸 {selections.perfume ?? "(perfume)"}</li>
          <li>👖 {selections.pants ?? "(pants)"}</li>
          <li>🎁 {selections.voucher}</li>
        </ul>
        {selections.personalMessage && (
          <div className="mt-4">
            <h3 className="font-semibold mb-1">personal message</h3>
            <p>{selections.personalMessage}</p>
          </div>
        )}
      </div>
      <div className="mt-4">
        <button
          className="px-5 py-3 rounded-md text-white opacity-60 cursor-not-allowed hover:cursor-auto"
          style={{ backgroundColor: "#c17767" }}
          title="Download will be enabled in full implementation"
        >
          download voucher (stub)
        </button>
      </div>
    </section>
  );
}
