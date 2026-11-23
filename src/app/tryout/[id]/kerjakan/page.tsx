import { notFound, redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { TryoutRunner } from "@/components/tryout-runner";
import type { AttemptPayload } from "@/lib/supabase/types";

export default async function KerjakanPage({ params }: PageProps<"/tryout/[id]/kerjakan">) {
  const { id } = await params;
  const { supabase, subscriptionEndsAt } = await requireSession();

  if (!subscriptionEndsAt) redirect("/dashboard?perlu-kode=1");

  // Attempt aktif terakhir untuk tryout ini; start_attempt() yang membuatnya.
  const { data: attempt, error } = await supabase
    .from("attempts")
    .select("id")
    .eq("tryout_id", id)
    .is("submitted_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <p role="alert" className="rounded-sm border border-line-strong bg-surface p-4 text-sm">
          Tryout gagal dimuat. Muat ulang halaman.
        </p>
      </main>
    );
  }

  if (!attempt) notFound();

  const { data: payload, error: payloadError } = await supabase.rpc("get_attempt", {
    p_attempt: attempt.id,
  });

  if (payloadError) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <p role="alert" className="rounded-sm border border-line-strong bg-surface p-4 text-sm">
          Soal gagal dimuat. Muat ulang halaman.
        </p>
      </main>
    );
  }

  const data = payload as unknown as AttemptPayload;
  if (data.status === "submitted") {
    redirect(`/tryout/${id}/hasil/${data.id}`);
  }

  return <TryoutRunner attempt={data} />;
}
