"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function updateHumorMix(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to update humor mix.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing mix id.");
  }

  const captionCountValue = formData.get("caption_count") as string | null;
  const captionCount = captionCountValue
    ? Number.parseInt(captionCountValue, 10)
    : Number.NaN;

  if (!Number.isFinite(captionCount)) {
    throw new Error("Caption count must be a number.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("humor_flavor_mix")
    .update({ caption_count: captionCount })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/humor-flavor-mix");
}
