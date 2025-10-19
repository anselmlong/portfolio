"use client";
import React, { useState } from "react";

export type GiftSelections = {
  vinylPlayer: string | null;
  record: string | null;
  perfume: string | null;
  pants: string | null;
  f1: string | null;
  voucher: "$150 Shopping Voucher";
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
  },
  {
    "name": "Yuan Wide-Leg Pants",
    "url": "/elements/black pants.png",
  },
  {
    "name": "Navy Jeans",
    "url": "/elements/navy jeans.png",
  }
]
const f1 = [
  {
    "name": "ferrari polo",
    "url": "/elements/f1_ferrari.png"
  },
  {
    "name": "mercedes polo",
    "url": "/elements/f1_mercedes.png"
  },
  {
    "name": "red bull polo",
    "url": "/elements/f1_redbull.png"
  },
  {
    "name": "williams polo",
    "url": "/elements/f1_williams.png"
  },
  {
    "name": "mercedes hoodie",
    "url": "/elements/f1_mercedes_hoodie.png"
  }
]
const playerUrl = "/elements/turntable.png"
const playerName = "audio technica AT-LP60X"

export default function GiftSelector({ selections, onUpdate, onComplete, onBack }: Props) {
  const [stage, setStage] = useState(1);
  const next = () => setStage((s) => Math.min(5, s + 1));

  const canProceed = () => {
    if (stage === 1) return true; // vinylPlayer pre-selected
    if (stage === 2) return selections.record != null;
    if (stage === 3) return selections.perfume != null;
    if (stage === 4) return selections.pants != null;
    if (stage === 5) return selections.f1 != null
    return true;
  };

  const renderStage = () => {
    if (stage === 1)
      return (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-[#5d4037]">✨ firstly: you get to redeem a vinyl player!</h3>
          {(() => {
            const selected = selections.vinylPlayer === playerName;
            return (
              <>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdate({ vinylPlayer: playerName });
                    }}
                    aria-pressed={selected}
                    className={`relative w-48 text-center rounded-lg p-6 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl border ${
                      selected
                        ? "bg-[#c17767] text-white ring-2 ring-[#c17767] ring-offset-2 border-transparent"
                        : "bg-gradient-to-br from-[#e6ddd0] to-[#d9c5b2] text-[#5d4037] border-[#d4a574]/30 shadow-md"
                    }`}
                  >
                    <div className="w-full aspect-square grid place-items-center mb-3">
                      <img
                        src={playerUrl}
                        alt="Vinyl Player"
                        width={160}
                        height={160}
                        className="max-w-[85%] max-h-[85%] object-contain"
                      />
                    </div>
                    <div className={`font-medium ${selected ? "text-white" : "text-[#5d4037]"}`}>
                      {playerName} 
                    </div>
                    {selected && (
                      <div className="absolute top-2 right-2 bg-white text-[#c17767] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                </div>
                {selected && (
                  <div className="mt-6 flex justify-center animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdate({ vinylPlayer: playerName });
                        const link = document.createElement("a");
                        link.href = "/vouchers/vinyl.png";
                        link.download = "vinyl.png";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="px-6 py-3 rounded-lg text-white font-medium shadow-lg transition-all transform hover:scale-105 bg-[#c17767] focus:outline-none focus:ring-2 focus:ring-[#c17767]/40"
                    >
                      <span className="inline-flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-4 4V4m8 16H4" /></svg>
                        download voucher
                      </span>
                    </button>
                  </div>
                )}
              </>
            );
          })()}
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
                className={`group relative rounded-lg p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col h-full ${
                  selections.record === record.name
                    ? "bg-[#c17767] text-white ring-2 ring-[#c17767] ring-offset-2"
                    : "bg-white hover:bg-[#f5ebe0] shadow-md"
                }`}
              >
                <div className="w-full aspect-square grid place-items-center mb-3">
                  <img
                    src={record.url}
                    alt={`${record.name} by ${record.artist}`}
                    width={240}
                    height={240}
                    className="max-w-[85%] max-h-[85%] object-contain group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <div
                  className={`mt-auto font-medium text-center ${
                    selections.record === record.name ? "text-white" : "text-[#5d4037]"
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
                <div className="w-full aspect-square grid place-items-center mb-3">
                  <img
                    src={perfume.url}
                    alt={`${perfume.name} by ${perfume.perfumer}`}
                    width={240}
                    height={240}
                    className="max-w-[85%] max-h-[85%] object-contain group-hover:opacity-90 transition-opacity"
                  />
                </div>
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
            {pants.map((opt) => (
              <button
                key={opt.name}
                onClick={() => onUpdate({ pants: opt.name })}
                className={`relative rounded-lg p-4 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${selections.pants === opt.name
                    ? "bg-[#c17767] text-white ring-2 ring-[#c17767] ring-offset-2"
                    : "bg-white hover:bg-[#f5ebe0] shadow-md"
                  }`}
              >
                <div className="w-full aspect-square grid place-items-center mb-3">
                  <img
                    src={opt.url}
                    alt={`${opt.name}`}
                    width={240}
                    height={240}
                    className="max-w-[85%] max-h-[85%] object-contain group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="font-medium">{opt.name}</div>
                {selections.pants === opt.name && (
                  <div className="absolute top-2 right-2 bg-white text-[#c17767] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    if (stage === 5)
      return (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-[#5d4037]">vroom vroom! some f1 merch for you!!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {f1.map((opt) => (
              <button
                key={opt.name}
                onClick={() => onUpdate({ f1: opt.name })}
                className={`relative rounded-lg p-4 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${selections.f1 === opt.name
                    ? "bg-[#c17767] text-white ring-2 ring-[#c17767] ring-offset-2"
                    : "bg-white hover:bg-[#f5ebe0] shadow-md"
                  }`}
              >
                <div className="w-full aspect-square grid place-items-center mb-3">
                  <img
                    src={opt.url}
                    alt={`${opt.name}`}
                    width={240}
                    height={240}
                    className="max-w-[85%] max-h-[85%] object-contain group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="font-medium">{opt.name}</div>
                {selections.f1 === opt.name && (
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
          {/* Shopping voucher */}
          <div className="rounded-lg bg-gradient-to-br from-[#f5ebe0] to-[#e6ddd0] p-4 shadow-md border border-[#d4a574]/30">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <span className="font-medium text-[#5d4037]">$150 shopping voucher for you ❤️</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/vouchers/shopping.png";
                  link.download = "shopping.png";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-3 py-2 rounded-md text-white bg-[#c17767] hover:opacity-95 text-sm font-medium shadow inline-flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-4 4V4m8 16H4" /></svg>
                download
              </button>
            </div>
          </div>
          {/* Dinner voucher */}
          <div className="rounded-lg bg-gradient-to-br from-[#f5ebe0] to-[#e6ddd0] p-4 shadow-md border border-[#d4a574]/30">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                <span className="font-medium text-[#5d4037]">redeem for a nice dinner in prague!</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/vouchers/dinner.png";
                  link.download = "dinner.png";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-3 py-2 rounded-md text-white bg-[#c17767] hover:opacity-95 text-sm font-medium shadow inline-flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-4 4V4m8 16H4" /></svg>
                download
              </button>
            </div>
          </div>
          {/* Massage voucher */}
          <div className="rounded-lg bg-gradient-to-br from-[#f5ebe0] to-[#e6ddd0] p-4 shadow-md border border-[#d4a574]/30">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💆</span>
                <span className="font-medium text-[#5d4037]">free massage voucher</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/vouchers/massage.png";
                  link.download = "massage.png";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-3 py-2 rounded-md text-white bg-[#c17767] hover:opacity-95 text-sm font-medium shadow inline-flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-4 4V4m8 16H4" /></svg>
                download
              </button>
            </div>
          </div>
        </div>
        {/* Personal message removed as requested */}
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-br from-[#232946] via-[#1a1a2e] to-[#121629] rounded-xl p-6 md:p-10 shadow-2xl border border-[#232946]/30 font-sans">
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
        <h2 className="text-3xl md:text-4xl font-bold text-[#fff] drop-shadow mb-2 font-sans">
          build your own gift package! 🎁
        </h2>
  <div className="bg-[#fff] px-3 py-1 rounded-full text-sm font-medium text-[#232946] shadow-sm">
          {stage} / 6
        </div>
      </div>

  <div className="mb-8">{renderStage()}</div>

      <div className="flex justify-between items-center gap-3">
        {stage > 1 && (
          <button
            onClick={() => setStage((s) => Math.max(1, s - 1))}
            className="px-4 py-2 rounded-lg text-[#232946] bg-[#eebbc3] hover:bg-[#b8c1ec] transition-all shadow-sm font-sans"
          >
            ← previous
          </button>
        )}
        <div className="flex-1" />
        {stage < 6 ? (
          <button
            onClick={() => canProceed() && next()}
            disabled={!canProceed()}
            className="px-6 py-3 rounded-lg text-[#232946] font-medium disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:shadow-lg transition-all transform enabled:hover:scale-105 bg-gradient-to-br from-[#eebbc3] to-[#b8c1ec] font-sans"
          >
            next →
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-6 py-3 rounded-lg text-[#232946] font-medium hover:shadow-lg transition-all transform hover:scale-105 bg-gradient-to-br from-[#eebbc3] to-[#b8c1ec] font-sans"
          >
            generate voucher →
          </button>
        )}
      </div>
    </section>
  );
}
