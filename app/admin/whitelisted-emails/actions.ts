"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

const WHITELIST_TABLE = "whitelist_email_addresses";
const WHITELIST_FIELD = "email_address";

export async function createWhitelistedEmail(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to create whitelisted emails.");
  }

  const email = (formData.get("email_address") as string | null)?.trim();
  if (!email) {
    throw new Error("Email address is required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(WHITELIST_TABLE)
    .insert({ [WHITELIST_FIELD]: email });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/whitelisted-emails");
}

export async function updateWhitelistedEmail(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to update whitelisted emails.");
  }

  const id = formData.get("id") as string | null;
  const email = (formData.get("email_address") as string | null)?.trim();
  if (!id || !email) {
    throw new Error("Email id and address are required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(WHITELIST_TABLE)
    .update({ [WHITELIST_FIELD]: email })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/whitelisted-emails");
}

export async function deleteWhitelistedEmail(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to delete whitelisted emails.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing email id.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(WHITELIST_TABLE).delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/whitelisted-emails");
}
