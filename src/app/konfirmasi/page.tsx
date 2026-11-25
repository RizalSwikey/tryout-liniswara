import Link from "next/link";
import type { Metadata } from "next";
import { MailCheck, ShieldCheck, Timer } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ResendForm } from "@/components/resend-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Konfirmasi email" };

/**
 * Halaman tunggu setelah mendaftar, sekaligus halaman hasil setelah tautan
 * konfirmasi diklik. Email Supabase mengarah ke /auth/confirm, yang menukar
 * token menjadi sesi lalu mengarahkan ke sini dengan ?status=berhasil.
 */
export default async function KonfirmasiPage({ searchParams }: PageProps<"/konfirmasi">) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";
  const status = typeof params.status === "string" ? params.status : "";
  const pesan = typeof params.pesan === "string" ? params.pesan : "";

  const { user } = await getSession();

  if (status === "berhasil") {
    return (
      <>
        <SiteHeader nama={user?.email ?? null} />
        <main className="mx-auto w-full max-w-[440px] px-4 py-10 sm:py-16">
          <span className="inline-flex size-11 items-center justify-center rounded-sm border border-line-strong bg-surface">
            <ShieldCheck aria-hidden="true" className="size-5 text-ok" />
          </span>
          <h1 className="mt-4 text-[26px] font-semibold text-ink">Email terkonfirmasi</h1>
          <p className="mt-2 text-muted-ink">
            Akunmu aktif. Langkah berikutnya memasukkan kode akses dari penerbit untuk membuka materi dan tryout.
          </p>
          <Link
            href={user ? "/dashboard" : "/masuk"}
            className="press mt-6 inline-flex h-11 items-center rounded-sm bg-primary px-5 text-base font-medium text-white hover:bg-primary-dark"
          >
            {user ? "Buka dashboard" : "Masuk ke akun"}
          </Link>
        </main>
      </>
    );
  }

  if (status === "gagal") {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto w-full max-w-[440px] px-4 py-10 sm:py-16">
          <h1 className="text-[26px] font-semibold text-ink">Tautan tidak berlaku</h1>
          <p className="mt-2 text-muted-ink">
            Tautan konfirmasi hanya bisa dipakai sekali dan punya masa berlaku.
            {pesan ? ` Server menjawab: ${pesan}` : ""}
          </p>
          <p className="mt-4 text-muted-ink">
            Minta tautan baru di bawah ini. Masukkan alamat email akunmu, lalu buka email yang datang.
          </p>
          <ResendForm email={email} />
          <p className="mt-6 text-sm text-muted-ink">
            Sudah pernah dikonfirmasi?{" "}
            <Link href="/masuk" className="font-medium text-primary underline underline-offset-2">
              Masuk
            </Link>
            .
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[440px] px-4 py-10 sm:py-16">
        <span className="inline-flex size-11 items-center justify-center rounded-sm border border-line-strong bg-surface">
          <MailCheck aria-hidden="true" className="size-5 text-primary" />
        </span>

        <h1 className="mt-4 text-[26px] font-semibold text-ink">Periksa emailmu</h1>
        <p className="mt-2 text-muted-ink">
          Akun dibuat. Klik tautan konfirmasi yang dikirim ke{" "}
          {email ? <strong className="font-medium text-ink">{email}</strong> : "alamat emailmu"} untuk mengaktifkannya.
        </p>

        <ol className="mt-6 space-y-3 rounded-sm border border-line bg-surface p-4 text-sm text-ink">
          <li className="flex gap-3">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-line-strong text-xs font-medium text-muted-ink">
              1
            </span>
            Buka kotak masuk, cari email dari Liniswara. Cek folder spam bila belum terlihat.
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-line-strong text-xs font-medium text-muted-ink">
              2
            </span>
            Klik tautan di dalamnya. Kamu akan kembali ke sini dengan status terkonfirmasi.
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-line-strong text-xs font-medium text-muted-ink">
              3
            </span>
            Masuk, lalu masukkan kode akses 12 karakter dari penerbit.
          </li>
        </ol>

        <p className="mt-4 flex items-start gap-2 text-sm text-muted-ink">
          <Timer aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Tautan berlaku terbatas. Bila kedaluwarsa, kirim ulang di bawah.
        </p>

        <ResendForm email={email} />

        <p className="mt-6 text-sm text-muted-ink">
          Sudah dikonfirmasi?{" "}
          <Link href="/masuk" className="font-medium text-primary underline underline-offset-2">
            Masuk
          </Link>
          .
        </p>
      </main>
    </>
  );
}
