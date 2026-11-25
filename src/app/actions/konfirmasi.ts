"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { emailSchema } from "@/lib/validation";
import { siteOrigin } from "@/lib/site-url";

/**
 * Kirim ulang email konfirmasi. Dipanggil dari halaman /konfirmasi supaya
 * pengguna tidak buntu ketika email pertama tidak datang atau tautannya
 * kedaluwarsa.
 *
 * `resend` mengirim ke alamat yang ada di akun; alamat diambil dari form
 * hanya untuk validasi bentuk, bukan untuk memilih penerima.
 */
export async function resendConfirmationAction(email: string): Promise<{ ok: boolean; message: string }> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { ok: false, message: "Alamat email belum benar." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data,
    options: { emailRedirectTo: `${await siteOrigin()}/auth/confirm` },
  });

  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes("rate limit") || m.includes("too many") || m.includes("429")) {
      return { ok: false, message: "Batas kirim email tercapai. Coba lagi beberapa menit lagi." };
    }
    if (m.includes("already confirmed") || m.includes("already registered")) {
      return { ok: false, message: "Email ini sudah dikonfirmasi. Coba masuk." };
    }
    return { ok: false, message: "Email gagal dikirim. Coba lagi sebentar lagi." };
  }

  return { ok: true, message: "Email konfirmasi dikirim ulang. Periksa kotak masuk." };
}
