import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createTerm, deleteTerm, updateTerm } from "./actions";

export const dynamic = "force-dynamic";

type TermType = {
  id: number;
  name: string | null;
};

export default async function TermsPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: terms }, { data: termTypes }] = await Promise.all([
    supabase
      .from("terms")
      .select(
        "id, term, definition, example, priority, term_type_id, created_datetime_utc, modified_datetime_utc"
      )
      .order("priority", { ascending: false })
      .limit(200),
    supabase.from("term_types").select("id, name").order("name"),
  ]);

  const typeOptions = (termTypes ?? []) as TermType[];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Terms
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Glossary editor
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
        <h3 className="text-lg font-semibold text-[#151515]">Add a term</h3>
        <form action={createTerm} className="mt-4 grid gap-4">
          <label className="text-sm text-[#6b5f57]">
            Term
            <input
              name="term"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              required
            />
          </label>
          <label className="text-sm text-[#6b5f57]">
            Definition
            <textarea
              name="definition"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              rows={3}
              required
            />
          </label>
          <label className="text-sm text-[#6b5f57]">
            Example
            <textarea
              name="example"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              rows={2}
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
              Term type
              <select
                name="term_type_id"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                defaultValue=""
              >
                <option value="">Unassigned</option>
                {typeOptions.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name ?? `Type ${type.id}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#151515] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f9f4ef] transition hover:bg-[#2f2f2f]"
          >
            Create term
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {(terms ?? []).map((term) => (
          <article
            key={term.id}
            className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                  Priority {term.priority ?? 0}
                </p>
                <p className="mt-2 text-lg font-semibold text-[#151515]">
                  {term.term}
                </p>
                <p className="mt-2 text-sm text-[#6b5f57]">
                  {term.definition}
                </p>
                <p className="mt-2 text-xs text-[#6b5f57]">
                  Example: {term.example}
                </p>
              </div>
              <div className="text-xs text-[#6b5f57]">
                <p>Created: {term.created_datetime_utc ?? "N/A"}</p>
                <p>Updated: {term.modified_datetime_utc ?? "N/A"}</p>
              </div>
            </div>
            <details className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.25em] text-[#151515]">
                Edit or delete
              </summary>
              <form action={updateTerm} className="mt-4 grid gap-4">
                <input type="hidden" name="id" value={term.id} />
                <label className="text-sm text-[#6b5f57]">
                  Term
                  <input
                    name="term"
                    defaultValue={term.term ?? ""}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                    required
                  />
                </label>
                <label className="text-sm text-[#6b5f57]">
                  Definition
                  <textarea
                    name="definition"
                    defaultValue={term.definition ?? ""}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                    rows={3}
                    required
                  />
                </label>
                <label className="text-sm text-[#6b5f57]">
                  Example
                  <textarea
                    name="example"
                    defaultValue={term.example ?? ""}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                    rows={2}
                    required
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-[#6b5f57]">
                    Priority
                    <input
                      name="priority"
                      type="number"
                      defaultValue={term.priority ?? 0}
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                    />
                  </label>
                  <label className="text-sm text-[#6b5f57]">
                    Term type
                    <select
                      name="term_type_id"
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                      defaultValue={term.term_type_id ?? ""}
                    >
                      <option value="">Unassigned</option>
                      {typeOptions.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name ?? `Type ${type.id}`}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  type="submit"
                  className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
                >
                  Save changes
                </button>
              </form>
              <form action={deleteTerm} className="mt-4">
                <input type="hidden" name="id" value={term.id} />
                <button
                  type="submit"
                  className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-600 transition hover:border-red-500/70 hover:bg-red-50"
                >
                  Delete term
                </button>
              </form>
            </details>
          </article>
        ))}
        {(terms ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">No terms found.</p>
        )}
      </section>
    </div>
  );
}
