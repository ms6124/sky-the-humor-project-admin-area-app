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

export default async function LlmResponsesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: responses } = await supabase
    .from("llm_model_responses")
    .select(
      "id, created_datetime_utc, llm_model_response, processing_time_seconds, llm_temperature, llm_model_id, profile_id, caption_request_id, humor_flavor_id, llm_prompt_chain_id, humor_flavor_step_id, llm_models(name), humor_flavors(slug)"
    )
    .order("created_datetime_utc", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            LLM responses
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Response history
          </h2>
        </div>
        <a
          href="/admin"
          className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
        >
          Dashboard
        </a>
      </header>

      <div className="grid gap-4">
        {(responses ?? []).map((response) => {
          const modelName = getRelationValue(response.llm_models, "name");
          const flavorSlug = getRelationValue(response.humor_flavors, "slug");
          const responsePreview = response.llm_model_response
            ? response.llm_model_response.slice(0, 220)
            : null;

          return (
            <article
              key={response.id}
              className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                  {response.created_datetime_utc ?? "No timestamp"}
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[#6b5f57]">
                  <span className="rounded-full border border-black/15 px-2 py-1">
                    {modelName ?? `Model ${response.llm_model_id}`}
                  </span>
                  <span className="rounded-full border border-black/15 px-2 py-1">
                    {flavorSlug ?? `Flavor ${response.humor_flavor_id}`}
                  </span>
                  <span className="rounded-full border border-black/15 px-2 py-1">
                    {response.processing_time_seconds}s
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#151515]">
                {responsePreview ?? "No response payload."}
              </p>
              <div className="mt-4 text-xs text-[#6b5f57]">
                <p>Profile: {response.profile_id}</p>
                <p>Caption request: {response.caption_request_id}</p>
                <p>Prompt chain: {response.llm_prompt_chain_id ?? "N/A"}</p>
                <p>Step: {response.humor_flavor_step_id ?? "N/A"}</p>
                <p>Temperature: {response.llm_temperature ?? "N/A"}</p>
              </div>
            </article>
          );
        })}
        {(responses ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">No LLM responses found.</p>
        )}
      </div>
    </div>
  );
}
