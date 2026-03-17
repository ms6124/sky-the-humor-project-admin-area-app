"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";

const IMAGE_BUCKET =
  process.env.SUPABASE_IMAGE_BUCKET ??
  process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET ??
  "images";

function normalizeCheckbox(value: FormDataEntryValue | null) {
  return value === "on";
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function uploadImage(file: File) {
  const supabase = createSupabaseAdminClient();
  const fileExt = file.name ? sanitizeFilename(file.name) : "upload";
  const filePath = `admin-uploads/${randomUUID()}-${fileExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filePath);
  if (!data.publicUrl) {
    throw new Error("Unable to create public URL for uploaded image.");
  }

  return data.publicUrl;
}

export async function createImage(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to create images.");
  }

  const url = (formData.get("url") as string | null)?.trim() || null;
  const file = formData.get("upload") as File | null;
  const hasUpload = file && file.size > 0;
  const imageDescription =
    (formData.get("image_description") as string | null)?.trim() || null;
  const isPublic = normalizeCheckbox(formData.get("is_public"));
  const isCommonUse = normalizeCheckbox(formData.get("is_common_use"));

  const finalUrl = hasUpload ? await uploadImage(file) : url;

  if (!finalUrl) {
    throw new Error("Image URL or file upload is required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("images").insert({
    url: finalUrl,
    image_description: imageDescription,
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
  const currentUrl =
    (formData.get("current_url") as string | null)?.trim() || null;
  const file = formData.get("upload") as File | null;
  const hasUpload = file && file.size > 0;
  const imageDescription =
    (formData.get("image_description") as string | null)?.trim() || null;
  const isPublic = normalizeCheckbox(formData.get("is_public"));
  const isCommonUse = normalizeCheckbox(formData.get("is_common_use"));

  const finalUrl = hasUpload ? await uploadImage(file) : url ?? currentUrl;

  if (!finalUrl) {
    throw new Error("Image URL or file upload is required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("images")
    .update({
      url: finalUrl,
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

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("images").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/images");
}
