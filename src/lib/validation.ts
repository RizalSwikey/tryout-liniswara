import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email belum diisi.")
  .email("Format email belum benar. Contoh: nama@email.com.");

export const passwordSchema = z
  .string()
  .min(8, "Kata sandi minimal 8 karakter.");

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Nama minimal 2 karakter.").max(80, "Nama maksimal 80 karakter."),
    email: emailSchema,
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Konfirmasi kata sandi belum sama.",
    path: ["confirm"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Kata sandi belum diisi."),
});

export const redeemSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Kode belum diisi.")
    .transform((v) => v.replace(/\s+/g, "").toUpperCase()),
});

export type FormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
};

/** Terjemahan error Supabase Auth ke kalimat yang bisa ditindaklanjuti. */
export function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email atau kata sandi tidak cocok. Periksa lagi.";
  if (m.includes("email not confirmed")) return "Email belum dikonfirmasi. Buka tautan di kotak masukmu.";
  if (m.includes("user already registered")) return "Email ini sudah terdaftar. Masuk lewat halaman masuk.";
  if (m.includes("password should be at least")) return "Kata sandi terlalu pendek. Minimal 8 karakter.";
  if (m.includes("rate limit") || m.includes("too many")) return "Terlalu banyak percobaan. Tunggu beberapa menit.";
  if (m.includes("unable to validate email")) return "Email ditolak server. Coba alamat lain.";
  return "Pendaftaran gagal diproses. Coba lagi sebentar lagi.";
}

/** Terjemahan error redeem_code() ke bahasa manusia. */
export function translateRedeemError(message: string): string {
  if (message.includes("CODE_NOT_FOUND")) return "Kode tidak dikenali. Periksa 12 karakter, tanpa spasi.";
  if (message.includes("CODE_INACTIVE")) return "Kode ini sudah dinonaktifkan. Hubungi penerbit untuk kode baru.";
  if (message.includes("CODE_EXPIRED")) return "Kode sudah kedaluwarsa. Minta kode baru ke penerbit.";
  if (message.includes("CODE_EXHAUSTED")) return "Kode sudah mencapai batas pemakaian.";
  if (message.includes("CODE_ALREADY_USED")) return "Kode ini sudah kamu pakai. Satu kode hanya bisa dipakai sekali per akun.";
  if (message.includes("AUTH_REQUIRED")) return "Sesi berakhir. Masuk lagi untuk memakai kode.";
  return "Kode gagal diproses. Coba lagi sebentar lagi.";
}
