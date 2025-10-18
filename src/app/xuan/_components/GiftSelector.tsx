"use client";
import React, { useState } from "react";

export type GiftSelections = {
  vinylPlayer: string;
  record: string | null;
  perfume: string | null;
  pants: string | null;
  voucher: "$150 Shopping Voucher";
  personalMessage: string;
};

type Props = {
  selections: GiftSelections;
  onUpdate: (partial: Partial<GiftSelections>) => void;
  onComplete: () => void;
  onBack?: () => void;
};
const records = [
  {
    "name": "submarine",
    "artist": "the marias",
    "url": "/elements/the marias.png"
  },
  {
    "name": "beerbongs and bentleys",
    "artist": "post malone",
    "url": "/elements/post malone.png"
  },
  {
    "name": "born to die",
    "artist": "lana del rey",
    "url": "/elements/lana del rey.png"
  }
]

const perfumes = [
  {
    "name": "glass blooms",
    "perfumer": "regine de fleur",
    "url": "/elements/glass blooms.png"
  },
  {
    "name": "osmanthus",
    "perfumer": "tosummer",
    "url": "/elements/osmanthus.png"
  },
  {
    "name": "white rice",
    "perfumer": "d'Annam",
    "url": "/elements/white rice.png"
  }
]
const pants = [
  {
    "name": "BDG barrel jeans in white",
    "url": "/elements/white jeans.png",
  }
]


const pantsOptions = ["BDG barrel jeans in white", "Yuan Wide-Leg Pants", "woman's puma navy williams polo"] as const;

export default function GiftSelector({ selections, onUpdate, onComplete, onBack }: Props) {
  const [stage, setStage] = useState(1);

  const next = () => setStage((s) => Math.min(5, s + 1));

  const canProceed = () => {
    if (stage === 1) return true; // vinylPlayer pre-selected
    if (stage === 2) return selections.record != null;
    if (stage === 3) return selections.perfume != null;
    if (stage === 4) return selections.pants != null;
    return true;
  };

  const renderStage = () => {
    if (stage === 1)
      return (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-[#5d4037]">✨ firstly: you get to redeem a vinyl player!</h3>
          <div className="rounded-lg bg-gradient-to-br from-[#e6ddd0] to-[#d9c5b2] p-6 shadow-md border border-[#d4a574]/30">
            <div className="text-4xl mb-2">🎵</div>
            <div className="font-medium text-[#5d4037]">audio technica - aesthetic era!!</div>
          </div>
        </div>
      );
    if (stage === 2)
      return (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-[#5d4037]">💿 secondly: with a player, you need more records! choose 1!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {records.map((record) => (
              <button
                key={record.name}
                onClick={() => onUpdate({ record: record.name })}
                aria-pressed={selections.record === record.name}
                className={`group relative rounded-lg p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col h-full ${selections.record === record.name
                    ? "bg-[#c17767] text-white ring-2 ring-[#c17767] ring-offset-2"
                    : "bg-white hover:bg-[#f5ebe0] shadow-md"
                  }`}
              >
                <img
                  src={record.url}
                  alt={`${record.name} by ${record.artist}`}
                  width={240}
                  height={240}
                  className="rounded-md w-full aspect-square object-contain mb-3 group-hover:opacity-90 transition-opacity"
                />
                <div
                  className={`mt-auto font-medium text-center ${selections.record === record.name ? "text-white" : "text-[#5d4037]"
                    }`}
                >
                  <div className="font-bold text-center">{record.name}</div>
                  <div className="text-sm font-medium text-center">by {record.artist}</div>
                </div>
                {selections.record === record.name && (
                  <div className="absolute top-2 right-2 bg-white text-[#c17767] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    if (stage === 3)
      return (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-[#5d4037]">🌸 now, to up your scent game! pick one!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {perfumes.map((perfume) => (
              <button
                key={perfume.name}
                onClick={() => onUpdate({ perfume: perfume.name })}
                aria-pressed={selections.perfume === perfume.name}
                className={`relative rounded-lg p-4 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col h-full ${selections.perfume === perfume.name
                    ? "bg-[#c17767] text-white ring-2 ring-[#c17767] ring-offset-2"
                    : "bg-white hover:bg-[#f5ebe0] shadow-md"
                  }`}
              >
                <img
                  src={perfume.url}
                  alt={`${perfume.name} by ${perfume.perfumer}`}
                  width={240}
                  height={240}
                  className="rounded-md w-full aspect-square object-contain mb-3 group-hover:opacity-90 transition-opacity"
                />
                <div className="mt-auto font-bold text-center">{perfume.name}</div>
                <div className="text-sm font-medium text-center">by {perfume.perfumer}</div>
                {selections.perfume === perfume.name && (
                  <div className="absolute top-2 right-2 bg-white text-[#c17767] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    if (stage === 4)
      return (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-[#5d4037]">👖 some wardrobe upgrades: pick what looks good!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pantsOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => onUpdate({ pants: opt })}
                className={`relative rounded-lg p-4 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${selections.pants === opt
                    ? "bg-[#c17767] text-white ring-2 ring-[#c17767] ring-offset-2"
                    : "bg-white hover:bg-[#f5ebe0] shadow-md"
                  }`}
              >
                <div className="text-2xl mb-2">👖</div>
                <div className="font-medium">{opt}</div>
                {selections.pants === opt && (
                  <div className="absolute top-2 right-2 bg-white text-[#c17767] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    return (
      <div className="space-y-4 animate-fadeIn">
        <h3 className="text-lg font-semibold text-[#5d4037]">💰 all these gifts won't reach you now... but CASH IS KING!!!</h3>
        <div className="space-y-3">
          <div className="rounded-lg bg-gradient-to-br from-[#f5ebe0] to-[#e6ddd0] p-4 shadow-md border border-[#d4a574]/30">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <span className="font-medium text-[#5d4037]">$150 shopping voucher for you ❤️</span>
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-[#f5ebe0] to-[#e6ddd0] p-4 shadow-md border border-[#d4a574]/30">
            <div className="flex items-center gap-2">
              <span className="text-2xl">�️</span>
              <span className="font-medium text-[#5d4037]">redeem for a nice dinner in prague!</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-[#5d4037] mb-2">
            add a personal message (optional)
          </label>
          <textarea
            value={selections.personalMessage}
            onChange={(e) => onUpdate({ personalMessage: e.target.value })}
            placeholder="write something sweet here..."
            className="w-full rounded-lg border-2 border-[#d4a574]/30 focus:border-[#c17767] focus:ring-2 focus:ring-[#c17767]/20 bg-white p-4 text-[#5d4037] transition-all"
            rows={4}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[#f5ebe0] rounded-xl p-6 md:p-10 shadow-2xl border border-[#d4a574]/20">
      {onBack && (
        <button
          onClick={onBack}
          className="text-[#5d4037]/60 hover:text-[#5d4037] transition-colors text-sm mb-6 flex items-center gap-1"
          aria-label="Go back"
        >
          ← back
        </button>
      )}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-[#5d4037]">
          build your own gift package! 🎁
        </h2>
        <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-[#5d4037] shadow-sm">
          {stage} / 5
        </div>
      </div>

      <div className="mb-8">{renderStage()}</div>

      <div className="flex justify-between items-center gap-3">
        {stage > 1 && (
          <button
            onClick={() => setStage((s) => Math.max(1, s - 1))}
            className="px-4 py-2 rounded-lg text-[#5d4037] bg-white hover:bg-[#e6ddd0] transition-all shadow-sm"
          >
            ← previous
          </button>
        )}
        <div className="flex-1" />
        {stage < 5 ? (
          <button
            onClick={() => canProceed() && next()}
            disabled={!canProceed()}
            className="px-6 py-3 rounded-lg text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:shadow-lg transition-all transform enabled:hover:scale-105 bg-[#c17767]"
          >
            next →
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg transition-all transform hover:scale-105 bg-[#c17767]"
          >
            generate voucher →
          </button>
        )}
      </div>
    </section>
  );
}
