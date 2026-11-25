"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { siteOrigin } from "@/lib/site-url";
import {
  loginSchema,
  redeemSchema,
  registerSchema,
  translateAuthError,
  translateRedeemError,
  type FormState,
} from "@/lib/validation";

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      // Tanpa ini Supabase memakai Site URL project (default localhost:3000)
      // dan tautan konfirmasi menunjuk ke mesin pengembang.
      emailRedirectTo: `${await siteOrigin()}/auth/confirm`,
    },
  });

  if (error) {
    // "already registered": akun mungkin ada tetapi belum dikonfirmasi.
    // Daripada buntu, kirim ulang tautan konfirmasi.
    if (error.message.toLowerCase().includes("already registered")) {
      const { error: ulang } = await supabase.auth.resend({
        type: "signup",
        email: parsed.data.email,
        options: { emailRedirectTo: `${await siteOrigin()}/auth/confirm` },
      });
      if (!ulang) {
        return {
          error:
            "Email ini sudah terdaftar. Tautan konfirmasi baru sudah dikirim, atau masuk langsung bila akunmu sudah aktif.",
        };
      }
    }
    return { error: translateAuthError(error.message) };
  }

  if (!data.session) {
    // Confirm email aktif: tidak ada sesi sampai tautan diklik. Antar ke
    // halaman konfirmasi, bukan sekadar pesan di form.
    redirect(`/konfirmasi?email=${encodeURIComponent(parsed.data.email)}`);
  }

  redirect("/dashboard");
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) return { error: translateAuthError(error.message) };

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
}

export async function logoutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/");
}

export async function redeemAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = redeemSchema.safeParse({ code: formData.get("code") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Kode belum diisi." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.rpc("redeem_code", { p_code: parsed.data.code });

  if (error) return { error: translateRedeemError(error.message) };

  revalidatePath("/dashboard");
  revalidatePath("/materi");
  redirect("/dashboard?redeemed=1");
}
