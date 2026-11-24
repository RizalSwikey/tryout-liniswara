"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

/** True begitu halaman digulir melewati ambang. */
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

/** Header sticky dengan bayangan tipis setelah digulir. */
export function ScrollHeader({
  children,
  className = "border-b border-line bg-surface",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrolled = useScrolled();
  return (
    <header
      className={`sticky top-0 z-30 transition-shadow duration-150 ${className} ${
        scrolled ? "shadow-[0_1px_2px_rgba(23,38,54,0.08)]" : ""
      }`}
    >
      {children}
    </header>
  );
}

type Props = {
  nama?: string | null;
  aktif?: boolean;
  endsAt?: string | null;
};

export function SiteHeader({ nama, aktif, endsAt }: Props) {
  return (
    <ScrollHeader>
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href={nama ? "/dashboard" : "/"} className="press rounded-sm" aria-label="Liniswara, ke beranda">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {nama ? (
            <>
              <Link
                href="/materi"
                className="press rounded-sm px-3 py-2 text-muted-ink hover:text-ink"
              >
                Materi
              </Link>
              <Link
                href="/riwayat"
                className="press hidden rounded-sm px-3 py-2 text-muted-ink hover:text-ink sm:inline-block"
              >
                Riwayat
              </Link>
              <Link
                href="/dashboard"
                className="press rounded-sm px-3 py-2 font-medium text-ink"
                title={aktif ? `Aktif sampai ${endsAt}` : "Belum aktif"}
              >
                {nama.split(" ")[0]}
              </Link>
            </>
          ) : (
            <>
              <Link href="/masuk" className="press rounded-sm px-3 py-2 text-muted-ink hover:text-ink">
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="press rounded-sm border border-primary bg-primary px-3 py-2 font-medium text-white hover:bg-primary-dark"
              >
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </ScrollHeader>
  );
}

