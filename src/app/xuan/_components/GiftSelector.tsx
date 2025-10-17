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
};

const recordOptions = ["submarine - the marias", "beerbongs and bentleys (clear) - post malone", "born to die - lana del rey"] as const;
const perfumeOptions = [
  "Regine de Fleur - Glassbloom",
  "OSMANTHUS - tosummer",
  "white rice - d'Annam",
] as const;
const pantsOptions = ["BDG barrel jeans in white", "Yuan Wide-Leg Pants", "woman's puma navy williams polo"] as const;

export default function GiftSelector({ selections, onUpdate, onComplete }: Props) {
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
        <div className="space-y-3">
          <h3 className="font-semibold">firstly: you get to redeem a vinyl player!</h3>
          <div className="rounded-md bg-[#e6ddd0] p-4">🎵 audio technica - aesthetic era!!</div>
        </div>
      );
    if (stage === 2)
      return (
        <div className="space-y-3">
          <h3 className="font-semibold">secondly: with a player, you need more records! choose 1!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recordOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => onUpdate({ record: opt })}
                className={`rounded-md p-3 text-left hover:cursor-auto ${
                  selections.record === opt ? "bg-[#c17767] text-white" : "bg-[#f5ebe0]"
                }`}
              >
                💿 {opt}
              </button>
            ))}
          </div>
        </div>
      );
    if (stage === 3)
      return (
        <div className="space-y-3">
          <h3 className="font-semibold">now, to up your scent game! pick one!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {perfumeOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => onUpdate({ perfume: opt })}
                className={`rounded-md p-3 text-left hover:cursor-auto ${
                  selections.perfume === opt ? "bg-[#c17767] text-white" : "bg-[#f5ebe0]"
                }`}
              >
                🌸 {opt}
              </button>
            ))}
          </div>
        </div>
      );
    if (stage === 4)
      return (
        <div className="space-y-3">
          <h3 className="font-semibold">some wardrobe upgrades: pick what looks good!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {pantsOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => onUpdate({ pants: opt })}
                className={`rounded-md p-3 text-left hover:cursor-auto ${
                  selections.pants === opt ? "bg-[#c17767] text-white" : "bg-[#f5ebe0]"
                }`}
              >
                👖 {opt}
              </button>
            ))}
          </div>
        </div>
      );
    return (
      <div className="space-y-3">
        <h3 className="font-semibold">all these gifts won't reach you now... but CASH IS KING!!!</h3>
        <div className="rounded-md bg-[#f5ebe0] p-3">🎁 $150 shopping voucher for you ❤️</div>
        <div className="rounded-md bg-[#f5ebe0] p-3">🎁 redeem for a nice dinner in prague!</div>
        <textarea
          value={selections.personalMessage}
          onChange={(e) => onUpdate({ personalMessage: e.target.value })}
          placeholder="rahhh"
          className="w-full rounded-md border border-[#d4a574] bg-white p-3 text-[#5d4037]"
          rows={4}
        />
      </div>
    );
  };

  return (
    <section className="bg-[#f5ebe0] rounded-xl p-6 md:p-8 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: "#5d4037" }}>
          build your own gift package!
        </h2>
        <div className="text-sm">stage {stage} / 5</div>
      </div>

      <div className="mb-6">{renderStage()}</div>

      <div className="flex justify-end gap-3">
        {stage < 5 ? (
          <button
            onClick={() => canProceed() && next()}
            disabled={!canProceed()}
            className="px-5 py-3 rounded-md text-white disabled:opacity-50 hover:cursor-auto"
            style={{ backgroundColor: "#c17767" }}
          >
            next →
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-5 py-3 rounded-md text-white hover:cursor-auto"
            style={{ backgroundColor: "#c17767" }}
          >
            generate voucher →
          </button>
        )}
      </div>
    </section>
  );
}
