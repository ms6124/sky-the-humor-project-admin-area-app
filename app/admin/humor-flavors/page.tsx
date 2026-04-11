import { createSupabaseServerClient } from "@/lib/supabase/server";
import Pagination from "../Pagination";
import { duplicateHumorFlavor } from "./actions";

export const dynamic = "force-dynamic";

type HumorFlavorsPageProps = {
  searchParams?: {
    page?: string | string[];
  };
};

export default async function HumorFlavorsPage({
  searchParams,
}: HumorFlavorsPageProps) {
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
    .from("humor_flavors")
    .select("id", { count: "exact", head: true });
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: flavors } = await supabase
    .from("humor_flavors")
    .select("id, slug, description, created_datetime_utc")
    .order("created_datetime_utc", { ascending: false })
    .range(from, to);

  const basePath = "/admin/humor-flavors";
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
            Humor flavors
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Flavor registry
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
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Duplicate</th>
            </tr>
          </thead>
          <tbody>
            {(flavors ?? []).map((flavor) => (
              <tr key={flavor.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-semibold text-[#151515]">
                  {flavor.slug}
                </td>
                <td className="px-4 py-3 text-[#6b5f57]">
                  {flavor.description ?? "No description"}
                </td>
                <td className="px-4 py-3 text-[#6b5f57]">
                  {flavor.created_datetime_utc ?? "N/A"}
                </td>
                <td className="px-4 py-3">
                  <form
                    action={duplicateHumorFlavor}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <input type="hidden" name="id" value={flavor.id} />
                    <input
                      name="new_slug"
                      required
                      placeholder="New slug"
                      className="w-40 rounded-full border border-black/10 bg-white/85 px-3 py-2 text-xs text-[#151515]"
                    />
                    <button
                      type="submit"
                      className="rounded-full border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
                    >
                      Duplicate
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(flavors ?? []).length === 0 && (
          <p className="px-4 py-6 text-sm text-[#6b5f57]">
            No humor flavors found.
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
