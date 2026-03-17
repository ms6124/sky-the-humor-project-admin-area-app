"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function createAllowedDomain(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to create allowed domains.");
  }

  const apexDomain = (formData.get("apex_domain") as string | null)?.trim();
  if (!apexDomain) {
    throw new Error("Domain is required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("allowed_signup_domains")
    .insert({ apex_domain: apexDomain });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/allowed-signup-domains");
}

export async function updateAllowedDomain(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to update allowed domains.");
  }

  const id = formData.get("id") as string | null;
  const apexDomain = (formData.get("apex_domain") as string | null)?.trim();
  if (!id || !apexDomain) {
    throw new Error("Domain id and value are required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("allowed_signup_domains")
    .update({ apex_domain: apexDomain })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/allowed-signup-domains");
}

export async function deleteAllowedDomain(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to delete allowed domains.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing domain id.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("allowed_signup_domains")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/allowed-signup-domains");
}
