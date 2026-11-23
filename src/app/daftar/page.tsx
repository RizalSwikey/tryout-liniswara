import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { AuthForm } from "@/components/auth-form";
import { registerAction } from "@/app/actions/auth";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Daftar" };

export default async function DaftarPage() {
  const session = await getSession();
  if (session.user) redirect("/dashboard");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[400px] px-4 py-10 sm:py-16">
        <h1 className="text-[26px] font-semibold text-ink">Buat akun</h1>
        <p className="mt-1 mb-6 text-muted-ink">
          Isi email dan kata sandi. Kode akses dimasukkan setelah akun jadi.
        </p>

        <AuthForm
          action={registerAction}
          submitLabel="Buat akun"
          pendingLabel="Membuat akun…"
          fields={[
            {
              name: "fullName",
              label: "Nama",
              autoComplete: "name",
              placeholder: "Nama yang tampil di dashboard",
            },
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
              autoComplete: "new-password",
              help: "Minimal 8 karakter.",
            },
            {
              name: "confirm",
              label: "Ulangi kata sandi",
              type: "password",
              autoComplete: "new-password",
            },
          ]}
          footer={
            <p className="text-sm text-muted-ink">
              Sudah punya akun?{" "}
              <Link href="/masuk" className="font-medium text-primary underline underline-offset-2">
                Masuk
              </Link>
            </p>
          }
        />
      </main>
    </>
  );
}
