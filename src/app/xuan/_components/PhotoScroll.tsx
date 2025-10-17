import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import type { Photo } from "../data/photos";

interface PhotoScrollProps {
  photos: Photo[];
  onComplete?: () => void;
}

export const PhotoScroll: React.FC<PhotoScrollProps> = ({ photos, onComplete }) => {
  // Store intersectionRatio for each photo by id
  const [ratios, setRatios] = useState<{ [id: number]: number }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const photoElements = containerRef.current?.querySelectorAll("figure");
    if (!photoElements) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        setRatios((prev) => {
          const next = { ...prev };
          entries.forEach((entry) => {
            const idx = Array.from(photoElements).indexOf(entry.target as HTMLElement);
            const photo = photos[idx];
            if (photo) {
              next[photo.id] = entry.intersectionRatio;
            }
          });
          return next;
        });
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) } // 0, 0.05, ..., 1
    );

    photoElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [photos]);

  // Consider a photo "viewed" if its intersectionRatio >= 0.5
  const total = photos.length;
  const viewedCount = photos.filter((p) => (ratios[p.id] ?? 0) >= 0.5).length;
  const percent = Math.round((viewedCount / total) * 100);
  const allViewed = viewedCount === total;

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto py-8">
      <div className="flex flex-col gap-8">
        {photos.map((photo, idx) => {
          const isLeft = idx % 2 === 0;
          const ratio = ratios[photo.id] ?? 0;
          // Opacity: 1 if any part is visible, else 0.3
          const opacity = ratio > 0 ? 1 : 0.3;
          // TranslateY from 32px (hidden) to 0 (visible)
          const translateY = 32 * (1 - Math.min(ratio, 1));
          return (
            <figure
              key={photo.id}
              className={[
                "flex flex-col md:items-center gap-6 bg-white/80 rounded-xl shadow p-4 scrapbook-border transition-all duration-700 ease-out will-change-transform",
                isLeft ? "md:flex-row" : "md:flex-row-reverse"
              ].join(" ")}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                transitionDelay: `${Math.min(idx * 50, 300)}ms`
              }}
            >
              <Image
                src={photo.url}
                alt={photo.caption}
                width={192}
                height={192}
                className={[
                  "w-48 h-48 object-cover rounded-lg border",
                  isLeft ? "md:mr-6" : "md:ml-6"
                ].join(" ")}
                loading="lazy"
                placeholder="empty"
                unoptimized={false}

              />
              <figcaption
                className={[
                  "text-lg font-medium text-gray-800",
                  isLeft ? "text-left" : "text-right"
                ].join(" ")}
              >
                {photo.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
      <div className="flex justify-center mt-8">
        <button
          className={`px-6 py-3 rounded-lg font-bold text-white bg-[#bfae9e] shadow transition-opacity ${allViewed ? "opacity-100" : "opacity-50 pointer-events-none"}`}
          disabled={!allViewed}
          onClick={onComplete}
        >
          next
        </button>
      </div>
    </div>
  );
};
