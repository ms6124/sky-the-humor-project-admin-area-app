import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createCaptionExample,
  deleteCaptionExample,
  updateCaptionExample,
} from "./actions";
import Pagination from "../Pagination";

export const dynamic = "force-dynamic";

type CaptionExamplesPageProps = {
  searchParams?: {
    page?: string | string[];
  };
};

export default async function CaptionExamplesPage({
  searchParams,
}: CaptionExamplesPageProps) {
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
    .from("caption_examples")
    .select("id", { count: "exact", head: true });
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: examples } = await supabase
    .from("caption_examples")
    .select(
      "id, image_description, caption, explanation, priority, image_id, created_datetime_utc, modified_datetime_utc"
    )
    .order("priority", { ascending: false })
    .range(from, to);

  const basePath = "/admin/caption-examples";
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
            Caption examples
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Example library
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
          Add a caption example
        </h3>
        <form action={createCaptionExample} className="mt-4 grid gap-4">
          <label className="text-sm text-[#6b5f57]">
            Image description
            <textarea
              name="image_description"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              rows={2}
              required
            />
          </label>
          <label className="text-sm text-[#6b5f57]">
            Caption
            <textarea
              name="caption"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              rows={2}
              required
            />
          </label>
          <label className="text-sm text-[#6b5f57]">
            Explanation
            <textarea
              name="explanation"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              rows={3}
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-[#6b5f57]">
              Priority
              <input
                name="priority"
                type="number"
                defaultValue={0}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              />
            </label>
            <label className="text-sm text-[#6b5f57]">
              Image ID (optional)
              <input
                name="image_id"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              />
            </label>
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#151515] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f9f4ef] transition hover:bg-[#2f2f2f]"
          >
            Create example
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {(examples ?? []).map((example) => (
          <article
            key={example.id}
            className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-[240px] flex-1 space-y-5">
                <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                  Priority {example.priority ?? 0}
                </p>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6b5f57]">
                    Image description
                  </p>
                  <p className="mt-2 text-sm text-[#6b5f57]">
                    {example.image_description}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6b5f57]">
                    Caption
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#151515]">
                    {example.caption}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6b5f57]">
                    Explanation
                  </p>
                  <p className="mt-2 text-sm text-[#6b5f57]">
                    {example.explanation}
                  </p>
                </div>
              </div>
              <div className="min-w-[200px] text-xs text-[#6b5f57]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6b5f57]">
                  Metadata
                </p>
                <div className="mt-2 space-y-2">
                  <p>
                    <span className="uppercase tracking-[0.2em]">ID</span>:{" "}
                    {example.id}
                  </p>
                  <p>
                    <span className="uppercase tracking-[0.2em]">Image</span>:{" "}
                    {example.image_id ?? "N/A"}
                  </p>
                  <p>
                    <span className="uppercase tracking-[0.2em]">Created</span>:{" "}
                    {example.created_datetime_utc ?? "N/A"}
                  </p>
                  <p>
                    <span className="uppercase tracking-[0.2em]">Updated</span>:{" "}
                    {example.modified_datetime_utc ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <details className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.25em] text-[#151515]">
                Edit or delete
              </summary>
              <form action={updateCaptionExample} className="mt-4 grid gap-4">
                <input type="hidden" name="id" value={example.id} />
                <label className="text-sm text-[#6b5f57]">
                  Image description
                  <textarea
                    name="image_description"
                    defaultValue={example.image_description ?? ""}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                    rows={2}
                    required
                  />
                </label>
                <label className="text-sm text-[#6b5f57]">
                  Caption
                  <textarea
                    name="caption"
                    defaultValue={example.caption ?? ""}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                    rows={2}
                    required
                  />
                </label>
                <label className="text-sm text-[#6b5f57]">
                  Explanation
                  <textarea
                    name="explanation"
                    defaultValue={example.explanation ?? ""}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                    rows={3}
                    required
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-[#6b5f57]">
                    Priority
                    <input
                      name="priority"
                      type="number"
                      defaultValue={example.priority ?? 0}
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                    />
                  </label>
                  <label className="text-sm text-[#6b5f57]">
                    Image ID (optional)
                    <input
                      name="image_id"
                      defaultValue={example.image_id ?? ""}
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
                >
                  Save changes
                </button>
              </form>
              <form action={deleteCaptionExample} className="mt-4">
                <input type="hidden" name="id" value={example.id} />
                <button
                  type="submit"
                  className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-600 transition hover:border-red-500/70 hover:bg-red-50"
                >
                  Delete example
                </button>
              </form>
            </details>
          </article>
        ))}
        {(examples ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">No caption examples found.</p>
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
