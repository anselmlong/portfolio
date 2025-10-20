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
  const expectedPassword = process.env.NEXT_PUBLIC_XUAN_PASSWORD ?? "xuan";
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [selections, setSelections] = useState<GiftSelections>({
    vinylPlayer: null,
    record: null,
    perfume: null,
    pants: null,
    f1: null,
    voucher: "$150 Shopping Voucher",
  });

  // Updates a React state object with new selections without building the whole thing
  const updateSelections = (partial: Partial<GiftSelections>) =>
    setSelections((prev: GiftSelections) => ({ ...prev, ...partial }));

  const handleSubmit = () => {
    if (password.trim() === expectedPassword) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  if (!authorized) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-gray-950 text-white">
        <div className="mx-auto max-w-md p-6 md:p-10 flex min-h-screen items-center justify-center">
          <div className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-2xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">Enter password</h1>
            <p className="text-sm text-white/70 mb-4">This page is private. Please enter the password to continue.</p>
            <div className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="Password"
                className="w-full rounded-lg bg-white/10 text-white placeholder-white/50 px-4 py-3 outline-none border border-white/10 focus:border-blue-400/60 transition-colors"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full px-4 py-3 rounded-lg font-medium text-[#232946] bg-gradient-to-br from-white to-blue-200/80 hover:to-blue-200 shadow-lg transition-colors">
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-gray-950 text-[#5d4037]">
      <div className="mx-auto max-w-4xl p-6 md:p-10">
        {section === "landing" && (
          <LandingPage onNext={() => setSection("letter")} />)
        }
        {section === "letter" && (
          <LoveLetter 
            onNext={() => setSection("photos")} 
            onBack={() => setSection("landing")}
          />
        )}
        {section === "photos" && (
          <PhotoScroll 
            photos={photos} 
            onComplete={() => setSection("gifts")} 
            onBack={() => setSection("letter")}
          />
        )}
        {section === "gifts" && (
          <GiftSelector
            selections={selections}
            onUpdate={updateSelections}
            onComplete={() => setSection("voucher")}
            onBack={() => setSection("photos")}
          />
        )}
        {section === "voucher" && (
          <VoucherGenerator 
            selections={selections} 
            onBack={() => setSection("gifts")}
          />
        )}
      </div>
    </main>
  );
}
