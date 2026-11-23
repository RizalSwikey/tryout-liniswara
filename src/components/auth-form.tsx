"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import type { FormState } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Field = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  help?: string;
};

export function AuthForm({
  action,
  fields,
  submitLabel,
  pendingLabel,
  hidden,
  footer,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  fields: Field[];
  submitLabel: string;
  pendingLabel: string;
  hidden?: Record<string, string>;
  footer?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {hidden &&
        Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}

      {state.error && (
        <p
          role="alert"
          className="flex gap-2 rounded-sm border border-[color-mix(in_srgb,var(--warn),white_60%)] bg-[color-mix(in_srgb,var(--warn),white_92%)] px-3 py-2 text-sm text-warn"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      )}

      {fields.map((field) => {
        const err = state.fieldErrors?.[field.name];
        const id = `field-${field.name}`;
        return (
          <div key={field.name} className="space-y-1.5">
            <Label htmlFor={id} className="text-ink">
              {field.label}
            </Label>
            <Input
              id={id}
              name={field.name}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              aria-invalid={Boolean(err)}
              aria-describedby={err ? `${id}-error` : field.help ? `${id}-help` : undefined}
              className="h-11 rounded-sm border-line-strong bg-surface px-3 text-base"
            />
            {err ? (
              <p id={`${id}-error`} className="text-sm text-[#b3261e]">
                {err}
              </p>
            ) : field.help ? (
              <p id={`${id}-help`} className="text-sm text-muted-ink">
                {field.help}
              </p>
            ) : null}
          </div>
        );
      })}

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-sm bg-primary text-base font-medium text-white hover:bg-primary-dark"
      >
        {pending ? pendingLabel : submitLabel}
      </Button>

      {footer}
    </form>
  );
}
