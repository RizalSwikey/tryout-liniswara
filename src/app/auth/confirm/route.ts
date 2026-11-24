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
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Supabase mengirim error lewat query bila tautan kedaluwarsa/sudah dipakai.
  const errorDescription = searchParams.get("error_description");
  if (errorDescription) return keMasuk(request, errorDescription);

  const supabase = await createServerSupabase();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return keMasuk(request, error.message);
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) return keMasuk(request, error.message);
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  return keMasuk(request, "Tautan konfirmasi tidak lengkap. Minta tautan baru.");
}

function keMasuk(request: NextRequest, pesan: string) {
  const url = new URL("/masuk", request.nextUrl.origin);
  url.searchParams.set("konfirmasi", pesan);
  return NextResponse.redirect(url);
}
