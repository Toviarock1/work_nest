"use client";

import { useEffect, useRef } from "react";

interface Blob {
  /** vertical position in document units (vh) */
  topVh: number;
  leftPct: number;
  size: number;
  color: string;
  speed: number;
}

const BLOBS: Blob[] = [
  {
    topVh: 30,
    leftPct: 8,
    size: 320,
    color: "rgba(13,242,147,0.25)",
    speed: 0.25,
  },
  {
    topVh: 80,
    leftPct: 78,
    size: 380,
    color: "rgba(17,214,98,0.20)",
    speed: -0.18,
  },
  {
    topVh: 150,
    leftPct: 12,
    size: 280,
    color: "rgba(13,242,147,0.22)",
    speed: 0.3,
  },
  {
    topVh: 220,
    leftPct: 70,
    size: 420,
    color: "rgba(29,109,107,0.28)",
    speed: -0.22,
  },
  {
    topVh: 300,
    leftPct: 20,
    size: 340,
    color: "rgba(13,242,147,0.20)",
    speed: 0.28,
  },
  {
    topVh: 380,
    leftPct: 75,
    size: 360,
    color: "rgba(17,214,98,0.18)",
    speed: -0.2,
  },
];

export default function ParallaxBlobs() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const sy = window.scrollY;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const b = BLOBS[i];
        const ty = -sy * b.speed;
        el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;
      });
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {BLOBS.map((b, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute rounded-full blur-3xl will-change-transform"
          style={{
            top: `${b.topVh}vh`,
            left: `${b.leftPct}%`,
            width: b.size,
            height: b.size,
            background: b.color,
          }}
        />
      ))}
    </div>
  );
}
