import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createAllowedDomain, deleteAllowedDomain, updateAllowedDomain } from "./actions";

export const dynamic = "force-dynamic";

export default async function AllowedSignupDomainsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: domains } = await supabase
    .from("allowed_signup_domains")
    .select("id, apex_domain, created_datetime_utc")
    .order("created_datetime_utc", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Allowed signup domains
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Domain allowlist
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
          Add a domain
        </h3>
        <form action={createAllowedDomain} className="mt-4 flex flex-wrap gap-4">
          <input
            name="apex_domain"
            className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#151515]"
            placeholder="example.edu"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-[#151515] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f9f4ef] transition hover:bg-[#2f2f2f]"
          >
            Add domain
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {(domains ?? []).map((domain) => (
          <article
            key={domain.id}
            className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                  Domain ID {domain.id}
                </p>
                <p className="mt-2 text-lg font-semibold text-[#151515]">
                  {domain.apex_domain}
                </p>
                <p className="mt-1 text-xs text-[#6b5f57]">
                  Created: {domain.created_datetime_utc ?? "N/A"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <form action={updateAllowedDomain} className="flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={domain.id} />
                  <input
                    name="apex_domain"
                    defaultValue={domain.apex_domain ?? ""}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs text-[#151515]"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
                  >
                    Save
                  </button>
                </form>
                <form action={deleteAllowedDomain}>
                  <input type="hidden" name="id" value={domain.id} />
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
        {(domains ?? []).length === 0 && (
          <p className="text-sm text-[#6b5f57]">No domains found.</p>
        )}
      </section>
    </div>
  );
}
