"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import type { Photo } from "./PhotoGallery";

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}

export default function Lightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxProps) {
  const currentPhoto = photos[currentIndex];

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onNavigate("prev");
          break;
        case "ArrowRight":
          onNavigate("next");
          break;
      }
    },
    [isOpen, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !currentPhoto) return null;

  const lightboxContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors duration-200 z-10"
        aria-label="Close lightbox"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous button */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("prev");
          }}
          className="absolute left-4 md:left-8 p-3 text-white/70 hover:text-white transition-colors duration-200 z-10"
          aria-label="Previous photo"
        >
          <svg
            className="w-8 h-8 md:w-10 md:h-10"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("next");
          }}
          className="absolute right-4 md:right-8 p-3 text-white/70 hover:text-white transition-colors duration-200 z-10"
          aria-label="Next photo"
        >
          <svg
            className="w-8 h-8 md:w-10 md:h-10"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentPhoto.src}
          alt={currentPhoto.alt}
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
        />

        {/* Caption and info */}
        <div className="mt-4 text-center">
          {currentPhoto.caption && (
            <p className="text-white/90 text-lg font-light mb-1">{currentPhoto.caption}</p>
          )}
          {currentPhoto.category && (
            <span className="text-white/50 text-sm uppercase tracking-wider">
              {currentPhoto.category}
            </span>
          )}
          {photos.length > 1 && (
            <p className="text-white/40 text-sm mt-2 font-light">
              {currentIndex + 1} / {photos.length}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2">
          {photos.map((photo, index) => (
            <button
              key={`thumb-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(index > currentIndex ? "next" : "prev");
                // Direct navigation to index would be better, but using existing interface
              }}
              className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded overflow-hidden transition-all duration-200 ${
                index === currentIndex
                  ? "ring-2 ring-primary opacity-100"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Use portal to render at document root
  if (typeof document !== "undefined") {
    return createPortal(lightboxContent, document.body);
  }

  return null;
}
