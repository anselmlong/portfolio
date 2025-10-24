"use client"

import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const galleryPhotos = [
  "/photos/gallery/cbtr.png",
  "/photos/gallery/wedding.png",
  "/photos/gallery/cbtr.png",
  "/photos/gallery/wedding.png",
  "/photos/gallery/cbtr.png",
  "/photos/gallery/wedding.png"
];

export default function PhotosPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Calculate the total width to scroll (container width minus viewport width)
    const totalWidth = container.scrollWidth - window.innerWidth;

    gsap.to(container, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top 20%",
        end: () => `+=${window.innerHeight * 2}`, // Scroll for 2 viewport heights
        scrub: 1,
        pin: true,
        markers: false, // Set to true for debugging
        onLeave: () => {
          // Ensure the container stays at the final position when leaving
          gsap.set(container, { x: -totalWidth });
        },
        onEnterBack: () => {
          // Reset position when scrolling back up
          gsap.set(container, { x: 0 });
        }
      }
    });
  });

  return (
    <main className="relative min-h-screen z-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/videos/legacy_cropped.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Content above video */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 id="gsap-text" className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-bg-sans)' }}>
            photos
          </h1>

          {/* Horizontal scrolling photos */}
          <div className="overflow-hidden">
            <div ref={scrollRef} className="flex gap-4 pb-4">
              {galleryPhotos.map((src, i) => (
                <img key={i} src={src} alt={`Gallery photo ${i + 1}`} className="w-auto h-auto object-cover rounded flex-shrink-0" />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center mt-8">
            {["explore", "my", "photography"].map((word, idx) => (
              <span
                key={word}
                className="text-2xl md:text-4xl font-semibold text-gray-200 opacity-0"
                id={`stagger-text-${idx}`}
                style={{ fontFamily: 'var(--font-bg-sans)' }}
              >
                {word}
              </span>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}
