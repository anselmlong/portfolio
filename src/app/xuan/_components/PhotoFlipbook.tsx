"use client";
import React, { useMemo, useState } from "react";

export type Photo = {
  id: number;
  url: string;
  caption: string;
};

type Props = {
  photos: Photo[];
  onComplete: () => void;
};

export default function PhotoFlipbook({ photos, onComplete }: Props) {
  // Sets index of current photo
  const [index, setIndex] = useState(0);
  // Tracks which photos have been viewed
  const [viewed, setViewed] = useState<Set<number>>(() => {
    const first = photos[0]?.id;
    return first != null ? new Set<number>([first]) : new Set<number>();
  });

  // Calculates the percentage of photos viewed
  const percent = useMemo(
    () => Math.round((viewed.size / Math.max(photos.length, 1)) * 100),
    [viewed.size, photos.length]
  );

  const go = (delta: number) => {
    setIndex((i) => {
      const next = Math.min(photos.length - 1, Math.max(0, i + delta));
      const id = photos[next]?.id;
      if (id != null) setViewed((prev) => new Set(prev).add(id));
      return next;
    });
  };

  const allViewed = viewed.size >= photos.length && photos.length > 0;

  return (
    <section className="bg-[#f5ebe0] rounded-xl p-6 md:p-8 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: "#5d4037" }}>
          our pics! 📸
        </h2>
        <div className="text-sm" style={{ color: "#5d4037" }}>
          {viewed.size}/{photos.length} viewed • {percent}%
        </div>
      </div>

      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#e6ddd0] flex items-center justify-center">
            {/* Placeholder image box */}
            <img
              src={photos[index]?.url}
              alt={photos[index]?.caption || `Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => go(-1)}
              disabled={index === 0}  
              className="px-4 py-2 rounded-md text-white disabled:opacity-50 hover:cursor-auto"
              style={{ backgroundColor: "#8a9a7b" }}
            >
              ← back
            </button>
            <button
              onClick={() => go(1)}
              disabled={index >= photos.length - 1}
              className="px-4 py-2 rounded-md text-white disabled:opacity-50 hover:cursor-auto"
              style={{ backgroundColor: "#8a9a7b" }}
            >
              next →
            </button>
          </div>

          {allViewed && (
            <div className="mt-2">
              <button
                onClick={onComplete}
                className="px-5 py-3 rounded-md text-white hover:cursor-auto"
                style={{ backgroundColor: "#c17767" }}
              >
                continue hehe →
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
