"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

function parsePriority(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return 0;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    throw new Error("Priority must be a number.");
  }
  return parsed;
}

export async function createCaptionExample(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to create caption examples.");
  }

  const imageDescription =
    (formData.get("image_description") as string | null)?.trim();
  const caption = (formData.get("caption") as string | null)?.trim();
  const explanation = (formData.get("explanation") as string | null)?.trim();
  const imageId = (formData.get("image_id") as string | null)?.trim() || null;

  if (!imageDescription || !caption || !explanation) {
    throw new Error("Image description, caption, and explanation are required.");
  }

  const priority = parsePriority(formData.get("priority"));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("caption_examples").insert({
    image_description: imageDescription,
    caption,
    explanation,
    priority,
    image_id: imageId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/caption-examples");
}

export async function updateCaptionExample(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to update caption examples.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing caption example id.");
  }

  const imageDescription =
    (formData.get("image_description") as string | null)?.trim();
  const caption = (formData.get("caption") as string | null)?.trim();
  const explanation = (formData.get("explanation") as string | null)?.trim();
  const imageId = (formData.get("image_id") as string | null)?.trim() || null;

  if (!imageDescription || !caption || !explanation) {
    throw new Error("Image description, caption, and explanation are required.");
  }

  const priority = parsePriority(formData.get("priority"));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("caption_examples")
    .update({
      image_description: imageDescription,
      caption,
      explanation,
      priority,
      image_id: imageId,
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/caption-examples");
}

export async function deleteCaptionExample(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to delete caption examples.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing caption example id.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("caption_examples")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/caption-examples");
}
