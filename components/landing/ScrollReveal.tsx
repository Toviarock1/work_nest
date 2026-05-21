"use client";

import React, { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | "rotate" | "zoom";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  once?: boolean;
}

const initialTransform: Record<Direction, string> = {
  up: "translate3d(0, 48px, -80px) rotateX(8deg)",
  down: "translate3d(0, -48px, -80px) rotateX(-8deg)",
  left: "translate3d(48px, 0, -80px) rotateY(-8deg)",
  right: "translate3d(-48px, 0, -80px) rotateY(8deg)",
  rotate: "translate3d(0, 30px, -80px) rotate(-6deg)",
  zoom: "scale(0.85) translateZ(-120px)",
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: visible ? "none" : initialTransform[direction],
        opacity: visible ? 1 : 0,
        transition: `transform 900ms cubic-bezier(.2,.7,.2,1) ${delay}ms, opacity 700ms ease ${delay}ms`,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
