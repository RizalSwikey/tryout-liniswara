"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { redeemAction } from "@/app/actions/auth";
import type { FormState } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function RedeemForm({ compact = false }: { compact?: boolean }) {
  const [state, formAction, pending] = useActionState(redeemAction, {} as FormState);

  return (
    <form action={formAction} className="space-y-3" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="code" className="flex items-center gap-1.5 text-ink">
          <KeyRound aria-hidden="true" className="size-4 text-muted-ink" />
          Kode akses
        </Label>
        <Input
          id="code"
          name="code"
          autoComplete="one-time-code"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="Contoh: LINIS2026OK1"
          maxLength={24}
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "code-error" : "code-help"}
          className="h-11 rounded-sm border-line-strong bg-surface px-3 font-mono text-base tracking-[0.08em] uppercase"
        />
        <p id="code-help" className="text-sm text-muted-ink">
          12 karakter, huruf dan angka. Tanpa spasi.
        </p>
        {state.error && (
          <p id="code-error" role="alert" className="flex gap-1.5 text-sm text-[#b3261e]">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-sm bg-primary text-base font-medium text-white hover:bg-primary-dark sm:w-auto sm:px-6"
      >
        {pending ? "Memeriksa kode…" : "Aktifkan kode"}
      </Button>

      {compact && (
        <p className="flex items-start gap-1.5 text-sm text-muted-ink">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ok" />
          Masa aktif ditambahkan ke sisa langganan yang masih berjalan.
        </p>
      )}
    </form>
  );
}
