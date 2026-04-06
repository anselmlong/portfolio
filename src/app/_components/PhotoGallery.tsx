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

export default function PhotoGallery({
  photos,
  categories = [],
}: PhotoGalleryProps) {
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
      setLightboxIndex((prev) =>
        prev === 0 ? filteredPhotos.length - 1 : prev - 1,
      );
    } else {
      setLightboxIndex((prev) =>
        prev === filteredPhotos.length - 1 ? 0 : prev + 1,
      );
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
        },
      );
    },
    { dependencies: [filteredPhotos], scope: galleryRef },
  );

  return (
    <>
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full border px-4 py-2 text-sm font-light tracking-wide uppercase transition-all duration-300 ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground border-border hover:border-primary hover:text-foreground bg-transparent"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-light tracking-wide uppercase transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground border-border hover:border-primary hover:text-foreground bg-transparent"
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
        className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3"
      >
        {filteredPhotos.map((photo, index) => (
          <div
            key={`${photo.src}-${index}`}
            className="gallery-item group cursor-pointer break-inside-avoid"
            onClick={() => openLightbox(index)}
          >
            <div className="bg-card relative overflow-hidden rounded-lg">
              <img
                src={photo.src}
                alt={photo.alt}
                className="ken-burns h-auto w-full object-cover group-hover:opacity-90"
                loading="lazy"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute right-0 bottom-0 left-0 p-4">
                  {photo.caption && (
                    <p className="translate-y-2 text-sm font-light text-white/90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {photo.caption}
                    </p>
                  )}
                  {photo.category && (
                    <span className="mt-2 inline-block translate-y-2 text-xs tracking-wider text-white/60 uppercase opacity-0 transition-all delay-75 duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {photo.category}
                    </span>
                  )}
                </div>
              </div>
              {/* Expand icon */}
              <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <svg
                  className="h-6 w-6 text-white/80 transition-transform duration-300 group-hover:rotate-90"
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
        <div className="py-20 text-center">
          <p className="text-muted-foreground font-light">
            No photos in this category yet.
          </p>
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
