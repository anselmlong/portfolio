import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import type { Photo } from "../data/photos";

interface PhotoScrollProps {
  photos: Photo[];
  onComplete?: () => void;
  onBack?: () => void;
}

export const PhotoScroll: React.FC<PhotoScrollProps> = ({ photos, onComplete, onBack }) => {
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
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    );
    photoElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [photos]);

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto py-2 font-sans">
      {onBack && (
        <button
          onClick={onBack}
          className="text-[#b8c1ec] hover:text-[#eebbc3] transition-colors text-sm mb-4"
          aria-label="Go back"
        >
          ← back
        </button>
      )}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#fff] mb-1 mt-1 drop-shadow animate-fadeIn">a walk 🚶 down memory lane</h2>
      </div>
      <div className="flex flex-col gap-16">
        {photos.map((photo, idx) => {
          const isLeft = idx % 2 === 0;
          const ratio = ratios[photo.id] ?? 0;
          const opacity = ratio > 0 ? 1 : 0.3;
          const translateY = 32 * (1 - Math.min(ratio, 1));
          return (
            <figure
              key={photo.id}
              className={`flex flex-col md:items-center gap-8 scrapbook-border transition-all duration-700 ease-out will-change-transform bg-gradient-to-br from-[#232946] via-[#1a1a2e] to-[#121629] rounded-xl shadow-lg border border-[#232946]/30 p-4 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
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
                className={`w-60 h-96 object-cover rounded-lg border-2 border-[#b8c1ec] ${isLeft ? "md:mr-6" : "md:ml-6"}`}
                loading="lazy"
                placeholder="empty"
                unoptimized={false}
              />
              <figcaption
                className={`text-lg font-medium text-[#fff] max-w-xs font-sans ${isLeft ? "text-left" : "text-right"}`}
              >
                <div className="text-sm text-[#f6f6f6] mb-1">{photo.date}</div>
                <span className="text-[#f6f6f6]">{photo.caption}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <div className="flex justify-center mt-8">
        <button
          className="px-6 py-3 rounded-lg font-bold text-[#232946] bg-gradient-to-br from-[#eebbc3] to-[#b8c1ec] shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#eebbc3]/40 font-sans"
          onClick={onComplete}
        >
          next
        </button>
      </div>
    </div>
  );
};