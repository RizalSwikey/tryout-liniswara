"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60dvh] w-full max-w-md flex-col items-start justify-center gap-3 px-4">
      <h1 className="text-[22px] font-semibold text-ink">Halaman gagal dimuat</h1>
      <p role="alert" className="text-sm text-muted-ink">
        Ada gangguan saat mengambil data. Coba muat ulang; jawaban yang sudah tersimpan tidak hilang.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-11 items-center rounded-sm bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark"
      >
        Coba lagi
      </button>
    </main>
  );
}
