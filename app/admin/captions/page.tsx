import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function CaptionsPage() {
  const supabase = createSupabaseAdminClient();
  const { data: captions } = await supabase
    .from("captions")
    .select(
      "id, content, created_datetime_utc, is_public, is_featured, like_count, profile_id, image_id"
    )
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Captions
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Caption review
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
        {(captions ?? []).map((caption) => (
          <article
            key={caption.id}
            className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                {caption.created_datetime_utc ?? "No timestamp"}
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[#6b5f57]">
                <span className="rounded-full border border-black/15 px-2 py-1">
                  {caption.is_public ? "Public" : "Private"}
                </span>
                {caption.is_featured && (
                  <span className="rounded-full border border-black/15 px-2 py-1">
                    Featured
                  </span>
                )}
                <span className="rounded-full border border-black/15 px-2 py-1">
                  {caption.like_count ?? 0} likes
                </span>
              </div>
            </div>
            <p className="mt-4 text-lg font-semibold text-[#151515]">
              {caption.content || "Untitled caption"}
            </p>
            <div className="mt-3 text-xs text-[#6b5f57]">
              <p>Profile: {caption.profile_id ?? "N/A"}</p>
              <p>Image: {caption.image_id ?? "N/A"}</p>
            </div>
          </article>
        ))}
        {(captions ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">No captions found.</p>
        )}
      </div>
    </div>
  );
}
