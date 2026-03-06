export default function DeniedPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
          Access Restricted
        </p>
        <h1 className="text-3xl font-semibold text-[#151515] sm:text-4xl">
          This admin area is reserved for superadmins.
        </h1>
        <p className="max-w-xl text-base leading-7 text-[#6b5f57]">
          If you believe you should have access, ask an existing superadmin to
          grant it in Supabase or update your profile.
        </p>
        <a
          href="/login"
          className="rounded-full border border-black/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
        >
          Back to login
        </a>
      </main>
    </div>
  );
}
