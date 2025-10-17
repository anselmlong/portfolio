"use client";
import { useState } from "react";
import LandingPage from "./_components/LandingPage";
import LoveLetter from "./_components/LoveLetter";
import { PhotoScroll } from "./_components/PhotoScroll";
import GiftSelector, { type GiftSelections } from "./_components/GiftSelector";
import VoucherGenerator from "./_components/VoucherGenerator";
import { photos } from "./data/photos";

type Section = "landing" | "letter" | "photos" | "gifts" | "voucher";

export default function XuanPage() {
  const [section, setSection] = useState<Section>("landing");
  const [selections, setSelections] = useState<GiftSelections>({
    vinylPlayer: "Vinyl Player",
    record: null,
    perfume: null,
    pants: null,
    voucher: "$150 Shopping Voucher",
    personalMessage: "",
  });

  // Updates a React state object with new selections without building the whole thing
  const updateSelections = (partial: Partial<GiftSelections>) =>
    setSelections((prev: GiftSelections) => ({ ...prev, ...partial }));

  return (
    <main className="min-h-screen bg-[#d9c5b2] text-[#5d4037]">
      <div className="mx-auto max-w-4xl p-6 md:p-10">
        {section === "landing" && (
          <LandingPage onNext={() => setSection("letter")} />)
        }
        {section === "letter" && (
          <LoveLetter onNext={() => setSection("photos")} />
        )}
        {section === "photos" && (
          <PhotoScroll photos={photos} onComplete={() => setSection("gifts")} />
        )}
        {section === "gifts" && (
          <GiftSelector
            selections={selections}
            onUpdate={updateSelections}
            onComplete={() => setSection("voucher")}
          />
        )}
        {section === "voucher" && (
          <VoucherGenerator selections={selections} />
        )}
      </div>
    </main>
  );
}
