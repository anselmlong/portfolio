import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import type { Photo } from "../data/photos";

interface PhotoScrollProps {
  photos: Photo[];
  onComplete?: () => void;
  onBack?: () => void;
}

export const PhotoScroll: React.FC<PhotoScrollProps> = ({ photos, onComplete, onBack }) => {
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
    <div ref={containerRef} className="w-full max-w-3xl mx-auto py-2">
      {onBack && (
        <button
          onClick={onBack}
          className="text-neutral-500 hover:text-neutral-300 transition-colors text-sm mb-4"
          aria-label="Go back"
        >
          ← back
        </button>
      )}
      <div className="mb-8 text-center">
        <h2 className="text-2xl text-slate-400 mb-1 mt-1">a walk 🚶 down memory lane</h2>
      </div>
      <div className="flex flex-col gap-16">
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
                "flex flex-col md:items-center gap-8 scrapbook-border transition-all duration-700 ease-out will-change-transform",
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
                width={400}
                height={600}
                className={[
                  "w-60 h-96 object-cover rounded-sm border",
                  isLeft ? "md:mr-6" : "md:ml-6"
                ].join(" ")}
                loading="lazy"
                placeholder="empty"
                unoptimized={false}
              />
              <figcaption
                className={[
                  "text-lg font-medium text-neutral-400 max-w-xs",
                  isLeft ? "text-left" : "text-right"
                ].join(" ")}
              >
                <div className="text-sm text-neutral-500 mb-1">{photo.date}</div>
                {photo.caption}
              </figcaption>
              
            </figure>
          );
        })}
      </div>
      <div className="flex justify-center mt-8">
        <button
          className={`px-6 py-3 rounded-lg font-bold text-white bg-[#bfae9e] shadow transition-opacity "}`}
          onClick={onComplete}
        >
          next
        </button>
      </div>
    </div>
  );
};
