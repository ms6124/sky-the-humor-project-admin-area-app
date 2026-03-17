import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateHumorMix } from "./actions";

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

export default async function HumorFlavorMixPage() {
  const supabase = await createSupabaseServerClient();
  const { data: mixes } = await supabase
    .from("humor_flavor_mix")
    .select("id, caption_count, humor_flavor_id, humor_flavors(slug)")
    .order("id", { ascending: true });

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Humor mix
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Flavor distribution
          </h2>
        </div>
        <a
          href="/admin"
          className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
        >
          Dashboard
        </a>
      </header>

      <div className="space-y-4">
        {(mixes ?? []).map((mix) => {
          const flavorSlug = getRelationValue(mix.humor_flavors, "slug");

          return (
            <div
              key={mix.id}
              className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                    {flavorSlug ?? `Flavor ${mix.humor_flavor_id}`}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#151515]">
                    Caption target count
                  </p>
                </div>
                <form action={updateHumorMix} className="flex items-center gap-3">
                  <input type="hidden" name="id" value={mix.id} />
                  <input
                    name="caption_count"
                    type="number"
                    min={0}
                    defaultValue={mix.caption_count ?? 0}
                    className="w-28 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-[#151515]"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          );
        })}
        {(mixes ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">No mix entries found.</p>
        )}
      </div>
    </div>
  );
}
