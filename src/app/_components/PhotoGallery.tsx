"use client";

import { useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lightbox from "./Lightbox";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface Photo {
  src: string;
  alt: string;
  category?: string;
  caption?: string;
  aspectRatio?: "portrait" | "landscape" | "square";
}

interface PhotoGalleryProps {
  photos: Photo[];
  categories?: string[];
}

export default function PhotoGallery({ photos, categories = [] }: PhotoGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const filteredPhotos = selectedCategory
    ? photos.filter((p) => p.category === selectedCategory)
    : photos;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setLightboxIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev - 1));
    } else {
      setLightboxIndex((prev) => (prev === filteredPhotos.length - 1 ? 0 : prev + 1));
    }
  };

  // GSAP animations for gallery items
  useGSAP(
    () => {
      const items = galleryRef.current?.querySelectorAll(".gallery-item");
      if (!items) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { dependencies: [filteredPhotos], scope: galleryRef }
  );

  return (
    <>
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 text-sm font-light tracking-wide uppercase transition-all duration-300 border rounded-full ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-light tracking-wide uppercase transition-all duration-300 border rounded-full ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Masonry Grid */}
      <div
        ref={galleryRef}
        className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
      >
        {filteredPhotos.map((photo, index) => (
          <div
            key={`${photo.src}-${index}`}
            className="gallery-item break-inside-avoid group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-lg bg-card">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                loading="lazy"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {photo.caption && (
                    <p className="text-sm text-white/90 font-light">{photo.caption}</p>
                  )}
                  {photo.category && (
                    <span className="inline-block mt-2 text-xs text-white/60 uppercase tracking-wider">
                      {photo.category}
                    </span>
                  )}
                </div>
              </div>
              {/* Expand icon */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-6 h-6 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredPhotos.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-light">No photos in this category yet.</p>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        photos={filteredPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </>
  );
}
