"use client";

import { useEffect, useRef } from "react";

/**
 * Menghitung naik dari 0 ke nilai akhir dalam ±800 ms. Tanpa konfeti.
 * Angka ditulis langsung ke simpul DOM (bukan lewat state) supaya tidak
 * memicu render ulang tiap frame. Reduced-motion langsung ke nilai akhir.
 */
export function CountUp({ value, durationMs = 800 }: { value: number; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof requestAnimationFrame === "undefined"
    ) {
      node.textContent = String(value);
      return;
    }

    let raf = 0;
    const mulai = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - mulai) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = String(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        0
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
