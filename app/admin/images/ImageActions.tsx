"use client";

import { useRef } from "react";

type ImageRecord = {
  id: string;
  url: string | null;
  image_description: string | null;
  is_public: boolean | null;
  is_common_use: boolean | null;
};

type ImageActionsProps = {
  image: ImageRecord;
  updateImage: (formData: FormData) => Promise<void>;
  deleteImage: (formData: FormData) => Promise<void>;
};

export default function ImageActions({
  image,
  updateImage,
  deleteImage,
}: ImageActionsProps) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const closeDetails = () => {
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <details
      ref={detailsRef}
      className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4"
    >
      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.25em] text-[#151515]">
        Edit or delete
      </summary>
      <form
        action={updateImage}
        className="mt-4 grid gap-4 lg:grid-cols-2"
        onSubmit={closeDetails}
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

      <form action={deleteImage} className="mt-4" onSubmit={closeDetails}>
        <input type="hidden" name="id" value={image.id} />
        <button
          type="submit"
          className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-600 transition hover:border-red-500/70 hover:bg-red-50"
        >
          Delete image
        </button>
      </form>
    </details>
  );
}
