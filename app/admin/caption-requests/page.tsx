import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export default async function CaptionRequestsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: requests } = await supabase
    .from("caption_requests")
    .select("id, created_datetime_utc, profile_id, image_id, profiles(email), images(url)")
    .order("created_datetime_utc", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Caption requests
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Request queue
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
        {(requests ?? []).map((request) => {
          const email = getRelationValue(request.profiles, "email");
          const imageUrl = getRelationValue(request.images, "url");

          return (
            <article
              key={request.id}
              className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
            >
              <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
                <div className="overflow-hidden rounded-2xl border border-black/10 bg-[#fef6f1]">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Requested image"
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
                  <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                    {request.created_datetime_utc ?? "No timestamp"}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[#151515]">
                    Request {request.id}
                  </p>
                  <div className="mt-2 text-xs text-[#6b5f57]">
                    <p>Profile: {request.profile_id}</p>
                    <p>Email: {email ?? "N/A"}</p>
                    <p>Image: {request.image_id}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        {(requests ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">
            No caption requests found.
          </p>
        )}
      </div>
    </div>
  );
}
