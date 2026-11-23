import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, History } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { requireSession } from "@/lib/auth";
import { formatTanggal, formatWaktu } from "@/lib/format";

export const metadata: Metadata = { title: "Riwayat hasil" };

export default async function RiwayatPage() {
  const { supabase, profile, subscriptionEndsAt } = await requireSession();

  const { data: attempts, error } = await supabase
    .from("attempts")
    .select("id, tryout_id, submitted_at, score")
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false })
    .limit(50);

  const tryoutIds = [...new Set((attempts ?? []).map((a) => a.tryout_id))];
  const { data: tryouts } = tryoutIds.length
    ? await supabase.from("tryouts").select("id, title").in("id", tryoutIds)
    : { data: [] as { id: string; title: string }[] };

  const judul = new Map((tryouts ?? []).map((t) => [t.id, t.title]));

  return (
    <>
      <SiteHeader nama={profile?.full_name ?? null} aktif={Boolean(subscriptionEndsAt)} />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-ink hover:text-ink">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Dashboard
        </Link>

        <h1 className="mt-4 text-[26px] font-semibold text-ink">Riwayat hasil</h1>
        <p className="mt-1 text-muted-ink">Semua percobaan yang sudah dikirim, terbaru di atas.</p>

        {error && (
          <p role="alert" className="mt-6 rounded-sm border border-line-strong bg-surface p-4 text-sm">
            Riwayat gagal dimuat. Muat ulang halaman.
          </p>
        )}

        {!error && attempts?.length === 0 && (
          <div className="mt-6 rounded-lg border border-line bg-surface p-5">
            <p className="flex items-center gap-2 font-medium text-ink">
              <History aria-hidden="true" className="size-5 text-line-strong" />
              Belum ada percobaan
            </p>
            <p className="mt-1 text-sm text-muted-ink">
              Kerjakan tryout pertama; hasilnya otomatis tercatat di sini.
            </p>
            <Link
              href="/dashboard"
              className="mt-3 inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Mulai tryout
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        )}

        {attempts && attempts.length > 0 && (
          <ul className="mt-6 divide-y divide-line rounded-lg border border-line bg-surface">
            {attempts.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/tryout/${a.tryout_id}/hasil/${a.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 hover:bg-paper"
                >
                  <span>
                    <span className="block font-medium text-ink">
                      {judul.get(a.tryout_id) ?? "Tryout"}
                    </span>
                    <span className="block text-sm text-muted-ink">
                      {formatTanggal(a.submitted_at!)} pukul {formatWaktu(a.submitted_at!)}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-heading text-lg font-semibold tnum text-ink">{a.score} / 30</span>
                    <ArrowRight aria-hidden="true" className="size-4 text-muted-ink" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
