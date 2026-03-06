"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

function normalizeCheckbox(value: FormDataEntryValue | null) {
  return value === "on";
}

export async function createImage(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to create images.");
  }

  const url = (formData.get("url") as string | null)?.trim() || null;
  const imageDescription =
    (formData.get("image_description") as string | null)?.trim() || null;
  const profileId =
    (formData.get("profile_id") as string | null)?.trim() || null;
  const isPublic = normalizeCheckbox(formData.get("is_public"));
  const isCommonUse = normalizeCheckbox(formData.get("is_common_use"));

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("images").insert({
    url,
    image_description: imageDescription,
    profile_id: profileId,
    is_public: isPublic,
    is_common_use: isCommonUse,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/images");
}

export async function updateImage(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to update images.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing image id.");
  }

  const url = (formData.get("url") as string | null)?.trim() || null;
  const imageDescription =
    (formData.get("image_description") as string | null)?.trim() || null;
  const isPublic = normalizeCheckbox(formData.get("is_public"));
  const isCommonUse = normalizeCheckbox(formData.get("is_common_use"));

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("images")
    .update({
      url,
      image_description: imageDescription,
      is_public: isPublic,
      is_common_use: isCommonUse,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/images");
}

export async function deleteImage(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to delete images.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing image id.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("images").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/images");
}
