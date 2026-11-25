"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { resendConfirmationAction } from "@/app/actions/konfirmasi";

/**
 * Tombol "Kirim ulang". Server Action mengembalikan pesan apa adanya; tidak
 * ada status yang ditebak di klien. Tombol nonaktif selama proses supaya
 * klik berulang tidak memboroskan kuota email Supabase.
 */
export function ResendForm({ email }: { email: string }) {
  const [pending, start] = useTransition();
  const [hasil, setHasil] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <div className="mt-6 border-t border-line pt-5">
      <p className="text-sm text-muted-ink">
        Tidak menemukan emailnya? Periksa folder spam, atau kirim ulang.
      </p>

      {hasil && (
        <p
          role="status"
          className="mt-3 flex gap-2 rounded-sm border border-line-strong bg-surface px-3 py-2 text-sm text-ink"
        >
          {hasil.ok ? (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ok" />
          ) : (
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#b3261e]" />
          )}
          {hasil.message}
        </p>
      )}

      <button
        type="button"
        disabled={pending || !email}
        onClick={() => start(async () => setHasil(await resendConfirmationAction(email)))}
        className="press mt-3 inline-flex h-11 items-center gap-2 rounded-sm border border-line-strong px-4 text-sm font-medium text-ink hover:bg-paper disabled:opacity-50"
      >
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Mengirim…
          </>
        ) : (
          "Kirim ulang email konfirmasi"
        )}
      </button>
    </div>
  );
}
