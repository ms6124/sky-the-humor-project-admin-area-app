import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createLlmProvider, deleteLlmProvider, updateLlmProvider } from "./actions";
import Pagination from "../Pagination";

export const dynamic = "force-dynamic";

type LlmProvidersPageProps = {
  searchParams?: {
    page?: string | string[];
  };
};

export default async function LlmProvidersPage({
  searchParams,
}: LlmProvidersPageProps) {
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
    .from("llm_providers")
    .select("id", { count: "exact", head: true });
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: providers } = await supabase
    .from("llm_providers")
    .select("id, name, created_datetime_utc")
    .order("name", { ascending: true })
    .range(from, to);

  const basePath = "/admin/llm-providers";
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
            LLM providers
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Provider registry
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
        <h3 className="text-lg font-semibold text-[#151515]">
          Add a provider
        </h3>
        <form action={createLlmProvider} className="mt-4 flex flex-wrap gap-4">
          <input
            name="name"
            className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
            placeholder="Provider name"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-[#151515] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f9f4ef] transition hover:bg-[#2f2f2f]"
          >
            Create provider
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {(providers ?? []).map((provider) => (
          <article
            key={provider.id}
            className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                  Provider ID {provider.id}
                </p>
                <p className="mt-2 text-lg font-semibold text-[#151515]">
                  {provider.name}
                </p>
                <p className="mt-1 text-xs text-[#6b5f57]">
                  Created: {provider.created_datetime_utc ?? "N/A"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <form action={updateLlmProvider} className="flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={provider.id} />
                  <input
                    name="name"
                    defaultValue={provider.name ?? ""}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs text-[#151515]"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
                  >
                    Save
                  </button>
                </form>
                <form action={deleteLlmProvider}>
                  <input type="hidden" name="id" value={provider.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-600 transition hover:border-red-500/70 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
        {(providers ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">No providers found.</p>
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
