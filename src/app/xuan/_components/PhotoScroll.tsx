import React, { useRef, useEffect, useState } from "react";
import type { Photo } from "../data/photos";

interface PhotoScrollProps {
  photos: Photo[];
  onComplete?: () => void;
}

export const PhotoScroll: React.FC<PhotoScrollProps> = ({ photos, onComplete }) => {
  const [viewed, setViewed] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver logic will be added in next step

  useEffect(() => {
    if (viewed.size === photos.length && onComplete) {
      onComplete();
    }
  }, [viewed, photos.length, onComplete]);

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto py-8">
      <div className="flex flex-col gap-8">
        {photos.map((photo) => (
          <figure
            key={photo.id}
            className="flex flex-row items-center gap-6 bg-white/80 rounded-xl shadow p-4 scrapbook-border"
            tabIndex={0}
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-48 h-48 object-cover rounded-lg border"
              loading="lazy"
            />
            <figcaption className="text-lg font-medium text-gray-800">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      {/* Progress UI and CTA will be added in next steps */}
    </div>
  );
};
