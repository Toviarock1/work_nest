"use client";

import React, { useEffect, useRef } from "react";

interface ParallaxLayerProps {
  children: React.ReactNode;
  /** Y-axis parallax speed. Positive = element trails (depth), negative = element leads (foreground). */
  speed?: number;
  /** Optional rotation tied to scroll position (degrees per element-height of travel). */
  rotate?: number;
  /** Optional scale tied to scroll position (additive, e.g. 0.05 = subtle breath). */
  scale?: number;
  className?: string;
}

export default function ParallaxLayer({
  children,
  speed = 0.2,
  rotate = 0,
  scale = 0,
  className = "",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const norm = center / window.innerHeight; // -1..1ish around center
      const ty = -center * speed;
      const rz = rotate * norm;
      const sc = 1 + scale * (1 - Math.min(1, Math.abs(norm)));
      el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) rotate(${rz.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, rotate, scale]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform", transformOrigin: "center" }}
    >
      {children}
    </div>
  );
}
