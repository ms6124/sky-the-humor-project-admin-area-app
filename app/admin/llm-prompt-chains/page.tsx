import { createSupabaseServerClient } from "@/lib/supabase/server";
import Pagination from "../Pagination";

export const dynamic = "force-dynamic";

type LlmPromptChainsPageProps = {
  searchParams?: {
    page?: string | string[];
  };
};

export default async function LlmPromptChainsPage({
  searchParams,
}: LlmPromptChainsPageProps) {
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
    .from("llm_prompt_chains")
    .select("id", { count: "exact", head: true });
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: chains } = await supabase
    .from("llm_prompt_chains")
    .select("id, created_datetime_utc, caption_request_id")
    .order("created_datetime_utc", { ascending: false })
    .range(from, to);

  const basePath = "/admin/llm-prompt-chains";
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
            LLM prompt chains
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Chain audit log
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
              <th className="px-4 py-3">Chain ID</th>
              <th className="px-4 py-3">Caption request</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {(chains ?? []).map((chain) => (
              <tr key={chain.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-semibold text-[#151515]">
                  {chain.id}
                </td>
                <td className="px-4 py-3 text-[#6b5f57]">
                  {chain.caption_request_id}
                </td>
                <td className="px-4 py-3 text-[#6b5f57]">
                  {chain.created_datetime_utc ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(chains ?? []).length === 0 && (
          <p className="px-4 py-6 text-sm text-[#6b5f57]">
            No prompt chains found.
          </p>
        )}
      </div>
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
