import type { Metadata } from "next";
import { Literata, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const literata = Literata({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tryout Liniswara — latihan PGK Kategori Benar/Salah",
    template: "%s — Tryout Liniswara",
  },
  description:
    "Tryout literasi format PGK Kategori: 10 soal, 30 pernyataan Benar/Salah, pembahasan tiap pernyataan setelah kirim. Akses dengan kode dari penerbit Liniswara.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      // Kelas `js` ditambahkan skrip di bawah sebelum paint, jadi atribut ini
      // memang berbeda dari HTML server. Itu disengaja.
      suppressHydrationWarning
      className={`${literata.variable} ${jakarta.variable}`}
    >
      <head>
        {/* Menandai JS aktif sebelum paint; animasi reveal hanya berlaku bila
            kelas ini ada, jadi konten tetap tampil tanpa JavaScript. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
