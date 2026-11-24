import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Identitas diverifikasi lokal dari tanda tangan JWT (JWKS di-cache Supabase),
 * bukan lewat permintaan ke server Auth seperti getUser(). Profil dan
 * langganan diambil paralel, lalu di-cache per request lewat React cache.
 */
export const getSession = cache(async () => {
  const supabase = await createServerSupabase();

  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const userId = claims?.sub ?? null;
  const email = (claims?.email as string | undefined) ?? null;

  if (!userId) {
    return { supabase, user: null, profile: null, subscriptionEndsAt: null };
  }

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("id, full_name").eq("id", userId).maybeSingle(),
    supabase
      .from("subscriptions")
      .select("ends_at")
      .gt("ends_at", new Date().toISOString())
      .order("ends_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    supabase,
    user: { id: userId, email },
    profile: profile ?? null,
    subscriptionEndsAt: subscription?.ends_at ?? null,
  };
});

export async function requireSession() {
  const session = await getSession();
  if (!session.user) redirect("/masuk");
  return { ...session, user: session.user };
}
