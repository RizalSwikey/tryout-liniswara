"use client";

import { useId, useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { resendConfirmationAction } from "@/app/actions/konfirmasi";

/**
 * Tombol "Kirim ulang". Server Action mengembalikan pesan apa adanya; tidak
 * ada status yang ditebak di klien. Bila alamat tidak diketahui (tautan
 * kedaluwarsa datang tanpa email), pengguna mengetiknya sendiri - kalau tidak,
 * tombolnya mati tanpa jalan keluar.
 */
export function ResendForm({ email }: { email: string }) {
  const id = useId();
  const [alamat, setAlamat] = useState(email);
  const [pending, start] = useTransition();
  const [hasil, setHasil] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <div className="mt-6 border-t border-line pt-5">
      <p className="text-sm text-muted-ink">
        Tidak menemukan emailnya? Periksa folder spam, atau kirim ulang.
      </p>

      {!email && (
        <div className="mt-3">
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
            Alamat email akun
          </label>
          <input
            id={id}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            placeholder="nama@email.com"
            className="h-11 w-full rounded-sm border border-line-strong bg-paper px-3 text-base text-ink placeholder:text-muted-ink focus:border-primary focus:outline-2 focus:outline-offset-1 focus:outline-primary"
          />
        </div>
      )}

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
        disabled={pending || !alamat}
        onClick={() => start(async () => setHasil(await resendConfirmationAction(alamat)))}
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
