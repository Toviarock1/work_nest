"use client";

import { useEffect, useRef } from "react";

export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -200;
    let mouseY = -200;
    let ringX = -200;
    let ringY = -200;
    let raf = 0;

    const updateMagnetic = (mx: number, my: number) => {
      const els = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 90;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          el.style.transform = `translate(${dx * force * 0.38}px, ${dy * force * 0.38}px)`;
        } else {
          el.style.transform = "";
        }
      });
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot snaps to cursor immediately
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

      updateMagnetic(mouseX, mouseY);
    };

    const animate = () => {
      // Ring lags behind for liquid trail feel
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animate);
    };

    const onDocEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };
    const onDocLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onElEnter = () => {
      ring.style.width = "52px";
      ring.style.height = "52px";
      ring.style.borderColor = "rgba(13,242,147,0.9)";
      ring.style.background = "rgba(13,242,147,0.08)";
    };
    const onElLeave = () => {
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.borderColor = "rgba(13,242,147,0.5)";
      ring.style.background = "transparent";
    };

    const attachHoverListeners = () => {
      document
        .querySelectorAll<HTMLElement>("button, a, [data-magnetic]")
        .forEach((el) => {
          el.addEventListener("mouseenter", onElEnter);
          el.addEventListener("mouseleave", onElLeave);
        });
    };
    attachHoverListeners();

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseenter", onDocEnter);
    document.addEventListener("mouseleave", onDocLeave);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onDocEnter);
      document.removeEventListener("mouseleave", onDocLeave);
      cancelAnimationFrame(raf);

      document
        .querySelectorAll<HTMLElement>("button, a, [data-magnetic]")
        .forEach((el) => {
          el.removeEventListener("mouseenter", onElEnter);
          el.removeEventListener("mouseleave", onElLeave);
        });
    };
  }, []);

  return (
    <>
      {/* Cursor dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-9999 size-2.5 rounded-full bg-landing-page-primary opacity-0"
        style={{
          willChange: "transform",
          boxShadow: "0 0 8px 2px rgba(13,242,147,0.8)",
          transition: "opacity 0.2s",
        }}
      />
      {/* Ring — lags behind with lerp */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-9998 rounded-full border border-landing-page-primary/50 opacity-0"
        style={{
          width: 36,
          height: 36,
          willChange: "transform",
          transition:
            "width 0.2s ease, height 0.2s ease, background 0.2s ease, border-color 0.2s ease, opacity 0.25s ease",
        }}
      />
    </>
  );
}
