"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleHelp,
  Clock3,
  Flag,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import type { AttemptPayload } from "@/lib/supabase/types";
import { saveAnswerAction, submitAttemptAction } from "@/app/actions/tryout";
import { formatDurasi } from "@/lib/format";

type AnswerMap = Record<string, boolean>;

export function TryoutRunner({ attempt }: { attempt: AttemptPayload }) {
  const questions = attempt.questions;
  const [answers, setAnswers] = useState<AnswerMap>(() => {
    const initial: AnswerMap = {};
    for (const q of questions) {
      for (const s of q.statements) {
        if (s.answer !== null && s.answer !== undefined) initial[s.id] = s.answer;
      }
    }
    return initial;
  });
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [index, setIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(0);
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.floor((new Date(attempt.deadline_at).getTime() - Date.now()) / 1000)),
  );
  const [submitting, startSubmit] = useTransition();
  const submittedRef = useRef(false);

  const current = questions[index];

  // Timer dihitung dari deadline server, bukan akumulasi interval.
  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, Math.floor((new Date(attempt.deadline_at).getTime() - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0 && !submittedRef.current) {
        submittedRef.current = true;
        startSubmit(() => {
          void submitAttemptAction(attempt.id, attempt.tryout.id);
        });
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [attempt.deadline_at, attempt.id, attempt.tryout.id]);

  const answeredCount = useMemo(
    () => questions.filter((q) => q.statements.every((s) => answers[s.id] !== undefined)).length,
    [questions, answers],
  );

  const setAnswer = useCallback(
    (statementId: string, value: boolean) => {
      setAnswers((prev) => ({ ...prev, [statementId]: value }));
      setSaving((n) => n + 1);
      void saveAnswerAction(attempt.id, statementId, value).then((res) => {
        setSaving((n) => n - 1);
        if (!res.ok) setSaveError(res.error);
      });
    },
    [attempt.id],
  );

  const goTo = (next: number) => {
    setIndex(Math.max(0, Math.min(questions.length - 1, next)));
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const unanswered = questions.length - answeredCount;

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-2 px-4">
          <p className="text-sm font-medium text-ink">
            Soal <span className="tnum">{index + 1}</span>/{questions.length}
          </p>

          <div className="flex items-center gap-3">
            <p
              className={`flex items-center gap-1.5 text-sm font-semibold tnum ${
                remaining <= 300 ? "text-warn" : "text-ink"
              }`}
              aria-live="off"
            >
              <Clock3 aria-hidden="true" className="size-4" />
              <span aria-label={`Sisa waktu ${formatDurasi(remaining)}`}>{formatDurasi(remaining)}</span>
            </p>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="nomor-soal"
              className="inline-flex h-11 items-center gap-1.5 rounded-sm border border-line-strong px-3 text-sm font-medium text-ink hover:bg-paper"
            >
              <Menu aria-hidden="true" className="size-4" />
              Nomor
            </button>
          </div>
        </div>
        <div className="h-1 w-full bg-line" role="presentation">
          <div
            className="h-1 bg-primary transition-[width] duration-300"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pt-5 pb-28">
        {saveError && (
          <p role="alert" className="mb-4 rounded-sm border border-[#e8c4c1] bg-[#fdf2f1] px-3 py-2 text-sm text-[#b3261e]">
            {saveError}
          </p>
        )}
        {remaining <= 300 && remaining > 0 && (
          <p role="status" className="mb-4 rounded-sm border border-[#e9d3b3] bg-[#fdf6ec] px-3 py-2 text-sm text-warn">
            Sisa waktu kurang dari 5 menit. Jawaban tersimpan otomatis tiap klik.
          </p>
        )}

        <article key={current.id} className="animate-in fade-in-0 duration-200">
          <div className="rounded-lg border border-line bg-surface p-4 sm:p-5">
            <h1 className="sr-only">Soal {current.position}</h1>
            <div className="stimulus prose-block">
              {current.stimulus.split("\n\n").map((par, i) => (
                <p key={i}>{par}</p>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm text-muted-ink">
            Tentukan Benar atau Salah untuk setiap pernyataan.
          </p>

          <ol className="mt-2 space-y-3">
            {current.statements.map((s, si) => (
              <li key={s.id}>
                <StatementCard
                  letter={String.fromCharCode(65 + si)}
                  text={s.text}
                  name={`${current.id}-${s.id}`}
                  value={answers[s.id]}
                  onChange={(v) => setAnswer(s.id, v)}
                />
              </li>
            ))}
          </ol>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFlagged((p) => ({ ...p, [current.id]: !p[current.id] }))}
              aria-pressed={Boolean(flagged[current.id])}
              className={`inline-flex h-11 items-center gap-1.5 rounded-sm border px-3 text-sm font-medium ${
                flagged[current.id]
                  ? "border-warn bg-[#fdf6ec] text-warn"
                  : "border-line-strong text-ink hover:bg-paper"
              }`}
            >
              <Flag aria-hidden="true" className="size-4" />
              {flagged[current.id] ? "Ditandai ragu" : "Tandai ragu"}
            </button>
            <span className="ml-auto text-sm text-muted-ink">
              {saving > 0 ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
                  Menyimpan…
                </span>
              ) : (
                "Tersimpan"
              )}
            </span>
          </div>
        </article>

        <div className="mt-6 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="inline-flex h-11 items-center gap-1 rounded-sm border border-line-strong px-3 text-sm font-medium text-ink hover:bg-paper disabled:opacity-40"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
            Sebelumnya
          </button>

          {index < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="inline-flex h-11 items-center gap-1 rounded-sm bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Berikutnya
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Kirim jawaban
            </button>
          )}
        </div>
      </main>

      {!menuOpen && !confirmOpen && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface px-4 py-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <p className="text-sm text-muted-ink">
              Terjawab <span className="tnum font-medium text-ink">{answeredCount}</span> dari {questions.length} soal
            </p>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex h-11 items-center rounded-sm bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Kirim jawaban
            </button>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-labelledby="nomor-soal">
          <button
            type="button"
            aria-label="Tutup daftar nomor"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-xl border border-line bg-surface p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-96 sm:rounded-lg">
            <div className="flex items-center justify-between">
              <h2 id="nomor-soal" className="font-heading text-lg font-semibold text-ink">
                Nomor soal
              </h2>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex size-11 items-center justify-center rounded-sm text-muted-ink hover:bg-paper"
                aria-label="Tutup"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <ul className="mt-3 grid grid-cols-5 gap-2">
              {questions.map((q, i) => {
                const done = q.statements.every((s) => answers[s.id] !== undefined);
                const ragu = Boolean(flagged[q.id]);
                const active = i === index;
                return (
                  <li key={q.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={active ? "true" : undefined}
                      aria-label={`Soal ${q.position}: ${done ? "terjawab" : "belum dijawab"}${ragu ? ", ditandai ragu" : ""}`}
                      className={`flex h-11 w-full items-center justify-center gap-1 rounded-sm border text-sm font-medium tnum ${
                        done
                          ? "border-primary bg-primary text-white"
                          : "border-line-strong bg-surface text-ink"
                      } ${ragu && !done ? "border-warn bg-[#fdf6ec] text-warn" : ""} ${
                        active ? "ring-2 ring-primary ring-offset-2" : ""
                      }`}
                    >
                      {done ? (
                        <Check aria-hidden="true" className="size-3.5" />
                      ) : ragu ? (
                        <CircleHelp aria-hidden="true" className="size-3.5" />
                      ) : (
                        <Circle aria-hidden="true" className="size-3" />
                      )}
                      {q.position}
                    </button>
                  </li>
                );
              })}
            </ul>

            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-ink">
              <li className="inline-flex items-center gap-1">
                <Circle aria-hidden="true" className="size-3" /> Kosong
              </li>
              <li className="inline-flex items-center gap-1">
                <Check aria-hidden="true" className="size-3 text-primary" /> Terjawab
              </li>
              <li className="inline-flex items-center gap-1">
                <CircleHelp aria-hidden="true" className="size-3 text-warn" /> Ragu
              </li>
              <li className="inline-flex items-center gap-1">
                <span className="inline-block size-3 rounded-[2px] ring-2 ring-primary" /> Aktif
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="mt-4 h-11 w-full rounded-sm bg-primary text-sm font-medium text-white hover:bg-primary-dark"
            >
              Kirim jawaban
            </button>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="konfirmasi-kirim">
          <button
            type="button"
            aria-label="Tutup konfirmasi"
            onClick={() => setConfirmOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="relative w-full max-w-md rounded-t-xl border border-line bg-surface p-5 sm:rounded-lg">
            <h2 id="konfirmasi-kirim" className="font-heading text-xl font-semibold text-ink">
              Kirim jawaban sekarang?
            </h2>
            <p className="mt-2 text-sm text-muted-ink">
              {unanswered > 0
                ? `${unanswered} soal belum dijawab sama sekali. Soal itu dihitung salah.`
                : "Semua soal sudah dijawab. Jawaban tidak bisa diubah setelah dikirim."}
            </p>
            <p className="mt-1 text-sm text-muted-ink">
              Terjawab {answeredCount} dari {questions.length} soal.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="h-11 rounded-sm border border-line-strong px-4 text-sm font-medium text-ink hover:bg-paper"
              >
                Kembali mengerjakan
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  submittedRef.current = true;
                  startSubmit(() => {
                    void submitAttemptAction(attempt.id, attempt.tryout.id);
                  });
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
              >
                {submitting ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
                Kirim jawaban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatementCard({
  letter,
  text,
  name,
  value,
  onChange,
}: {
  letter: string;
  text: string;
  name: string;
  value: boolean | undefined;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="flex gap-2 text-ink">
        <span className="font-heading font-semibold text-muted-ink">{letter}.</span>
        <span>{text}</span>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label={`Pernyataan ${letter}`}>
        {[true, false].map((val) => {
          const selected = value === val;
          const id = `${name}-${val ? "benar" : "salah"}`;
          return (
            <div key={id}>
              <input
                type="radio"
                id={id}
                name={name}
                checked={selected}
                onChange={() => onChange(val)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={`flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-sm border text-sm font-medium select-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${
                  selected
                    ? val
                      ? "border-ok bg-[color-mix(in_srgb,var(--ok),white_90%)] text-ok"
                      : "border-[#b3261e] bg-[#fdf2f1] text-[#b3261e]"
                    : "border-line-strong bg-surface text-ink hover:bg-paper"
                }`}
              >
                {selected && <Check aria-hidden="true" className="size-4" />}
                {val ? "Benar" : "Salah"}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

