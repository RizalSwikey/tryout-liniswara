import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Timer } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { requireSession } from "@/lib/auth";
import { startAttemptAction } from "@/app/actions/tryout";

export const metadata: Metadata = { title: "Tryout" };

export default async function TryoutIntroPage({ params }: PageProps<"/tryout/[id]">) {
  const { id } = await params;
  const { supabase, profile, subscriptionEndsAt } = await requireSession();
  const aktif = Boolean(subscriptionEndsAt);

  const { data: tryout, error } = await supabase
    .from("tryouts")
    .select("id, title, duration_minutes")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  return (
    <>
      <SiteHeader nama={profile?.full_name ?? null} aktif={aktif} endsAt={subscriptionEndsAt ?? undefined} />
      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-10">
        <h1 className="text-[26px] font-semibold text-ink">
          {tryout?.title ?? "Tryout tidak ditemukan"}
        </h1>

        {error || !tryout ? (
          <p role="alert" className="mt-4 rounded-sm border border-line-strong bg-surface p-4 text-sm">
            {aktif
              ? "Tryout tidak ditemukan atau belum terbit."
              : "Tryout terkunci. Aktifkan kode akses dulu di dashboard."}
          </p>
        ) : (
          <>
            <p className="mt-2 text-muted-ink">
              Format PGK Kategori: setiap soal punya satu stimulus dan tiga pernyataan yang dijawab
              Benar atau Salah.
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-line bg-surface p-4">
                <dt className="flex items-center gap-1.5 text-sm text-muted-ink">
                  <FileText aria-hidden="true" className="size-4" /> Soal
                </dt>
                <dd className="mt-1 font-heading text-2xl font-semibold tnum text-ink">10</dd>
              </div>
              <div className="rounded-lg border border-line bg-surface p-4">
                <dt className="text-sm text-muted-ink">Pernyataan</dt>
                <dd className="mt-1 font-heading text-2xl font-semibold tnum text-ink">30</dd>
              </div>
              <div className="rounded-lg border border-line bg-surface p-4">
                <dt className="flex items-center gap-1.5 text-sm text-muted-ink">
                  <Timer aria-hidden="true" className="size-4" /> Waktu
                </dt>
                <dd className="mt-1 font-heading text-2xl font-semibold tnum text-ink">
                  {tryout.duration_minutes}
                  <span className="ml-1 font-sans text-base font-normal text-muted-ink">menit</span>
                </dd>
              </div>
            </dl>

            <ul className="mt-6 space-y-2 text-sm text-ink">
              <li>Jawaban tersimpan otomatis setiap kali kamu memilih Benar atau Salah.</li>
              <li>Timer berjalan sejak tombol di bawah ditekan, termasuk saat tab ditutup.</li>
              <li>Pembahasan tiap pernyataan muncul setelah jawaban dikirim.</li>
            </ul>

            {aktif ? (
              <form action={startAttemptAction} className="mt-6">
                <input type="hidden" name="tryoutId" value={tryout.id} />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-6 text-base font-medium text-white hover:bg-primary-dark"
                >
                  Mulai, timer berjalan
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              </form>
            ) : (
              <div className="mt-6 rounded-lg border border-line bg-surface p-4">
                <p className="text-sm text-muted-ink">
                  Tryout butuh langganan aktif. Masukkan kode akses di dashboard.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-3 inline-flex h-11 items-center rounded-sm bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  Ke dashboard
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
