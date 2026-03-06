import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getCounts() {
  const supabase = await createSupabaseServerClient();

  const [
    profilesResult,
    imagesResult,
    captionsResult,
    publicImagesResult,
    captionLikesResult,
    reportsResult,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("images").select("*", { count: "exact", head: true }),
    supabase.from("captions").select("*", { count: "exact", head: true }),
    supabase
      .from("images")
      .select("*", { count: "exact", head: true })
      .eq("is_public", true),
    supabase.from("caption_likes").select("*", { count: "exact", head: true }),
    supabase.from("reported_captions").select("*", { count: "exact", head: true }),
  ]);

  return {
    profiles: profilesResult.count ?? 0,
    images: imagesResult.count ?? 0,
    captions: captionsResult.count ?? 0,
    publicImages: publicImagesResult.count ?? 0,
    captionLikes: captionLikesResult.count ?? 0,
    reports: reportsResult.count ?? 0,
  };
}

async function getHighlights() {
  const supabase = await createSupabaseServerClient();

  const [recentImages, recentCaptions] = await Promise.all([
    supabase
      .from("images")
      .select("id, url, created_datetime_utc, is_public")
      .order("created_datetime_utc", { ascending: false })
      .limit(5),
    supabase
      .from("captions")
      .select("id, content, created_datetime_utc, is_public, like_count")
      .order("created_datetime_utc", { ascending: false })
      .limit(5),
  ]);

  return {
    recentImages: recentImages.data ?? [],
    recentCaptions: recentCaptions.data ?? [],
  };
}

export default async function AdminHomePage() {
  const [counts, highlights] = await Promise.all([getCounts(), getHighlights()]);
  const publicRatio =
    counts.images === 0
      ? "0%"
      : `${Math.round((counts.publicImages / counts.images) * 100)}%`;

  return (
    <div className="space-y-12">
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-black/10 bg-white/85 p-8 shadow-lg">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Dashboard
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#151515]">
            Database pulse &amp; community momentum
          </h2>
          <p className="mt-4 text-base leading-7 text-[#6b5f57]">
            Track the content pipeline, keep an eye on activity spikes, and
            ensure only the best captions make the public feed.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Profiles", value: counts.profiles },
              { label: "Images", value: counts.images },
              { label: "Captions", value: counts.captions },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-black/10 bg-[#fef6f1] p-4"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-[#6b5f57]">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold text-[#151515]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-black/10 bg-[#101213] p-6 text-white shadow-lg">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            Quick Links
          </p>
          <div className="mt-6 space-y-4">
            {[
              { href: "/admin/profiles", label: "Review profiles" },
              { href: "/admin/images", label: "Manage images" },
              { href: "/admin/captions", label: "Audit captions" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-2xl border border-white/15 px-4 py-3 text-sm uppercase tracking-[0.2em] text-white/80 transition hover:border-white/40 hover:text-white"
              >
                {link.label}
                <span aria-hidden>-&gt;</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Public image ratio
            </p>
            <p className="mt-2 text-3xl font-semibold">{publicRatio}</p>
            <p className="mt-2 text-xs text-white/60">
              {counts.publicImages} of {counts.images} images visible.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            label: "Caption likes",
            value: counts.captionLikes,
            note: "All-time positive engagement",
          },
          {
            label: "Reports filed",
            value: counts.reports,
            note: "Pending moderation attention",
          },
          {
            label: "Public share rate",
            value: publicRatio,
            note: "Images currently visible",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
              {stat.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-[#151515]">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-[#6b5f57]">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md">
          <h3 className="text-lg font-semibold text-[#151515]">
            Recent image uploads
          </h3>
          <div className="mt-4 space-y-3">
            {highlights.recentImages.length === 0 ? (
              <p className="text-sm text-[#6b5f57]">No images yet.</p>
            ) : (
              highlights.recentImages.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#151515]">
                      {image.url || "Untitled image"}
                    </p>
                    <p className="text-xs text-[#6b5f57]">
                      {image.created_datetime_utc}
                    </p>
                  </div>
                  <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#6b5f57]">
                    {image.is_public ? "Public" : "Private"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md">
          <h3 className="text-lg font-semibold text-[#151515]">
            Latest captions
          </h3>
          <div className="mt-4 space-y-3">
            {highlights.recentCaptions.length === 0 ? (
              <p className="text-sm text-[#6b5f57]">No captions yet.</p>
            ) : (
              highlights.recentCaptions.map((caption) => (
                <div
                  key={caption.id}
                  className="rounded-2xl border border-black/10 bg-white p-3"
                >
                  <p className="text-sm font-semibold text-[#151515]">
                    {caption.content || "Untitled caption"}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-[#6b5f57]">
                    <span>{caption.created_datetime_utc}</span>
                    <span>{caption.like_count ?? 0} likes</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
