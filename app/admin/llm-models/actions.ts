"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

function normalizeCheckbox(value: FormDataEntryValue | null) {
  return value === "on";
}

export async function createLlmModel(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to create LLM models.");
  }

  const name = (formData.get("name") as string | null)?.trim();
  const providerModelId =
    (formData.get("provider_model_id") as string | null)?.trim();
  const providerId = formData.get("llm_provider_id") as string | null;

  if (!name || !providerModelId || !providerId) {
    throw new Error("Model name, provider, and provider model id are required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("llm_models").insert({
    name,
    provider_model_id: providerModelId,
    llm_provider_id: Number.parseInt(providerId, 10),
    is_temperature_supported: normalizeCheckbox(
      formData.get("is_temperature_supported")
    ),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/llm-models");
}

export async function updateLlmModel(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to update LLM models.");
  }

  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string | null)?.trim();
  const providerModelId =
    (formData.get("provider_model_id") as string | null)?.trim();
  const providerId = formData.get("llm_provider_id") as string | null;

  if (!id || !name || !providerModelId || !providerId) {
    throw new Error("Model id, name, provider, and provider model id are required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("llm_models")
    .update({
      name,
      provider_model_id: providerModelId,
      llm_provider_id: Number.parseInt(providerId, 10),
      is_temperature_supported: normalizeCheckbox(
        formData.get("is_temperature_supported")
      ),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/llm-models");
}

export async function deleteLlmModel(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to delete LLM models.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing model id.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("llm_models").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/llm-models");
}
