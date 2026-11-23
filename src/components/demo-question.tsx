"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";

const STATEMENTS = [
  {
    text: "Penulis menilai kebiasaan membaca perlu dirawat sejak sekolah, bukan hanya menjelang ujian.",
    isTrue: true,
    explanation:
      "Teks menyebut membaca sebagai kebiasaan harian yang dibentuk sejak sekolah, sementara ujian hanya salah satu titik ujinya.",
  },
  {
    text: "Menurut teks, membaca cepat selalu lebih baik daripada membaca dengan pemahaman.",
    isTrue: false,
    explanation:
      "Teks justru menempatkan pemahaman di atas kecepatan; kecepatan tanpa pemahaman tidak membantu menjawab soal.",
  },
  {
    text: "Teks menyatakan bahwa jumlah buku yang dibaca tidak dengan sendirinya menjamin kualitas pemahaman.",
    isTrue: true,
    explanation:
      "Teks memisahkan jumlah bacaan dari mutu pemahaman dan menegaskan bahwa keduanya berbeda.",
  },
];

export function DemoQuestion() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const allAnswered = STATEMENTS.every((_, i) => answers[i] !== undefined);
  const answered = Object.keys(answers).length;

  return (
    <div className="rounded-lg border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <p className="text-sm font-medium text-ink">
          Contoh soal <span className="font-normal text-muted-ink">— PGK Kategori</span>
        </p>
        <p className="text-sm tnum text-muted-ink">
          {answered}/{STATEMENTS.length} dijawab
        </p>
      </div>

      <div className="px-4 py-4">
        <p className="stimulus prose-block text-[15px]">
          Membaca sering diukur dari jumlah buku yang selesai. Padahal, yang menentukan hasil belajar
          adalah seberapa jauh pembaca menimbang alasan penulis, bukan seberapa cepat halaman berpindah.
          Kebiasaan ini tumbuh dari sekolah: satu paragraf dibahas sampai tuntas lebih berguna daripada
          sepuluh judul yang hanya disentuh.
        </p>
      </div>

      <ol className="space-y-1 border-t border-line px-4 py-3">
        {STATEMENTS.map((s, i) => {
          const value = answers[i];
          const showKey = value !== undefined;
          const correct = value === s.isTrue;
          return (
            <li key={i} className="rounded-sm py-2">
              <p className="flex gap-2 text-sm text-ink">
                <span className="font-medium text-muted-ink">{String.fromCharCode(65 + i)}.</span>
                <span>{s.text}</span>
              </p>
              <div
                className="mt-2 grid grid-cols-2 gap-2"
                role="radiogroup"
                aria-label={`Pernyataan ${String.fromCharCode(65 + i)}`}
              >
                {[true, false].map((val) => {
                  const id = `demo-${i}-${val ? "benar" : "salah"}`;
                  const selected = value === val;
                  return (
                    <div key={id}>
                      <input
                        type="radio"
                        id={id}
                        name={`demo-${i}`}
                        checked={selected}
                        onChange={() => setAnswers((p) => ({ ...p, [i]: val }))}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={id}
                        className={`flex h-11 cursor-pointer items-center justify-center gap-1 rounded-sm border text-sm font-medium select-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-line-strong text-ink hover:bg-paper"
                        }`}
                      >
                        {selected && <Check aria-hidden="true" className="size-3.5" />}
                        {val ? "Benar" : "Salah"}
                      </label>
                    </div>
                  );
                })}
              </div>
              {showKey && (
                <p
                  className={`mt-2 text-sm ${correct ? "text-ok" : "text-[#b3261e]"}`}
                  role="status"
                >
                  {correct ? "Tepat. " : "Belum tepat. "}
                  <span className="text-muted-ink">{s.explanation}</span>
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3">
        <p className="text-sm text-muted-ink">
          {allAnswered
            ? "Pembahasan terbuka. Di tryout asli, kunci baru muncul setelah seluruh jawaban dikirim."
            : "Coba jawab ketiga pernyataan; pembahasan langsung muncul di sini."}
        </p>
        <button
          type="button"
          onClick={() => setAnswers({})}
          className="inline-flex h-11 items-center gap-1.5 rounded-sm border border-line-strong px-3 text-sm font-medium text-ink hover:bg-paper"
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          Ulangi contoh
        </button>
      </div>
    </div>
  );
}
