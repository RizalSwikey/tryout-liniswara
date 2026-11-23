import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  KeyRound,
  ListChecks,
  LockKeyhole,
  MessageCircleQuestion,
  MonitorSmartphone,
  ShieldCheck,
  Timer,
  UserPlus,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { DemoQuestion } from "@/components/demo-question";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Tryout Liniswara — 10 soal, 30 pernyataan Benar/Salah",
  description:
    "Tryout literasi format PGK Kategori dari penerbit Liniswara. 10 soal, 30 pernyataan Benar/Salah, pembahasan tiap pernyataan setelah kirim. Akses dengan kode.",
};

const CARA_KERJA = [
  {
    icon: UserPlus,
    judul: "Daftar dengan email",
    isi: "Cukup email dan kata sandi. Tanpa nomor HP, tanpa verifikasi berlapis.",
  },
  {
    icon: KeyRound,
    judul: "Masukkan kode akses",
    isi: "Kode 12 karakter dari penerbit membuka materi dan tryout. Masa aktif ditambahkan ke sisa langganan.",
  },
  {
    icon: BookOpen,
    judul: "Tonton materi",
    isi: "Video pendek soal membaca kritis dan penalaran. Dimuat hanya saat diputar.",
  },
  {
    icon: ClipboardCheck,
    judul: "Kerjakan tryout",
    isi: "10 soal, 30 pernyataan, timer dari server. Pembahasan muncul setelah jawaban dikirim.",
  },
];

const ISI = [
  {
    icon: ListChecks,
    judul: "Format PGK Kategori",
    isi: "Satu stimulus, tiga pernyataan, masing-masing Benar atau Salah. Sama seperti butir PGK Kategori di TKA.",
  },
  {
    icon: Timer,
    judul: "Timer berjalan dari server",
    isi: "Hitung mundur mengikuti deadline di server, bukan jam perangkat. Tab ditutup pun waktu tetap berjalan.",
  },
  {
    icon: CheckCircle2,
    judul: "Pembahasan per pernyataan",
    isi: "Setelah dikirim, setiap pernyataan menunjukkan kunci, jawabanmu, dan alasan singkatnya.",
  },
  {
    icon: MonitorSmartphone,
    judul: "Dibuat untuk HP",
    isi: "Satu soal per layar, tombol selebar layar, jawaban tersimpan tiap klik meski koneksi putus.",
  },
];

const FAQ = [
  {
    t: "Bagaimana cara mendapat kode akses?",
    j: "Kode dibagikan penerbit Liniswara bersama paket buku atau program tryout. Kalau belum punya, hubungi admin lewat WhatsApp di bagian bawah halaman ini.",
  },
  {
    t: "Kode saya ditolak. Apa yang salah?",
    j: "Periksa 12 karakter dan pastikan tanpa spasi. Kode juga bisa sudah kedaluwarsa, sudah mencapai batas pemakaian, atau pernah kamu pakai sendiri — satu kode hanya berlaku sekali per akun.",
  },
  {
    t: "Apakah akses otomatis diperpanjang?",
    j: "Tidak. Akses berhenti di tanggal yang tertera di dashboard. Tidak ada tagihan berulang dan tidak ada data pembayaran yang disimpan.",
  },
  {
    t: "Bisakah tryout diulang?",
    j: "Bisa. Setiap percobaan punya hasil sendiri dan tersimpan di halaman riwayat, jadi kamu bisa membandingkan.",
  },
  {
    t: "Format soalnya sama dengan TKA?",
    j: "Bentuknya mengikuti PGK Kategori: satu stimulus dengan tiga pernyataan Benar/Salah. Isi soal latihan disusun sendiri, bukan salinan soal resmi.",
  },
  {
    t: "HP saya lambat. Masih bisa dipakai?",
    j: "Bisa. Halaman soal hanya memuat teks, video dimuat hanya saat diputar, dan jawaban disimpan per klik supaya tidak hilang saat sinyal putus.",
  },
];

export default async function LandingPage() {
  const { user, profile } = await getSession();
  const nama = profile?.full_name ?? null;

  return (
    <div className="min-h-dvh">
      <a
        href="#isi"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:ring-2 focus:ring-primary"
      >
        Lewati ke isi halaman
      </a>

      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-none">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Link href="/" aria-label="Liniswara, ke atas halaman" className="rounded-sm">
            <Logo />
          </Link>
          <nav aria-label="Navigasi halaman" className="hidden items-center gap-1 text-sm sm:flex">
            <a href="#cara-kerja" className="rounded-sm px-3 py-2 text-muted-ink hover:text-ink">
              Cara kerja
            </a>
            <a href="#isi" className="rounded-sm px-3 py-2 text-muted-ink hover:text-ink">
              Isi produk
            </a>
            <a href="#orang-tua" className="rounded-sm px-3 py-2 text-muted-ink hover:text-ink">
              Untuk orang tua
            </a>
            <a href="#faq" className="rounded-sm px-3 py-2 text-muted-ink hover:text-ink">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-1">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center rounded-sm bg-primary px-3.5 text-sm font-medium text-white hover:bg-primary-dark"
              >
                {nama ? nama.split(" ")[0] : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link href="/masuk" className="rounded-sm px-2.5 py-2 text-sm text-muted-ink hover:text-ink">
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  className="inline-flex h-10 items-center rounded-sm bg-primary px-3.5 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 pt-8 pb-10 sm:pt-14" aria-labelledby="hero-judul">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted-ink">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-mark" />
                Tryout literasi dari penerbit Liniswara
              </p>
              <h1 id="hero-judul" className="mt-4 text-[32px] leading-[1.15] font-bold text-ink sm:text-[40px]">
                Latihan soal Benar/Salah yang bentuknya sama dengan TKA.
              </h1>
              <p className="mt-4 max-w-prose text-[17px] text-muted-ink">
                10 soal, 30 pernyataan, satu stimulus per soal. Kerjakan di HP, kirim, lalu baca
                pembahasan setiap pernyataan. Akses dibuka dengan kode dari penerbit.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Link
                  href={user ? "/dashboard" : "/daftar"}
                  className="inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-5 text-base font-medium text-white hover:bg-primary-dark"
                >
                  {user ? "Buka dashboard" : "Mulai tryout"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <a
                  href="#kode"
                  className="inline-flex h-12 items-center gap-2 rounded-sm border border-line-strong px-5 text-base font-medium text-ink hover:bg-surface"
                >
                  <KeyRound aria-hidden="true" className="size-4" />
                  Punya kode akses?
                </a>
              </div>

              <dl className="mt-7 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-4 text-sm">
                <div>
                  <dt className="text-muted-ink">Soal</dt>
                  <dd className="font-heading text-2xl font-semibold tnum text-ink">10</dd>
                </div>
                <div>
                  <dt className="text-muted-ink">Pernyataan</dt>
                  <dd className="font-heading text-2xl font-semibold tnum text-ink">30</dd>
                </div>
                <div>
                  <dt className="text-muted-ink">Waktu</dt>
                  <dd className="font-heading text-2xl font-semibold tnum text-ink">30 mnt</dd>
                </div>
              </dl>
            </div>

            <div className="lg:sticky lg:top-20">
              <DemoQuestion />
              <p className="mt-2 text-xs text-muted-ink">
                Contoh soal di atas memakai teks pendek buatan sendiri, bukan soal ujian resmi.
              </p>
            </div>
          </div>
        </section>

        <section id="cara-kerja" aria-labelledby="cara-kerja-judul" className="border-t border-line bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
            <h2 id="cara-kerja-judul" className="text-[26px] font-semibold text-ink">
              Cara kerja
            </h2>
            <p className="mt-1 max-w-prose text-muted-ink">Empat langkah, semuanya di browser.</p>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CARA_KERJA.map(({ icon: Icon, judul, isi }, i) => (
                <li key={judul} className="rounded-lg border border-line bg-paper p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full border border-line bg-surface text-sm font-semibold tnum text-muted-ink">
                      {i + 1}
                    </span>
                    <Icon aria-hidden="true" className="size-4 text-primary" />
                  </div>
                  <h3 className="mt-3 font-heading text-lg font-semibold text-ink">{judul}</h3>
                  <p className="mt-1 text-sm text-muted-ink">{isi}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="isi" aria-labelledby="isi-judul" className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
          <h2 id="isi-judul" className="text-[26px] font-semibold text-ink">
            Isi produk
          </h2>
          <p className="mt-1 max-w-prose text-muted-ink">
            Yang benar-benar ada di dalam akun setelah kode diaktifkan.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ISI.map(({ icon: Icon, judul, isi }) => (
              <article key={judul} className="rounded-lg border border-line bg-surface p-4">
                <Icon aria-hidden="true" className="size-5 text-primary" />
                <h3 className="mt-2.5 font-heading text-lg font-semibold text-ink">{judul}</h3>
                <p className="mt-1 text-sm text-muted-ink">{isi}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="orang-tua" aria-labelledby="orang-tua-judul" className="border-t border-line bg-surface">
          <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:py-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 id="orang-tua-judul" className="text-[26px] font-semibold text-ink">
                Untuk orang tua
              </h2>
              <p className="mt-2 text-muted-ink">
                Yang dilaporkan ke akun hanya hasil pengerjaan. Tidak ada iklan di dalam aplikasi dan
                tidak ada tagihan berulang.
              </p>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                ["Masa akses jelas", "Tanggal berakhir tampil di dashboard sejak kode diaktifkan."],
                ["Tanpa auto-perpanjang", "Akses berhenti sendiri di tanggal itu; tidak ada penarikan dana."],
                ["Tanpa iklan pihak ketiga", "Halaman hanya memuat materi, soal, dan hasil."],
                ["Hasil tersimpan", "Setiap percobaan punya skor 0–30 dan pembahasan per pernyataan."],
              ].map(([judul, isi]) => (
                <li key={judul} className="flex gap-2.5">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ok" />
                  <span>
                    <span className="block font-medium text-ink">{judul}</span>
                    <span className="block text-muted-ink">{isi}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="kode" aria-labelledby="kode-judul" className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
          <div className="rounded-lg border border-line bg-surface p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-[1.4fr_1fr] sm:items-center">
              <div>
                <h2 id="kode-judul" className="flex items-center gap-2 text-[26px] font-semibold text-ink">
                  <KeyRound aria-hidden="true" className="size-6 text-primary" />
                  Punya kode akses?
                </h2>
                <p className="mt-2 max-w-prose text-muted-ink">
                  Kode 12 karakter dari penerbit Liniswara membuka seluruh materi dan tryout. Satu kode
                  untuk satu akun; sisa masa aktif ditambahkan, bukan ditimpa.
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm text-muted-ink">
                  <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-line-strong" />
                  Kode ditukar di server. Daftar kode tidak bisa dibaca dari browser.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={user ? "/dashboard" : "/daftar"}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-base font-medium text-white hover:bg-primary-dark"
                >
                  {user ? "Masukkan kode di dashboard" : "Daftar lalu masukkan kode"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <p className="text-center text-xs text-muted-ink">
                  Belum punya kode? Hubungi admin lewat WhatsApp di bawah.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-judul" className="border-t border-line bg-surface">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:py-12">
            <h2 id="faq-judul" className="flex items-center gap-2 text-[26px] font-semibold text-ink">
              <MessageCircleQuestion aria-hidden="true" className="size-6 text-primary" />
              Pertanyaan yang sering muncul
            </h2>
            <div className="mt-5 divide-y divide-line border-y border-line">
              {FAQ.map((item) => (
                <details key={item.t} className="group py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-ink marker:hidden">
                    <span className="font-medium">{item.t}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-lg leading-none text-muted-ink transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-muted-ink">{item.j}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <Logo />
              <p className="mt-2 max-w-sm text-sm text-muted-ink">
                Tryout literasi format PGK Kategori. Dikelola oleh penerbit Liniswara, PT Lini Suara
                Nusantara.
              </p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-ink">Kontak</p>
              <ul className="mt-1.5 space-y-1 text-muted-ink">
                <li>
                  <a
                    href="https://wa.me/6285162949440"
                    className="underline underline-offset-2 hover:text-ink"
                    rel="noreferrer"
                  >
                    WhatsApp admin pemesanan
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/liniswara"
                    className="underline underline-offset-2 hover:text-ink"
                    rel="noreferrer"
                  >
                    Instagram @liniswara
                  </a>
                </li>
                <li className="flex items-start gap-1.5">
                  <Clock3 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                  Gunungpring, Muntilan, Kabupaten Magelang, Jawa Tengah
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-6 border-t border-line pt-4 text-xs text-muted-ink">
            © {new Date().getFullYear()} PT Lini Suara Nusantara. Palet warna diturunkan dari aset publik
            Liniswara, bukan dari brand guideline resmi.
          </p>
        </div>
      </footer>

      <div className="h-[57px] sm:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface px-4 py-1 sm:hidden">
        <Link
          href={user ? "/dashboard" : "/daftar"}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-primary text-base font-medium text-white"
        >
          {user ? "Buka dashboard" : "Mulai tryout"}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  );
}
