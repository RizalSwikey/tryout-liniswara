import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CircleAlert,
  History,
  KeyRound,
  LockKeyhole,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { RedeemForm } from "@/components/redeem-form";
import { LogoutButton } from "@/components/logout-button";
import { requireSession } from "@/lib/auth";
import { startAttemptAction } from "@/app/actions/tryout";
import { formatTanggal } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const { supabase, user, profile, subscriptionEndsAt } = await requireSession();
  const params = await searchParams;
  const aktif = Boolean(subscriptionEndsAt);

  const { data: tryouts, error: tryoutError } = aktif
    ? await supabase
        .from("tryouts")
        .select("id, title, duration_minutes")
        .eq("is_published", true)
        .order("title")
    : { data: null, error: null };

  const { data: materials } = aktif
    ? await supabase
        .from("materials")
        .select("id, slug, title, description")
        .eq("is_published", true)
        .order("position")
        .limit(3)
    : { data: null };

  const { data: attempts } = await supabase
    .from("attempts")
    .select("id, tryout_id, submitted_at, score")
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false })
    .limit(3);

  const nama = profile?.full_name ?? user.email ?? "Kamu";
  const sudahRedeem = params.redeemed === "1";

  return (
    <>
      <SiteHeader nama={nama} aktif={aktif} endsAt={subscriptionEndsAt ?? undefined} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold text-ink">Halo, {nama.split(" ")[0]}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              {aktif ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--ok),white_65%)] bg-[color-mix(in_srgb,var(--ok),white_92%)] px-2.5 py-0.5 font-medium text-ok">
                  <CalendarClock aria-hidden="true" className="size-3.5" />
                  Aktif sampai {formatTanggal(subscriptionEndsAt!)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-2.5 py-0.5 font-medium text-muted-ink">
                  <LockKeyhole aria-hidden="true" className="size-3.5" />
                  Belum aktif
                </span>
              )}
              <span className="text-muted-ink">{user.email}</span>
            </p>
          </div>
          <LogoutButton />
        </div>

        {sudahRedeem && aktif && (
          <p
            role="status"
            className="mt-5 rounded-sm border border-[color-mix(in_srgb,var(--ok),white_65%)] bg-[color-mix(in_srgb,var(--ok),white_94%)] px-3 py-2 text-sm text-ok"
          >
            Kode berhasil dipakai. Akses aktif sampai {formatTanggal(subscriptionEndsAt!)}.
          </p>
        )}

        {params["perlu-kode"] === "1" && (
          <p
            role="status"
            className="mt-5 flex items-start gap-2 rounded-sm border border-line-strong bg-surface px-3 py-2 text-sm text-ink"
          >
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warn" />
            Tryout butuh langganan aktif. Masukkan kode akses dulu.
          </p>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <section aria-labelledby="tryout-heading">
            <h2 id="tryout-heading" className="text-lg font-semibold text-ink">
              Tryout
            </h2>
            <div className="mt-2 space-y-3">
              {!aktif && (
                <div className="rounded-lg border border-line bg-surface p-4">
                  <p className="flex items-start gap-2 text-sm text-muted-ink">
                    <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-line-strong" />
                    Aktifkan kode untuk mulai tryout dan membuka materi video.
                  </p>
                </div>
              )}

              {aktif && tryoutError && (
                <p role="alert" className="rounded-sm border border-line-strong bg-surface p-4 text-sm text-ink">
                  Daftar tryout gagal dimuat. Muat ulang halaman.
                </p>
              )}

              {aktif && tryouts?.length === 0 && (
                <p className="rounded-sm border border-line bg-surface p-4 text-sm text-muted-ink">
                  Belum ada tryout yang terbit. Hubungi penerbit.
                </p>
              )}

              {aktif &&
                tryouts?.map((t) => {
                  const terakhir = attempts?.find((a) => a.tryout_id === t.id);
                  return (
                    <article key={t.id} className="rounded-lg border border-line bg-surface p-4">
                      <h3 className="font-heading text-xl font-semibold text-ink">{t.title}</h3>
                      <p className="mt-1 text-sm text-muted-ink">
                        10 soal, 30 pernyataan Benar/Salah, {t.duration_minutes} menit.
                      </p>
                      <p className="mt-1 text-sm text-muted-ink">
                        {terakhir
                          ? `Percobaan terakhir: ${terakhir.score} dari 30.`
                          : "Belum dikerjakan."}
                      </p>
                      <form action={startAttemptAction} className="mt-4">
                        <input type="hidden" name="tryoutId" value={t.id} />
                        <button
                          type="submit"
                          className="inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-5 text-base font-medium text-white hover:bg-primary-dark"
                        >
                          Mulai tryout
                          <ArrowRight aria-hidden="true" className="size-4" />
                        </button>
                      </form>
                    </article>
                  );
                })}
            </div>

            <h2 className="mt-8 text-lg font-semibold text-ink">Langkah berikutnya</h2>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <Link
                href="/materi"
                className="group flex items-start gap-3 rounded-lg border border-line bg-surface p-4 hover:border-line-strong"
              >
                <BookOpen aria-hidden="true" className="mt-0.5 size-5 text-primary" />
                <span>
                  <span className="block font-medium text-ink">Materi video</span>
                  <span className="block text-sm text-muted-ink">
                    {aktif
                      ? "Tonton materi singkat sebelum tryout."
                      : "Terkunci sampai kode diaktifkan."}
                  </span>
                </span>
              </Link>
              <Link
                href="/riwayat"
                className="group flex items-start gap-3 rounded-lg border border-line bg-surface p-4 hover:border-line-strong"
              >
                <History aria-hidden="true" className="mt-0.5 size-5 text-primary" />
                <span>
                  <span className="block font-medium text-ink">Riwayat hasil</span>
                  <span className="block text-sm text-muted-ink">
                    {attempts?.length ? `${attempts.length} percobaan terakhir.` : "Belum ada percobaan."}
                  </span>
                </span>
              </Link>
            </div>

            {aktif && materials && materials.length > 0 && (
              <>
                <h2 className="mt-8 text-lg font-semibold text-ink">Materi terbaru</h2>
                <ul className="mt-2 divide-y divide-line rounded-lg border border-line bg-surface">
                  {materials.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/materi/${m.slug}`}
                        className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-paper"
                      >
                        <span>
                          <span className="block font-medium text-ink">{m.title}</span>
                          <span className="block text-sm text-muted-ink">{m.description}</span>
                        </span>
                        <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-ink" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <aside aria-labelledby="kode-heading" className="space-y-3">
            <div className="rounded-lg border border-line bg-surface p-4">
              <h2 id="kode-heading" className="flex items-center gap-2 font-heading text-xl font-semibold text-ink">
                <KeyRound aria-hidden="true" className="size-5 text-primary" />
                {aktif ? "Tambah masa aktif" : "Punya kode akses?"}
              </h2>
              <p className="mt-1 mb-4 text-sm text-muted-ink">
                {aktif
                  ? "Kode baru menambah masa aktif dari tanggal berakhir saat ini."
                  : "Masukkan kode dari penerbit. Satu kode untuk satu akun."}
              </p>
              <RedeemForm compact />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
