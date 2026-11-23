import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60dvh] w-full max-w-md flex-col items-start justify-center gap-3 px-4">
      <h1 className="text-[22px] font-semibold text-ink">Halaman tidak ditemukan</h1>
      <p className="text-sm text-muted-ink">
        Alamat ini tidak ada, atau tryout yang kamu cari sudah tidak terbit.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex h-11 items-center rounded-sm bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark"
      >
        Kembali ke dashboard
      </Link>
    </main>
  );
}
