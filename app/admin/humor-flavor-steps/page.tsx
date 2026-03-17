import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Relation<T> = T | T[] | null;

function getRelationValue<T extends Record<string, string | null>>(
  relation: Relation<T>,
  key: keyof T
) {
  if (!relation) {
    return null;
  }
  if (Array.isArray(relation)) {
    return relation[0]?.[key] ?? null;
  }
  return relation[key] ?? null;
}

export default async function HumorFlavorStepsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: steps } = await supabase
    .from("humor_flavor_steps")
    .select(
      "id, created_datetime_utc, order_by, llm_temperature, description, humor_flavor_id, llm_model_id, llm_input_type_id, llm_output_type_id, humor_flavor_step_type_id, humor_flavors(slug), llm_models(name), humor_flavor_step_types(slug), llm_input_types(slug), llm_output_types(slug)"
    )
    .order("created_datetime_utc", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Humor flavor steps
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Step pipeline
          </h2>
        </div>
        <a
          href="/admin"
          className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
        >
          Dashboard
        </a>
      </header>

      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white/85 shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#fef6f1] text-xs uppercase tracking-[0.2em] text-[#6b5f57]">
            <tr>
              <th className="px-4 py-3">Flavor</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Step type</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Input/Output</th>
              <th className="px-4 py-3">Temp</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {(steps ?? []).map((step) => {
              const flavorSlug = getRelationValue(step.humor_flavors, "slug");
              const modelName = getRelationValue(step.llm_models, "name");
              const stepType = getRelationValue(
                step.humor_flavor_step_types,
                "slug"
              );
              const inputType = getRelationValue(step.llm_input_types, "slug");
              const outputType = getRelationValue(
                step.llm_output_types,
                "slug"
              );

              return (
                <tr key={step.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-semibold text-[#151515]">
                    {flavorSlug ?? step.humor_flavor_id}
                  </td>
                  <td className="px-4 py-3 text-[#6b5f57]">
                    {step.order_by}
                  </td>
                  <td className="px-4 py-3 text-[#6b5f57]">
                    {stepType ?? step.humor_flavor_step_type_id}
                  </td>
                  <td className="px-4 py-3 text-[#6b5f57]">
                    {modelName ?? step.llm_model_id}
                  </td>
                  <td className="px-4 py-3 text-[#6b5f57]">
                    {(inputType ?? step.llm_input_type_id) ?? "-"} → {(
                      outputType ?? step.llm_output_type_id
                    ) ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-[#6b5f57]">
                    {step.llm_temperature ?? "N/A"}
                  </td>
                  <td className="px-4 py-3 text-[#6b5f57]">
                    {step.description ?? "No description"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(steps ?? []).length === 0 && (
          <p className="px-4 py-6 text-sm text-[#6b5f57]">
            No humor flavor steps found.
          </p>
        )}
      </div>
    </div>
  );
}
