import Link from "next/link";
import { Logo } from "@/components/logo";

type Props = {
  nama?: string | null;
  aktif?: boolean;
  endsAt?: string | null;
};

export function SiteHeader({ nama, aktif, endsAt }: Props) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href={nama ? "/dashboard" : "/"} className="rounded-sm" aria-label="Liniswara, ke beranda">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {nama ? (
            <>
              <Link
                href="/materi"
                className="rounded-sm px-3 py-2 text-muted-ink hover:text-ink"
              >
                Materi
              </Link>
              <Link
                href="/riwayat"
                className="hidden rounded-sm px-3 py-2 text-muted-ink hover:text-ink sm:inline-block"
              >
                Riwayat
              </Link>
              <Link
                href="/dashboard"
                className="rounded-sm px-3 py-2 font-medium text-ink"
                title={aktif ? `Aktif sampai ${endsAt}` : "Belum aktif"}
              >
                {nama.split(" ")[0]}
              </Link>
            </>
          ) : (
            <>
              <Link href="/masuk" className="rounded-sm px-3 py-2 text-muted-ink hover:text-ink">
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="rounded-sm border border-primary bg-primary px-3 py-2 font-medium text-white hover:bg-primary-dark"
              >
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
