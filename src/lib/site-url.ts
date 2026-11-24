import { headers } from "next/headers";

/**
 * Origin publik dari permintaan yang sedang diproses. Dipakai untuk menyusun
 * tautan konfirmasi email, supaya tautan menunjuk ke host yang benar-benar
 * dibuka pengguna (localhost saat lokal, domain Vercel saat produksi) tanpa
 * env var yang bisa lupa diperbarui.
 *
 * `NEXT_PUBLIC_SITE_URL` menang bila diisi, untuk kasus di balik proxy yang
 * menulis header `x-forwarded-*` secara tidak konsisten.
 */
export async function siteOrigin(): Promise<string> {
  const dariEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (dariEnv) return dariEnv;

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return "http://localhost:3000";

  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("[::1]")
      ? "http"
      : "https");

  return `${proto}://${host}`;
}
