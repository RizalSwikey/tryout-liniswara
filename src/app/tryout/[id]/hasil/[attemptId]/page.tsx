import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { CountUp } from "@/components/count-up";
import { requireSession } from "@/lib/auth";
import type { AttemptPayload } from "@/lib/supabase/types";
import { formatDurasi } from "@/lib/format";

export const metadata: Metadata = { title: "Hasil tryout" };

export default async function HasilPage({ params }: PageProps<"/tryout/[id]/hasil/[attemptId]">) {
  const { id, attemptId } = await params;
  const { supabase, profile, subscriptionEndsAt } = await requireSession();

  const { data: payload, error } = await supabase.rpc("get_attempt", { p_attempt: attemptId });

  if (error) {
    if (error.message.includes("ATTEMPT_NOT_FOUND")) notFound();
    return (
      <>
        <SiteHeader nama={profile?.full_name ?? null} aktif={Boolean(subscriptionEndsAt)} />
        <main className="mx-auto w-full max-w-3xl px-4 py-10">
          <p role="alert" className="rounded-sm border border-line-strong bg-surface p-4 text-sm">
            Hasil gagal dimuat. Muat ulang halaman.
          </p>
        </main>
      </>
    );
  }

  const data = payload as unknown as AttemptPayload;
  if (data.status !== "submitted") redirect(`/tryout/${id}/kerjakan`);

  const statements = data.questions.flatMap((q) => q.statements);
  const total = statements.length;
  const score = data.score ?? 0;
  const correct = statements.filter((s) => s.answer !== null && s.answer === s.is_true).length;
  const answered = statements.filter((s) => s.answer !== null).length;
  const fullQuestions = data.questions.filter(
    (q) => q.statements.length > 0 && q.statements.every((s) => s.answer !== null && s.answer === s.is_true),
  ).length;
  const persen = total > 0 ? Math.round((score / total) * 100) : 0;

  const durasiDetik =
    data.submitted_at && data.started_at
      ? Math.max(0, Math.floor((new Date(data.submitted_at).getTime() - new Date(data.started_at).getTime()) / 1000))
      : 0;
  const lewatDeadline = data.submitted_at === data.deadline_at;

  return (
    <>
      <SiteHeader nama={profile?.full_name ?? null} aktif={Boolean(subscriptionEndsAt)} />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-ink hover:text-ink">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Dashboard
        </Link>

        <h1 className="mt-4 text-[26px] font-semibold text-ink">Hasil tryout</h1>
        <p className="mt-0.5 text-muted-ink">{data.tryout.title}</p>

        {lewatDeadline && (
          <p role="status" className="mt-4 rounded-sm border border-line-strong bg-surface px-3 py-2 text-sm">
            Waktu habis. Jawaban yang tersimpan sebelum waktu habis ikut dinilai.
          </p>
        )}

        <section aria-labelledby="ringkasan" className="mt-5 rounded-lg border border-line bg-surface p-5">
          <h2 id="ringkasan" className="sr-only">
            Ringkasan nilai
          </h2>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <p className="font-heading text-5xl font-bold tnum text-ink">
              <CountUp value={score} />
              <span className="text-2xl font-normal text-muted-ink"> / {total}</span>
            </p>
            <p className="text-lg font-medium tnum text-muted-ink">{persen}%</p>
            <p className="text-sm text-muted-ink">
              {correct} benar, {answered - correct} salah, {total - answered} tidak dijawab
            </p>
          </div>
          <dl className="mt-4 grid gap-x-6 gap-y-2 border-t border-line pt-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-ink">Soal dengan 3/3 benar</dt>
              <dd className="font-medium tnum text-ink">
                {fullQuestions} dari {data.questions.length}
              </dd>
            </div>
            <div>
              <dt className="text-muted-ink">Waktu pengerjaan</dt>
              <dd className="font-medium tnum text-ink">{formatDurasi(durasiDetik)}</dd>
            </div>
            <div>
              <dt className="text-muted-ink">Pernyataan dijawab</dt>
              <dd className="font-medium tnum text-ink">
                {answered} dari {total}
              </dd>
            </div>
          </dl>
        </section>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/tryout/${id}`}
            className="inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Ulangi tryout
          </Link>
          <Link
            href="/riwayat"
            className="inline-flex h-11 items-center rounded-sm border border-line-strong px-4 text-sm font-medium text-ink hover:bg-paper"
          >
            Riwayat hasil
          </Link>
        </div>

        <h2 className="mt-8 font-heading text-xl font-semibold text-ink">Pembahasan per pernyataan</h2>
        <div className="mt-3 space-y-4">
          {data.questions.map((q, qi) => {
            const benar = q.statements.filter((s) => s.answer !== null && s.answer === s.is_true).length;
            return (
              <section
                key={q.id}
                className="enter-rise rounded-lg border border-line bg-surface"
                style={{ animationDelay: `${Math.min(qi, 8) * 45}ms` }}
              >
                <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-3">
                  <h3 className="font-heading text-lg font-semibold text-ink">Soal {q.position}</h3>
                  <p className="text-sm tnum text-muted-ink">
                    {benar}/{q.statements.length} benar
                  </p>
                </header>
                <div className="stimulus prose-block border-b border-line px-4 py-3 text-sm">
                  {q.stimulus.split("\n\n").map((par, i) => (
                    <p key={i}>{par}</p>
                  ))}
                </div>
                <ol className="divide-y divide-line">
                  {q.statements.map((s, si) => {
                    const userAnswer = s.answer;
                    const isCorrect = userAnswer !== null && userAnswer === s.is_true;
                    return (
                      <li key={s.id} className="px-4 py-3">
                        <p className="flex gap-2 text-ink">
                          <span className="font-heading font-semibold text-muted-ink">
                            {String.fromCharCode(65 + si)}.
                          </span>
                          <span>{s.text}</span>
                        </p>
                        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                          <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                            Kunci: {s.is_true ? "Benar" : "Salah"}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 font-medium ${
                              userAnswer === null ? "text-muted-ink" : isCorrect ? "text-ok" : "text-[#b3261e]"
                            }`}
                          >
                            {userAnswer === null ? (
                              "Tidak dijawab"
                            ) : (
                              <>
                                {isCorrect ? (
                                  <Check aria-hidden="true" className="size-4" />
                                ) : (
                                  <X aria-hidden="true" className="size-4" />
                                )}
                                Jawabanmu: {userAnswer ? "Benar" : "Salah"}
                              </>
                            )}
                          </span>
                        </p>
                        <p className="mt-1.5 text-sm text-muted-ink">{s.explanation}</p>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}
