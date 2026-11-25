import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Tujuan tautan konfirmasi email Supabase.
 *
 * Dua bentuk tautan didukung:
 * - `?code=...` (PKCE, bawaan @supabase/ssr) — ditukar dengan sesi memakai
 *   verifier yang tersimpan sebagai cookie di browser pendaftar.
 * - `?token_hash=...&type=signup` — dipakai bila template email Supabase
 *   diubah memakai {{ .TokenHash }}; ini satu-satunya bentuk yang berhasil
 *   saat tautan dibuka di perangkat/browser berbeda.
 *
 * Tanpa handler ini tautan konfirmasi berakhir di halaman yang tidak ada dan
 * sesi tidak pernah terbentuk.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const email = searchParams.get("email") ?? "";

  // Supabase mengirim error lewat query bila tautan kedaluwarsa/sudah dipakai.
  const errorDescription = searchParams.get("error_description");
  if (errorDescription) return keKonfirmasi(request, "gagal", errorDescription, email);

  const supabase = await createServerSupabase();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return keKonfirmasi(request, "gagal", error.message, email);
    return keKonfirmasi(request, "berhasil", "", email);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) return keKonfirmasi(request, "gagal", error.message, email);
    return keKonfirmasi(request, "berhasil", "", email);
  }

  return keKonfirmasi(request, "gagal", "Tautan konfirmasi tidak lengkap.", email);
}

/** Hasil ditampilkan sebagai halaman, bukan sekadar notifikasi di form daftar. */
function keKonfirmasi(request: NextRequest, status: "berhasil" | "gagal", pesan: string, email: string) {
  const url = new URL("/konfirmasi", request.nextUrl.origin);
  url.searchParams.set("status", status);
  if (pesan) url.searchParams.set("pesan", pesan);
  if (email) url.searchParams.set("email", email);
  return NextResponse.redirect(url);
}
