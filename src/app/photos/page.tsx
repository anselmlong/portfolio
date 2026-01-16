"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PhotoGallery, { type Photo } from "~/app/_components/PhotoGallery";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Define your photos here - add your images to public/photos/
const photos: Photo[] = [
  {
    src: "/photos/gallery/cbtr.png",
    alt: "CBTR",
    category: "events",
    caption: "Capturing the moment",
  },
  {
    src: "/photos/gallery/wedding.png",
    alt: "Wedding",
    category: "portraits",
    caption: "A beautiful celebration",
  },
  // Add more photos as needed
  // {
  //   src: "/photos/gallery/your-image.jpg",
  //   alt: "Description",
  //   category: "landscape",
  //   caption: "Your caption here",
  // },
];

// Extract unique categories from photos
const categories = [...new Set(photos.map((p) => p.category).filter(Boolean))] as string[];

export default function PhotosPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Header animations
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".header-text",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
          }
        );
      }, headerRef);

      return () => ctx.revert();
    },
    { scope: headerRef }
  );

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Hero Section */}
      <section ref={headerRef} className="relative py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          {/* Back link */}
          <Link
            href="/"
            className="header-text inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="text-sm font-light tracking-wide uppercase">Back</span>
          </Link>

          <h1 className="header-text text-5xl md:text-7xl lg:text-8xl font-light mb-6 text-foreground-high tracking-tight">
            photography
          </h1>

          <p className="header-text text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light mb-4">
            a collection of moments captured through my lens. i enjoy telling stories through images,
            from events to portraits to landscapes.
          </p>

          <div className="header-text flex items-center justify-center gap-4 text-sm text-muted-foreground/60">
            <span>{photos.length} photos</span>
            {categories.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span>{categories.length} categories</span>
              </>
            )}
          </div>
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-border to-transparent" />
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef} className="pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <PhotoGallery photos={photos} categories={categories} />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground font-light mb-6">
            interested in working together?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-light tracking-wide uppercase hover:opacity-90 transition-opacity duration-200"
          >
            get in touch
          </Link>
        </div>
      </section>
    </main>
  );
}
