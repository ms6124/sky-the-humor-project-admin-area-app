import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./server";

type AdminProfile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  is_superadmin: boolean;
};

type AdminCheck =
  | { ok: true; user: User; profile: AdminProfile }
  | { ok: false; reason: "unauthenticated" | "unauthorized" | "missing-profile" };

export async function requireAdmin(): Promise<AdminCheck> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, reason: "unauthenticated" };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, is_superadmin")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return { ok: false, reason: "missing-profile" };
  }

  if (!profile.is_superadmin) {
    return { ok: false, reason: "unauthorized" };
  }

  return { ok: true, user, profile };
}
