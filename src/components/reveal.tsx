"use client";

import { useEffect, useRef } from "react";

/**
 * Muncul sekali saat elemen masuk viewport. Sekali saja: animasi yang diulang
 * tiap gulir membuat halaman ujian terasa gelisah.
 *
 * Keadaan tersembunyi hanya berlaku bila <html> punya kelas `js` (dipasang
 * skrip inline di layout sebelum paint), jadi tanpa JavaScript konten tetap
 * tampil. Kelas animasi dipasang langsung ke simpul DOM, bukan lewat state,
 * supaya tidak memicu render ulang.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => {
      if (delay) node.style.animationDelay = `${delay}ms`;
      node.classList.add("enter-rise");
    };

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    // Reduced-motion: cukup tampil, tanpa menunggu masuk viewport.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref as never} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}
