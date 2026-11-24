"use client";

import Link, { useLinkStatus } from "next/link";
import { Loader2, PlayCircle } from "lucide-react";

function StatusTeks() {
  const { pending } = useLinkStatus();
  if (pending) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-ink">
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        Membuka materi…
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
      <PlayCircle aria-hidden="true" className="size-4" />
      Tonton video
    </span>
  );
}

export function MaterialCard({
  href,
  nomor,
  title,
  description,
}: {
  href: string;
  nomor: number;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      prefetch
      className="press flex items-start gap-3 rounded-lg border border-line bg-surface p-4 hover:border-line-strong active:bg-paper"
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-sm font-semibold tnum text-muted-ink">
        {nomor}
      </span>
      <span className="min-w-0">
        <span className="block font-heading text-lg font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-sm text-muted-ink">{description}</span>
        <span className="mt-2 block">
          <StatusTeks />
        </span>
      </span>
    </Link>
  );
}
