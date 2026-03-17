import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createWhitelistedEmail,
  deleteWhitelistedEmail,
  updateWhitelistedEmail,
} from "./actions";

export const dynamic = "force-dynamic";

const WHITELIST_TABLE = "whitelist_email_addresses";
const WHITELIST_FIELD = "email_address";

export default async function WhitelistedEmailsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: emails } = await supabase
    .from(WHITELIST_TABLE)
    .select(`id, ${WHITELIST_FIELD}, created_datetime_utc, modified_datetime_utc`)
    .order("created_datetime_utc", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Whitelisted emails
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Email allowlist
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
          Add an email
        </h3>
        <form action={createWhitelistedEmail} className="mt-4 flex flex-wrap gap-4">
          <input
            name="email_address"
            type="email"
            className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
            placeholder="user@example.com"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-[#151515] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f9f4ef] transition hover:bg-[#2f2f2f]"
          >
            Add email
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {(emails ?? []).map((entry) => (
          <article
            key={entry.id}
            className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                  Entry ID {entry.id}
                </p>
                <p className="mt-2 text-lg font-semibold text-[#151515]">
                  {entry[WHITELIST_FIELD]}
                </p>
                <p className="mt-1 text-xs text-[#6b5f57]">
                  Created: {entry.created_datetime_utc ?? "N/A"}
                </p>
                <p className="mt-1 text-xs text-[#6b5f57]">
                  Updated: {entry.modified_datetime_utc ?? "N/A"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <form action={updateWhitelistedEmail} className="flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={entry.id} />
                  <input
                    name="email_address"
                    defaultValue={entry[WHITELIST_FIELD] ?? ""}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs text-[#151515]"
                    type="email"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
                  >
                    Save
                  </button>
                </form>
                <form action={deleteWhitelistedEmail}>
                  <input type="hidden" name="id" value={entry.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-600 transition hover:border-red-500/70 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
        {(emails ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">No whitelisted emails found.</p>
        )}
      </section>
    </div>
  );
}
