import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const getSession = cache(async () => {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, profile: null, subscriptionEndsAt: null };

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("id, full_name").eq("id", user.id).maybeSingle(),
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
    user,
    profile: profile ?? null,
    subscriptionEndsAt: subscription?.ends_at ?? null,
  };
});

export async function requireSession() {
  const session = await getSession();
  if (!session.user) redirect("/masuk");
  return { ...session, user: session.user };
}
