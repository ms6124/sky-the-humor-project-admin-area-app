import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createImage, deleteImage, updateImage } from "./actions";

export const dynamic = "force-dynamic";

export default async function ImagesPage() {
  const supabase = createSupabaseAdminClient();
  const { data: images } = await supabase
    .from("images")
    .select(
      "id, url, image_description, is_public, is_common_use, created_datetime_utc, profile_id"
    )
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Images
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Image management
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
          Add a new image
        </h3>
        <form action={createImage} className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="text-sm text-[#6b5f57]">
            Image URL
            <input
              name="url"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              placeholder="https://..."
            />
          </label>
          <label className="text-sm text-[#6b5f57]">
            Profile ID (optional)
            <input
              name="profile_id"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              placeholder="uuid"
            />
          </label>
          <label className="text-sm text-[#6b5f57] lg:col-span-2">
            Image description
            <textarea
              name="image_description"
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
              rows={3}
              placeholder="Describe what is happening in the image."
            />
          </label>
          <div className="flex flex-wrap gap-4 text-sm text-[#6b5f57]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_public"
                className="h-4 w-4 rounded border-black/20"
              />
              Public
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_common_use"
                className="h-4 w-4 rounded border-black/20"
              />
              Common use
            </label>
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#151515] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f9f4ef] transition hover:bg-[#2f2f2f]"
          >
            Create image
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {(images ?? []).map((image) => (
          <article
            key={image.id}
            className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                  {image.created_datetime_utc ?? "No timestamp"}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#151515]">
                  {image.url || "Untitled image"}
                </h3>
                <p className="mt-2 text-xs text-[#6b5f57]">
                  Profile: {image.profile_id ?? "N/A"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[#6b5f57]">
                <span className="rounded-full border border-black/15 px-2 py-1">
                  {image.is_public ? "Public" : "Private"}
                </span>
                <span className="rounded-full border border-black/15 px-2 py-1">
                  {image.is_common_use ? "Common" : "Single-use"}
                </span>
              </div>
            </div>

            <form
              action={updateImage}
              className="mt-4 grid gap-4 lg:grid-cols-2"
            >
              <input type="hidden" name="id" value={image.id} />
              <label className="text-sm text-[#6b5f57]">
                Image URL
                <input
                  name="url"
                  defaultValue={image.url ?? ""}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                />
              </label>
              <label className="text-sm text-[#6b5f57] lg:col-span-2">
                Image description
                <textarea
                  name="image_description"
                  defaultValue={image.image_description ?? ""}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
                  rows={2}
                />
              </label>
              <div className="flex flex-wrap gap-4 text-sm text-[#6b5f57]">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_public"
                    defaultChecked={image.is_public ?? false}
                    className="h-4 w-4 rounded border-black/20"
                  />
                  Public
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_common_use"
                    defaultChecked={image.is_common_use ?? false}
                    className="h-4 w-4 rounded border-black/20"
                  />
                  Common use
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
                >
                  Save changes
                </button>
              </div>
            </form>

            <form action={deleteImage} className="mt-4">
              <input type="hidden" name="id" value={image.id} />
              <button
                type="submit"
                className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-600 transition hover:border-red-500/70 hover:bg-red-50"
              >
                Delete image
              </button>
            </form>
          </article>
        ))}
        {(images ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">No images found.</p>
        )}
      </section>
    </div>
  );
}
