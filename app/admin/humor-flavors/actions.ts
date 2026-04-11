"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function duplicateHumorFlavor(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to duplicate humor flavors.");
  }

  const id = formData.get("id") as string | null;
  const newSlug = (formData.get("new_slug") as string | null)?.trim();

  if (!id || !newSlug) {
    throw new Error("Flavor id and new slug are required.");
  }

  const supabase = await createSupabaseServerClient();
  const resolveUniqueSlug = async (slug: string) => {
    const baseSlug = `${slug}-copy`;
    const candidateSlugs = [slug, baseSlug];
    for (const candidate of candidateSlugs) {
      const { data, error } = await supabase
        .from("humor_flavors")
        .select("id")
        .eq("slug", candidate)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return candidate;
      }
    }

    for (let index = 2; index <= 50; index += 1) {
      const candidate = `${baseSlug}-${index}`;
      const { data, error } = await supabase
        .from("humor_flavors")
        .select("id")
        .eq("slug", candidate)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return candidate;
      }
    }

    throw new Error("Unable to generate a unique slug.");
  };
  const resolvedSlug = await resolveUniqueSlug(newSlug);

  const { data: flavor, error: flavorError } = await supabase
    .from("humor_flavors")
    .select("description")
    .eq("id", id)
    .maybeSingle();

  if (flavorError) {
    throw new Error(flavorError.message);
  }

  if (!flavor) {
    throw new Error("Flavor not found.");
  }

  const { data: newFlavor, error: insertError } = await supabase
    .from("humor_flavors")
    .insert({ slug: resolvedSlug, description: flavor.description })
    .select("id")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  const { data: steps, error: stepsError } = await supabase
    .from("humor_flavor_steps")
    .select(
      "order_by, llm_temperature, llm_input_type_id, llm_output_type_id, llm_model_id, humor_flavor_step_type_id, llm_system_prompt, llm_user_prompt, description"
    )
    .eq("humor_flavor_id", id)
    .order("order_by", { ascending: true });

  if (stepsError) {
    throw new Error(stepsError.message);
  }

  if (steps && steps.length > 0) {
    const stepsToInsert = steps.map((step) => ({
      humor_flavor_id: newFlavor.id,
      order_by: step.order_by,
      llm_temperature: step.llm_temperature,
      llm_input_type_id: step.llm_input_type_id,
      llm_output_type_id: step.llm_output_type_id,
      llm_model_id: step.llm_model_id,
      humor_flavor_step_type_id: step.humor_flavor_step_type_id,
      llm_system_prompt: step.llm_system_prompt,
      llm_user_prompt: step.llm_user_prompt,
      description: step.description,
    }));

    const { error: stepInsertError } = await supabase
      .from("humor_flavor_steps")
      .insert(stepsToInsert);

    if (stepInsertError) {
      throw new Error(stepInsertError.message);
    }
  }

  revalidatePath("/admin/humor-flavors");
  revalidatePath("/admin/humor-flavor-steps");
}
