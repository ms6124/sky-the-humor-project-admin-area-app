import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type CaptionsPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function CaptionsPage({ searchParams }: CaptionsPageProps) {
  const supabase = await createSupabaseServerClient();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = (resolvedSearchParams?.q ?? "").trim();

  let captionsQuery = supabase
    .from("captions")
    .select(
      "id, content, created_datetime_utc, is_public, is_featured, like_count, profile_id, image_id, image:images(url)"
    )
    .not("content", "is", null)
    .neq("content", "")
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  if (query) {
    const looksLikeUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        query
      );

    captionsQuery = looksLikeUuid
      ? captionsQuery.or(
          [
            `content.ilike.%${query}%`,
            `profile_id.eq.${query}`,
            `image_id.eq.${query}`,
          ].join(",")
        )
      : captionsQuery.ilike("content", `%${query}%`);
  }

  const { data: captions } = await captionsQuery;

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
      <form className="flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search captions, profile ID, or image ID"
          className="w-full max-w-xl rounded-2xl border border-black/10 bg-white/85 px-4 py-3 text-sm text-[#151515] shadow-sm"
        />
        <button
          type="submit"
          className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
        >
          Search
        </button>
        {query ? (
          <a
            href="/admin/captions"
            className="inline-flex items-center rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
          >
            Clear
          </a>
        ) : null}
      </form>

      <div className="grid gap-4">
        {(captions ?? []).map((caption) => (
          <article
            key={caption.id}
            className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
          >
            {(() => {
              const imageUrl = Array.isArray(caption.image)
                ? caption.image[0]?.url
                : caption.image?.url;

              return (
            <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-[#fef6f1]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Caption source"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full min-h-[120px] items-center justify-center text-xs uppercase tracking-[0.2em] text-[#6b5f57]">
                    No image
                  </div>
                )}
              </div>
              <div>
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
              </div>
            </div>
              );
            })()}
          </article>
        ))}
        {(captions ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">
            {query ? "No captions match that search." : "No captions found."}
          </p>
        )}
      </div>
    </div>
  );
}
