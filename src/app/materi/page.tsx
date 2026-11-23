import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, LockKeyhole, PlayCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Materi video" };

export default async function MateriIndexPage() {
  const { supabase, profile, subscriptionEndsAt } = await requireSession();
  const aktif = Boolean(subscriptionEndsAt);

  const { data: materials, error } = aktif
    ? await supabase
        .from("materials")
        .select("id, slug, title, description, position")
        .eq("is_published", true)
        .order("position")
    : { data: null, error: null };

  return (
    <>
      <SiteHeader nama={profile?.full_name ?? null} aktif={aktif} endsAt={subscriptionEndsAt ?? undefined} />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-ink hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Dashboard
        </Link>

        <h1 className="mt-4 text-[26px] font-semibold text-ink">Materi video</h1>
        <p className="mt-1 text-muted-ink">
          Video pendek sebagai bekal sebelum tryout. Tonton satu, lalu kerjakan soal.
        </p>

        {!aktif && (
          <div className="mt-6 rounded-lg border border-line bg-surface p-4">
            <p className="flex items-start gap-2 font-medium text-ink">
              <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-line-strong" />
              Materi terkunci
            </p>
            <p className="mt-1 text-sm text-muted-ink">
              Masukkan kode akses di dashboard untuk membuka seluruh materi.
            </p>
            <Link
              href="/dashboard"
              className="mt-3 inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-4 font-medium text-white hover:bg-primary-dark"
            >
              Buka dashboard
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        )}

        {aktif && error && (
          <p role="alert" className="mt-6 rounded-sm border border-line-strong bg-surface p-4 text-sm">
            Materi gagal dimuat. Muat ulang halaman.
          </p>
        )}

        {aktif && materials?.length === 0 && (
          <p className="mt-6 rounded-sm border border-line bg-surface p-4 text-sm text-muted-ink">
            Belum ada materi yang terbit.
          </p>
        )}

        {aktif && materials && materials.length > 0 && (
          <ul className="mt-6 space-y-3">
            {materials.map((m, i) => (
              <li key={m.id}>
                <Link
                  href={`/materi/${m.slug}`}
                  className="flex items-start gap-3 rounded-lg border border-line bg-surface p-4 hover:border-line-strong"
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-sm font-semibold tnum text-muted-ink">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading text-lg font-semibold text-ink">{m.title}</span>
                    <span className="mt-0.5 block text-sm text-muted-ink">{m.description}</span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      <PlayCircle aria-hidden="true" className="size-4" />
                      Tonton video
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {aktif && (
          <p className="mt-8 flex items-center gap-1.5 text-sm text-muted-ink">
            <Clock3 aria-hidden="true" className="size-4" />
            Video dimuat hanya saat diputar, jadi halaman tetap ringan di koneksi lambat.
          </p>
        )}
      </main>
    </>
  );
}
