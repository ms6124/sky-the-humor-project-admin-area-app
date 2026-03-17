import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import SignOutButton from "./SignOutButton";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminCheck = await requireAdmin();

  if (!adminCheck.ok) {
    if (adminCheck.reason === "unauthenticated") {
      redirect("/login");
    }
    redirect("/denied");
  }

  const displayName =
    adminCheck.profile.first_name || adminCheck.profile.last_name
      ? `${adminCheck.profile.first_name ?? ""} ${adminCheck.profile.last_name ?? ""}`.trim()
      : adminCheck.profile.email ?? "Superadmin";

  return (
    <div className="min-h-screen text-[#151515]">
      <header className="sticky top-0 z-10 border-b border-black/10 bg-[#101213]">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              Humor Project
            </p>
            <h1 className="text-xl font-semibold">Admin Deck</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="rounded-full border border-white/20 px-4 py-2">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/60">
                Signed in
              </p>
              <p className="text-sm font-semibold text-white">{displayName}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
