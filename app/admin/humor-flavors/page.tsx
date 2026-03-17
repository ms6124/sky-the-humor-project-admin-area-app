import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HumorFlavorsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: flavors } = await supabase
    .from("humor_flavors")
    .select("id, slug, description, created_datetime_utc")
    .order("created_datetime_utc", { ascending: false })
    .limit(200);

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
    </div>
  );
}
