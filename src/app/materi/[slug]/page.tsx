import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { LiteYouTube } from "@/components/lite-youtube";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Materi" };

export default async function MateriDetailPage({ params }: PageProps<"/materi/[slug]">) {
  const { slug } = await params;
  const { supabase, profile, subscriptionEndsAt } = await requireSession();
  const aktif = Boolean(subscriptionEndsAt);

  if (!aktif) {
    return (
      <>
        <SiteHeader nama={profile?.full_name ?? null} aktif={false} />
        <main className="mx-auto w-full max-w-2xl px-4 py-10">
          <div className="rounded-lg border border-line bg-surface p-5">
            <h1 className="flex items-center gap-2 text-xl font-semibold text-ink">
              <LockKeyhole aria-hidden="true" className="size-5 text-line-strong" />
              Materi terkunci
            </h1>
            <p className="mt-2 text-muted-ink">
              Akses materi butuh langganan aktif. Masukkan kode akses di dashboard.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-4 font-medium text-white hover:bg-primary-dark"
            >
              Ke dashboard
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Satu query: daftar materi terbit dipakai untuk mencari yang diminta
  // sekaligus menyusun "materi lain". Daftar ini kecil dan sama untuk semua
  // user berlangganan, jadi dua query berurutan tidak sepadan.
  const { data: materials, error } = await supabase
    .from("materials")
    .select("id, slug, title, description, youtube_id, position")
    .eq("is_published", true)
    .order("position");

  if (error) {
    return (
      <>
        <SiteHeader nama={profile?.full_name ?? null} aktif />
        <main className="mx-auto w-full max-w-2xl px-4 py-10">
          <p role="alert" className="rounded-sm border border-line-strong bg-surface p-4 text-sm">
            Materi gagal dimuat. Muat ulang halaman.
          </p>
        </main>
      </>
    );
  }

  const material = materials?.find((m) => m.slug === slug);
  if (!material) notFound();

  const others = (materials ?? []).filter((m) => m.id !== material.id).slice(0, 3);

  return (
    <>
      <SiteHeader nama={profile?.full_name ?? null} aktif endsAt={subscriptionEndsAt ?? undefined} />
      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-10">
        <Link
          href="/materi"
          className="inline-flex items-center gap-1.5 text-sm text-muted-ink hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Semua materi
        </Link>

        <h1 className="mt-4 text-[26px] font-semibold text-ink">{material.title}</h1>
        <p className="mt-1 text-muted-ink">{material.description}</p>

        <div className="mt-5">
          <LiteYouTube videoId={material.youtube_id} title={material.title} />
        </div>

        <p className="mt-3 text-sm text-muted-ink">
          Video dibuka lewat youtube-nocookie.com tanpa cookie pelacak sampai diputar.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-sm border border-primary px-4 font-medium text-primary hover:bg-[color-mix(in_srgb,var(--primary),white_94%)]"
        >
          Kerjakan tryout
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>

        {others && others.length > 0 && (
          <section aria-labelledby="materi-lain" className="mt-8">
            <h2 id="materi-lain" className="text-sm font-semibold tracking-wide text-muted-ink uppercase">
              Materi lain
            </h2>
            <ul className="mt-2 divide-y divide-line rounded-lg border border-line bg-surface">
              {others.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/materi/${o.slug}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-paper"
                  >
                    <span className="text-ink">{o.title}</span>
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-ink" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
