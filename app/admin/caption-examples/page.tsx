import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createCaptionExample,
  deleteCaptionExample,
  updateCaptionExample,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function CaptionExamplesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: examples } = await supabase
    .from("caption_examples")
    .select(
      "id, image_description, caption, explanation, priority, image_id, created_datetime_utc, modified_datetime_utc"
    )
    .order("priority", { ascending: false })
    .limit(200);

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
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                  Priority {example.priority ?? 0}
                </p>
                <p className="mt-2 text-sm text-[#6b5f57]">
                  {example.image_description}
                </p>
                <p className="mt-3 text-lg font-semibold text-[#151515]">
                  {example.caption}
                </p>
                <p className="mt-2 text-sm text-[#6b5f57]">
                  {example.explanation}
                </p>
              </div>
              <div className="text-xs text-[#6b5f57]">
                <p>Image: {example.image_id ?? "N/A"}</p>
                <p>Created: {example.created_datetime_utc ?? "N/A"}</p>
                <p>Updated: {example.modified_datetime_utc ?? "N/A"}</p>
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
    </div>
  );
}
