import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createLlmModel, deleteLlmModel, updateLlmModel } from "./actions";
import Pagination from "../Pagination";

export const dynamic = "force-dynamic";

type Provider = {
  id: number;
  name: string | null;
};

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

type LlmModelsPageProps = {
  searchParams?: {
    page?: string | string[];
  };
};

export default async function LlmModelsPage({ searchParams }: LlmModelsPageProps) {
  const supabase = await createSupabaseServerClient();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const pageParam = Array.isArray(resolvedSearchParams?.page)
    ? resolvedSearchParams?.page[0]
    : resolvedSearchParams?.page;
  const requestedPage = Number.parseInt(pageParam ?? "1", 10);
  const pageSize = 20;
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const { count } = await supabase
    .from("llm_models")
    .select("id", { count: "exact", head: true });
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const [{ data: models }, { data: providers }] = await Promise.all([
    supabase
      .from("llm_models")
      .select(
        "id, name, provider_model_id, llm_provider_id, is_temperature_supported, created_datetime_utc, llm_providers(name)"
      )
      .order("created_datetime_utc", { ascending: false })
      .range(from, to),
    supabase.from("llm_providers").select("id, name").order("name"),
  ]);

  const providerOptions = (providers ?? []) as Provider[];
  const basePath = "/admin/llm-models";
  const buildPageHref = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (pageNumber > 1) {
      params.set("page", pageNumber.toString());
    }
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            LLM models
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Model registry
          </h2>
        </div>
        <a
          href="/admin"
          className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
        >
          Dashboard
        </a>
      </header>

      <section className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md">
        <h3 className="text-lg font-semibold text-[#151515]">Add a model</h3>
        <form action={createLlmModel} className="mt-4 grid gap-4">
          <label className="text-sm text-[#6b5f57]">
            Model name
            <input
              name="name"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              required
            />
          </label>
          <label className="text-sm text-[#6b5f57]">
            Provider model ID
            <input
              name="provider_model_id"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-[#6b5f57]">
              Provider
              <select
                name="llm_provider_id"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                required
              >
                <option value="">Select provider</option>
                {providerOptions.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name ?? `Provider ${provider.id}`}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-[#6b5f57]">
              <input
                type="checkbox"
                name="is_temperature_supported"
                className="h-4 w-4 rounded border-black/20"
              />
              Supports temperature
            </label>
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#151515] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f9f4ef] transition hover:bg-[#2f2f2f]"
          >
            Create model
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {(models ?? []).map((model) => {
          const providerName = getRelationValue(model.llm_providers, "name");

          return (
            <article
              key={model.id}
              className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                    Model ID {model.id}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#151515]">
                    {model.name}
                  </p>
                  <p className="mt-1 text-sm text-[#6b5f57]">
                    Provider: {providerName ?? model.llm_provider_id}
                  </p>
                  <p className="mt-1 text-sm text-[#6b5f57]">
                    Provider model id: {model.provider_model_id}
                  </p>
                </div>
                <div className="text-xs text-[#6b5f57]">
                  <p>Temp support: {model.is_temperature_supported ? "Yes" : "No"}</p>
                  <p>Created: {model.created_datetime_utc ?? "N/A"}</p>
                </div>
              </div>
              <details className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.25em] text-[#151515]">
                  Edit or delete
                </summary>
                <form action={updateLlmModel} className="mt-4 grid gap-4">
                  <input type="hidden" name="id" value={model.id} />
                  <label className="text-sm text-[#6b5f57]">
                    Model name
                    <input
                      name="name"
                      defaultValue={model.name ?? ""}
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                      required
                    />
                  </label>
                  <label className="text-sm text-[#6b5f57]">
                    Provider model ID
                    <input
                      name="provider_model_id"
                      defaultValue={model.provider_model_id ?? ""}
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                      required
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm text-[#6b5f57]">
                      Provider
                      <select
                        name="llm_provider_id"
                        className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                        defaultValue={model.llm_provider_id ?? ""}
                        required
                      >
                        <option value="">Select provider</option>
                        {providerOptions.map((provider) => (
                          <option key={provider.id} value={provider.id}>
                            {provider.name ?? `Provider ${provider.id}`}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[#6b5f57]">
                      <input
                        type="checkbox"
                        name="is_temperature_supported"
                        defaultChecked={model.is_temperature_supported ?? false}
                        className="h-4 w-4 rounded border-black/20"
                      />
                      Supports temperature
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
                  >
                    Save changes
                  </button>
                </form>
                <form action={deleteLlmModel} className="mt-4">
                  <input type="hidden" name="id" value={model.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-600 transition hover:border-red-500/70 hover:bg-red-50"
                  >
                    Delete model
                  </button>
                </form>
              </details>
            </article>
          );
        })}
        {(models ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">No models found.</p>
        )}
      </section>
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        previousHref={safePage > 1 ? buildPageHref(safePage - 1) : undefined}
        nextHref={
          safePage < totalPages ? buildPageHref(safePage + 1) : undefined
        }
      />
    </div>
  );
}
