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

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    throw new Error("Value must be a number.");
  }
  return parsed;
}

export async function createTerm(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to create terms.");
  }

  const term = (formData.get("term") as string | null)?.trim();
  const definition = (formData.get("definition") as string | null)?.trim();
  const example = (formData.get("example") as string | null)?.trim();

  if (!term || !definition || !example) {
    throw new Error("Term, definition, and example are required.");
  }

  const priority = parsePriority(formData.get("priority"));
  const termTypeId = parseOptionalNumber(formData.get("term_type_id"));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("terms").insert({
    term,
    definition,
    example,
    priority,
    term_type_id: termTypeId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/terms");
}

export async function updateTerm(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to update terms.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing term id.");
  }

  const term = (formData.get("term") as string | null)?.trim();
  const definition = (formData.get("definition") as string | null)?.trim();
  const example = (formData.get("example") as string | null)?.trim();

  if (!term || !definition || !example) {
    throw new Error("Term, definition, and example are required.");
  }

  const priority = parsePriority(formData.get("priority"));
  const termTypeId = parseOptionalNumber(formData.get("term_type_id"));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("terms")
    .update({
      term,
      definition,
      example,
      priority,
      term_type_id: termTypeId,
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/terms");
}

export async function deleteTerm(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to delete terms.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing term id.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("terms").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/terms");
}
