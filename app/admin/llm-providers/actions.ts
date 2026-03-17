"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function createLlmProvider(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to create LLM providers.");
  }

  const name = (formData.get("name") as string | null)?.trim();
  if (!name) {
    throw new Error("Provider name is required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("llm_providers").insert({ name });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/llm-providers");
}

export async function updateLlmProvider(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to update LLM providers.");
  }

  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string | null)?.trim();

  if (!id || !name) {
    throw new Error("Provider id and name are required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("llm_providers")
    .update({ name })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/llm-providers");
}

export async function deleteLlmProvider(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to delete LLM providers.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing provider id.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("llm_providers").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/llm-providers");
}
