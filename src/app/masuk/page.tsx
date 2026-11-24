import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { AuthForm } from "@/components/auth-form";
import { loginAction } from "@/app/actions/auth";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Masuk" };

export default async function MasukPage({
  searchParams,
}: PageProps<"/masuk">) {
  const session = await getSession();
  if (session.user) redirect("/dashboard");

  const { next } = await searchParams;
  const nextPath = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "";

  const konfirmasi = (await searchParams).konfirmasi;
  const pesanKonfirmasi = typeof konfirmasi === "string" ? konfirmasi : "";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[400px] px-4 py-10 sm:py-16">
        <h1 className="text-[26px] font-semibold text-ink">Masuk</h1>
        <p className="mt-1 mb-6 text-muted-ink">
          Lanjutkan tryout dan materi yang sedang kamu kerjakan.
        </p>

        {pesanKonfirmasi && (
          <p
            role="alert"
            className="mb-4 flex gap-2 rounded-sm border border-line-strong bg-surface px-3 py-2 text-sm text-ink"
          >
            Konfirmasi email gagal: {pesanKonfirmasi} Minta tautan baru dengan mendaftar ulang memakai email yang sama.
          </p>
        )}

        <AuthForm
          action={loginAction}
          submitLabel="Masuk"
          pendingLabel="Memeriksa…"
          hidden={nextPath ? { next: nextPath } : undefined}
          fields={[
            {
              name: "email",
              label: "Email",
              type: "email",
              autoComplete: "email",
              placeholder: "nama@email.com",
            },
            {
              name: "password",
              label: "Kata sandi",
              type: "password",
              autoComplete: "current-password",
            },
          ]}
          footer={
            <p className="text-sm text-muted-ink">
              Belum punya akun?{" "}
              <Link href="/daftar" className="font-medium text-primary underline underline-offset-2">
                Daftar
              </Link>
            </p>
          }
        />
      </main>
    </>
  );
}
