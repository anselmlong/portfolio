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
    [isOpen, onClose, onNavigate],
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
      className="animate-fadeIn fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 text-white/70 transition-colors duration-200 hover:text-white"
        aria-label="Close lightbox"
      >
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Previous button */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("prev");
          }}
          className="absolute left-4 z-10 p-3 text-white/70 transition-colors duration-200 hover:text-white md:left-8"
          aria-label="Previous photo"
        >
          <svg
            className="h-8 w-8 md:h-10 md:w-10"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
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
          className="absolute right-4 z-10 p-3 text-white/70 transition-colors duration-200 hover:text-white md:right-8"
          aria-label="Next photo"
        >
          <svg
            className="h-8 w-8 md:h-10 md:w-10"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div
        className="relative flex max-h-[85vh] max-w-[90vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={currentPhoto.src}
          src={currentPhoto.src}
          alt={currentPhoto.alt}
          className="animate-fadeIn max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl"
        />

        {/* Caption and info */}
        <div className="mt-4 text-center">
          {currentPhoto.caption && (
            <p className="mb-1 text-lg font-light text-white/90">
              {currentPhoto.caption}
            </p>
          )}
          {currentPhoto.category && (
            <span className="text-sm tracking-wider text-white/50 uppercase">
              {currentPhoto.category}
            </span>
          )}
          {photos.length > 1 && (
            <p className="mt-2 text-sm font-light text-white/40">
              {currentIndex + 1} / {photos.length}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto px-4 py-2">
          {photos.map((photo, index) => (
            <button
              key={`thumb-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(index > currentIndex ? "next" : "prev");
                // Direct navigation to index would be better, but using existing interface
              }}
              className={`h-12 w-12 flex-shrink-0 overflow-hidden rounded transition-all duration-200 md:h-16 md:w-16 ${
                index === currentIndex
                  ? "ring-primary opacity-100 ring-2"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover"
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
