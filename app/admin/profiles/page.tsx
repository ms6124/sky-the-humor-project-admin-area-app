import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProfilesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, email, is_superadmin, is_matrix_admin, is_in_study, created_datetime_utc"
    )
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Profiles
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            User directory
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((profile) => (
              <tr key={profile.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-semibold text-[#151515]">
                  {profile.first_name || profile.last_name
                    ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
                    : "Unnamed"}
                </td>
                <td className="px-4 py-3 text-[#6b5f57]">
                  {profile.email ?? "No email"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[#6b5f57]">
                    {profile.is_superadmin && (
                      <span className="rounded-full border border-black/15 px-2 py-1">
                        Superadmin
                      </span>
                    )}
                    {profile.is_matrix_admin && (
                      <span className="rounded-full border border-black/15 px-2 py-1">
                        Matrix Admin
                      </span>
                    )}
                    {profile.is_in_study && (
                      <span className="rounded-full border border-black/15 px-2 py-1">
                        In Study
                      </span>
                    )}
                    {!profile.is_superadmin &&
                      !profile.is_matrix_admin &&
                      !profile.is_in_study && (
                        <span className="rounded-full border border-black/15 px-2 py-1">
                          Standard
                        </span>
                      )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#6b5f57]">
                  {profile.created_datetime_utc ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(profiles ?? []).length === 0 && (
          <p className="px-4 py-6 text-sm text-[#6b5f57]">
            No profiles found.
          </p>
        )}
      </div>
    </div>
  );
}
