"use client";
import React from "react";

type Props = {
  onNext: () => void;
  onBack?: () => void;
};

const message = (
  <div className="space-y-5 max-w-prose font-serif">
    <p className="text-white/90">
      my beloved, nonchalant, princess <span className="font-semibold">huang shao xuan</span>...!! wow... you are 22! 
      <br></br>i don't know about you, but you're feeling 22!!
    </p>
    <p className="text-white/80">
      i'm so glad that you're my girlfriend (wow i really lucked out heh) and i hope that one day you'll be my wifey!!
      i'm really grateful for you every day! i have many many things i could say to you
      but i'll keep it short and sweet here hehe :D
    </p>

    <div className="h-px bg-white/10 my-2" />

    <p className="text-white/90">
      you light up my life a lot, and it's been a very colourful 6 months with you.
    </p>
    <p className="text-white/80">
      from motivating me to get better to just being there for me, you've been an amazing support system.
      i'm so grateful for you and everything we've been through together! i'm looking forward 
      to see how our relationship will grow in the future!! RAHHH
    </p>

    <div className="pt-2">
      <p className="text-white/90">love you always,</p>
      <p className="italic text-white/90 text-right">your boyfriend!! (anselm pius long)</p>
    </div>
  </div>
)

export default function LoveLetter({ onNext, onBack }: Props) {
  const [revealLetter, setRevealLetter] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  // Configure playback
  const START_AT = 42; // seconds
  const AUDIO_VOLUME = 0.25; // 0.0 - 1.0
  const FADE_IN_MS = 900; // duration of fade-in
  const fadeRaf = React.useRef<number | null>(null);
  const metaListenerRef = React.useRef<((this: HTMLAudioElement, ev: Event) => void) | null>(null);

  const cancelFade = () => {
    if (fadeRaf.current != null) {
      cancelAnimationFrame(fadeRaf.current);
      fadeRaf.current = null;
    }
  };

  const fadeIn = (el: HTMLAudioElement, target: number, durationMs: number) => {
    cancelFade();
    const start = performance.now();
    const clampedTarget = Math.min(1, Math.max(0, target));
    el.volume = 0;
    const step = (now: number) => {
      const progress = Math.min(1, Math.abs(now - start) / durationMs);
      el.volume = clampedTarget * progress;
      if (progress < 1) {
        fadeRaf.current = requestAnimationFrame(step);
      } else {
        fadeRaf.current = null;
      }
    };
    fadeRaf.current = requestAnimationFrame(step);
  };

  React.useEffect(() => {
    return () => {
      cancelFade();
      // Cleanup metadata listener if any
      const el = audioRef.current;
      const listener = metaListenerRef.current;
      if (el && listener) {
        el.removeEventListener("loadedmetadata", listener);
        metaListenerRef.current = null;
      }
    };
  }, []);
  return (
  <section className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-gray-950 text-stone-200 rounded-xl p-6 md:p-10 shadow-2xl border border-slate-800/30 animate-fadeIn font-sans">
      {/* Hidden audio element to play on reveal */}
      <audio ref={audioRef} src="/audio/22.mp3" preload="auto" className="hidden" />
      {onBack && (
        <button
          onClick={onBack}
          className="text-indigo-300/70 hover:text-stone-200 transition-colors text-sm mb-4 font-medium font-sans"
          aria-label="Go back"
        >
          &larr; back
        </button>
      )}
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg animate-fadeIn font-sans">
          a little note for you ❤️
        </h2>
      </div>
      <button
        onClick={() => {
          setRevealLetter((v) => {
            const next = !v;
            try {
              if (audioRef.current) {
                if (!v && next) {
                  // Opening: ensure metadata before seeking & playing
                  const el = audioRef.current;
                  const startPlayback = () => {
                    try {
                      const duration = Number.isFinite(el.duration) ? el.duration : undefined;
                      const target = duration ? Math.min(Math.max(0, START_AT), Math.max(0, duration - 0.05)) : START_AT;
                      el.currentTime = target;
                    } catch { /* ignore */ }
                    el.volume = 0;
                    void el.play().catch(() => undefined);
                    fadeIn(el, AUDIO_VOLUME, FADE_IN_MS);
                  };

                  if (audioRef.current.readyState >= 1 /* HAVE_METADATA */) {
                    startPlayback();
                  } else {
                    const onMeta = function (this: HTMLAudioElement, _ev: Event) {
                      // remove immediately, then start
                      const elNow = audioRef.current;
                      if (elNow) {
                        elNow.removeEventListener("loadedmetadata", onMeta);
                        metaListenerRef.current = null;
                        startPlayback();
                      }
                    };
                    metaListenerRef.current = onMeta;
                    audioRef.current.addEventListener("loadedmetadata", onMeta, { once: true });
                    // Kick off loading to ensure metadata arrives
                    try { audioRef.current.load(); } catch { /* ignore */ }
                  }
                } else if (v && !next) {
                  // Hiding: stop playback
                  cancelFade();
                  if (audioRef.current) {
                    try { audioRef.current.pause(); } catch { /* ignore */ }
                    try { audioRef.current.currentTime = START_AT; } catch { /* ignore */ }
                    audioRef.current.volume = 0;
                  }
                }
              }
            } catch { /* ignore */ }
            return next;
          });
        }}
        aria-pressed={revealLetter}
  className="mb-6 px-4 py-2 bg-stone-200/20 hover:bg-stone-200/30 rounded-lg text-stone-200 hover:text-white transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-stone-200/40 font-sans"
      >
        {revealLetter ? "hide letter" : "reveal letter"}
      </button>
      {revealLetter && (
        <div className="space-y-4 text-lg md:text-xl leading-relaxed mb-8 text-white animate-fadeIn font-sans">
          <div className="rounded-xl bg-white/5 border border-white/10 p-6 md:p-8 shadow-xl backdrop-blur-sm">
            {message}
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-slate-900 bg-gradient-to-br from-white to-indigo-300 shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-stone-200/40 font-sans"
        >
          continue &rarr;
        </button>
      </div>
    </section>
  );
}
