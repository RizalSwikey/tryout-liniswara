"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

export type AnswerState = { ok: true } | { ok: false; error: string };

export async function startAttemptAction(formData: FormData) {
  const tryoutId = String(formData.get("tryoutId") ?? "");
  const supabase = await createServerSupabase();
  const { error } = await supabase.rpc("start_attempt", { p_tryout: tryoutId });

  if (error) {
    if (error.message.includes("SUBSCRIPTION_REQUIRED")) {
      redirect("/dashboard?perlu-kode=1");
    }
    redirect(`/tryout/${tryoutId}?gagal=1`);
  }

  redirect(`/tryout/${tryoutId}/kerjakan`);
}

export async function saveAnswerAction(
  attemptId: string,
  statementId: string,
  answer: boolean,
): Promise<AnswerState> {
  const supabase = await createServerSupabase();
  const { error } = await supabase.rpc("save_answer", {
    p_attempt: attemptId,
    p_statement: statementId,
    p_answer: answer,
  });

  if (error) {
    if (error.message.includes("DEADLINE_PASSED")) return { ok: false, error: "Waktu habis. Jawaban tidak tersimpan." };
    if (error.message.includes("ATTEMPT_SUBMITTED")) return { ok: false, error: "Tryout sudah dikirim." };
    return { ok: false, error: "Jawaban gagal tersimpan. Periksa koneksi lalu klik lagi." };
  }

  return { ok: true };
}

export async function submitAttemptAction(attemptId: string, tryoutId: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.rpc("submit_attempt", { p_attempt: attemptId });

  // ATTEMPT_SUBMITTED: sudah dikirim di tab lain.
  // DEADLINE_PASSED: submit_attempt() menutup attempt lewat finalize_attempt(); hasilnya tetap bisa dibuka.
  if (error && !error.message.includes("ATTEMPT_SUBMITTED") && !error.message.includes("DEADLINE_PASSED")) {
    redirect(`/tryout/${tryoutId}/kerjakan?gagal-kirim=1`);
  }

  revalidatePath("/riwayat");
  redirect(`/tryout/${tryoutId}/hasil/${attemptId}`);
}
