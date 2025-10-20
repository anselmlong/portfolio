"use client";
import React, { useMemo, useState } from "react";
import { SelectionGrid, type SelectionItem } from "./SelectionGrid";

export type GiftSelections = {
  vinylPlayer: string | null;
  vinylPlayerCustom: string | null;
  record: string | null;
  recordCustom: string | null;
  perfume: string | null;
  perfumeCustom: string | null;
  pants: string | null;
  pantsCustom: string | null;
  f1: string | null;
  f1Custom: string | null;
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
];

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
];
const pants = [
  {
    "name": "BDG Barrel Jeans in White",
    "url": "/elements/white jeans.png",
  },
  {
    "name": "Yuan Wide-Leg Pants",
    "url": "/elements/black pants.png",
  },
  {
    "name": "Gen Heavy Washed Wide Cut Jeans",
    "url": "/elements/navy jeans.png",
  }
];
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
  },
  {
    "name": "ferrari jacket",
    "url": "/elements/f1_ferrari_jacket.png"
  }
];
const playerUrl = "/elements/turntable.png"
const playerName = "audio technica AT-LP60X"

export default function GiftSelector({ selections, onUpdate, onComplete, onBack }: Props) {
  const [stage, setStage] = useState(1);
  const next = () => setStage((s) => Math.min(6, s + 1));

  const canProceed = () => {
    if (stage === 1) return true; // vinylPlayer pre-selected
    if (stage === 2) return (selections.record != null) || (selections.recordCustom && selections.recordCustom.trim().length > 0) || false;
    if (stage === 3) return (selections.perfume != null) || (selections.perfumeCustom && selections.perfumeCustom.trim().length > 0) || false;
    if (stage === 4) return (selections.pants != null) || (selections.pantsCustom && selections.pantsCustom.trim().length > 0) || false;
    if (stage === 5) return (selections.f1 != null) || (selections.f1Custom && selections.f1Custom.trim().length > 0) || false;
    return true;
  };

  const renderStage = () => {
    if (stage === 1)
      return (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-neutral-400">✨ firstly: i know you've been wanting this! this is included - you get to redeem a vinyl player! but because it's only practical in singapore, i'll give you a voucher now that promises i'll get it to you when you're back! (click to select)</h3>
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
                    className={`relative w-48 text-center rounded-lg p-6 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl border bg-white text-slate-800 border-slate-300 shadow-md`}
                  >
                    <div className="w-full aspect-square grid place-items-center mb-3">
                      <img src={playerUrl} alt="Vinyl Player" width={160} height={160} className="max-w-[85%] max-h-[85%] object-contain" />
                    </div>
                    <div className="font-medium text-slate-800">
                      {playerName} 
                    </div>
                    {selected && (
                      <div className="absolute top-2 right-2 bg-white text-stone-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                </div>
                <div className="mt-4 max-w-md mx-auto">
                  <label className="block text-sm text-neutral-300 mb-1">or suggest a different player:</label>
                  <input
                    type="text"
                    value={selections.vinylPlayerCustom ?? ""}
                    onChange={(e) => onUpdate({ vinylPlayerCustom: e.target.value })}
                    placeholder="e.g. another model you like"
                    className="w-full rounded-md bg-white/10 text-white placeholder-white/50 px-3 py-2 outline-none border border-white/10 focus:border-indigo-300/60 transition-colors"
                  />
                </div>
                {selected && (
                  <div className="mt-6 flex justify-center animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdate({ vinylPlayer: playerName });
                        const link = document.createElement("a");
                        link.href = "/vouchers/voucher_vinyl.png";
                        link.download = "voucher_vinyl.png";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="px-6 py-3 rounded-lg text-white font-medium shadow-lg transition-all transform hover:scale-105 bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-200/40"
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
          <h3 className="text-lg font-semibold text-neutral-400">💿 secondly: with a player, you need more records! choose 1!</h3>
          <SelectionGrid
            items={records.map((r) => ({ key: r.name, title: r.name, subtitle: `by ${r.artist}` , imgSrc: r.url }))}
            selectedKey={selections.record}
            onSelect={(k) => onUpdate({ record: k })}
          />
          <div className="max-w-md mx-auto">
            <label className="block text-sm text-neutral-300 mb-1">or suggest your own record:</label>
            <input
              type="text"
              value={selections.recordCustom ?? ""}
              onChange={(e) => onUpdate({ recordCustom: e.target.value })}
              placeholder="album + artist"
              className="w-full rounded-md bg-white/10 text-white placeholder-white/50 px-3 py-2 outline-none border border-white/10 focus:border-indigo-300/60 transition-colors"
            />
          </div>
        </div>
      );
    if (stage === 3)
      return (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-neutral-400">🌸 now, to up your scent game! pick one!</h3>
          <SelectionGrid
            items={perfumes.map((p) => ({ key: p.name, title: p.name, subtitle: `by ${p.perfumer}`, imgSrc: p.url }))}
            selectedKey={selections.perfume}
            onSelect={(k) => onUpdate({ perfume: k })}
          />
          <div className="max-w-md mx-auto">
            <label className="block text-sm text-neutral-300 mb-1">or suggest your own perfume:</label>
            <input
              type="text"
              value={selections.perfumeCustom ?? ""}
              onChange={(e) => onUpdate({ perfumeCustom: e.target.value })}
              placeholder="scent name + brand"
              className="w-full rounded-md bg-white/10 text-white placeholder-white/50 px-3 py-2 outline-none border border-white/10 focus:border-indigo-300/60 transition-colors"
            />
          </div>
        </div>
      );
    if (stage === 4)
      return (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-neutral-400">👖 some wardrobe upgrades: pick what looks good!</h3>
          <SelectionGrid
            items={pants.map((p) => ({ key: p.name, title: p.name, imgSrc: p.url }))}
            selectedKey={selections.pants}
            onSelect={(k) => onUpdate({ pants: k })}
          />
          <div className="max-w-md mx-auto">
            <label className="block text-sm text-neutral-300 mb-1">or suggest your own pants:</label>
            <input
              type="text"
              value={selections.pantsCustom ?? ""}
              onChange={(e) => onUpdate({ pantsCustom: e.target.value })}
              placeholder="brand + model"
              className="w-full rounded-md bg-white/10 text-white placeholder-white/50 px-3 py-2 outline-none border border-white/10 focus:border-indigo-300/60 transition-colors"
            />
          </div>
        </div>
      );
    if (stage === 5)
      return (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold text-neutral-400">vroom vroom! some f1 merch for you!!</h3>
          <SelectionGrid
            items={f1.map((p) => ({ key: p.name, title: p.name, imgSrc: p.url }))}
            selectedKey={selections.f1}
            onSelect={(k) => onUpdate({ f1: k })}
          />
          <div className="max-w-md mx-auto">
            <label className="block text-sm text-neutral-300 mb-1">or suggest your own F1 merch:</label>
            <input
              type="text"
              value={selections.f1Custom ?? ""}
              onChange={(e) => onUpdate({ f1Custom: e.target.value })}
              placeholder="team + item"
              className="w-full rounded-md bg-white/10 text-white placeholder-white/50 px-3 py-2 outline-none border border-white/10 focus:border-indigo-300/60 transition-colors"
            />
          </div>
        </div>
      );
    return (
      <div className="space-y-4 animate-fadeIn">
  <h3 className="text-lg font-semibold text-neutral-400">💰 all these gifts won&#39;t reach you now... so i'm giving you the chance to go on your own shopping spree!!!</h3>
        <div className="space-y-3">
          {/* Shopping voucher */}
          <div className="rounded-lg bg-white p-4 shadow-md border border-slate-300">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <span className="font-medium text-slate-800">$150 shopping voucher for you ❤️</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/vouchers/voucher_150.png";
                  link.download = "voucher_150.png";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-3 py-2 rounded-md text-white bg-stone-700 hover:opacity-95 text-sm font-medium shadow inline-flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-4 4V4m8 16H4" /></svg>
                download
              </button>
            </div>
          </div>
          {/* Dinner voucher */}
          <div className="rounded-lg bg-white p-4 shadow-md border border-slate-300">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                <span className="font-medium text-slate-800">redeem for a nice dinner in prague!</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/vouchers/voucher_dinner.png";
                  link.download = "voucher_dinner.png";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-3 py-2 rounded-md text-white bg-stone-700 hover:opacity-95 text-sm font-medium shadow inline-flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-4 4V4m8 16H4" /></svg>
                download
              </button>
            </div>
          </div>
          {/* Massage voucher */}
          <div className="rounded-lg bg-white p-4 shadow-md border border-slate-300">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💆</span>
                <span className="font-medium text-slate-800">free massage voucher</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/vouchers/voucher_massage.png";
                  link.download = "voucher_massage.png";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-3 py-2 rounded-md text-white bg-stone-700 hover:opacity-95 text-sm font-medium shadow inline-flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-4 4V4m8 16H4" /></svg>
                download
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-950 rounded-xl p-6 md:p-10 shadow-2xl border border-slate-800/30 font-sans">
      {onBack && (
        <button
          onClick={onBack}
          className="text-indigo-300 hover:text-stone-200 transition-colors text-sm mb-6 flex items-center gap-1"
          aria-label="Go back"
        >
          ← back
        </button>
      )}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow mb-2 font-sans">
          build your own gift package! 🎁
        </h2>
  <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-slate-900 shadow-sm">
          {stage} / 6
        </div>
      </div>

  <div className="mb-8">{renderStage()}</div>

      <div className="flex justify-between items-center gap-3">
        {stage > 1 && (
          <button
            onClick={() => setStage((s) => Math.max(1, s - 1))}
            className="px-4 py-2 rounded-lg text-slate-900 bg-stone-200 hover:bg-indigo-300 transition-all shadow-sm font-sans"
          >
            ← previous
          </button>
        )}
        <div className="flex-1" />
        {stage < 6 ? (
          <button
            onClick={() => canProceed() && next()}
            disabled={!canProceed()}
            className="px-6 py-3 rounded-lg text-slate-900 font-medium disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:shadow-lg transition-all transform enabled:hover:scale-105 bg-gradient-to-br from-stone-200 to-indigo-300 font-sans"
          >
            next →
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-6 py-3 rounded-lg text-slate-900 font-medium hover:shadow-lg transition-all transform hover:scale-105 bg-gradient-to-br from-stone-200 to-indigo-300 font-sans"
          >
            generate bundle →
          </button>
        )}
      </div>
    </section>
  );
}
