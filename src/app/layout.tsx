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
    <html lang="id" className={`${literata.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
