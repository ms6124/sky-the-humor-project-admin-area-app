export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-16 lg:flex-row lg:items-center lg:gap-16">
        <section className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/80 px-5 py-2 text-sm uppercase tracking-[0.25em] text-[#6b5f57] shadow-sm">
            Humor Project Admin
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-[#151515] sm:text-5xl">
            A spirited control room for captions, images, and the people behind
            them.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-[#6b5f57]">
            Explore real-time signals from the meme engine, curate image
            pipelines, and keep a close eye on the community that keeps the
            humor alive.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/login"
              className="rounded-full bg-[#151515] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#f9f4ef] transition hover:bg-[#2f2f2f]"
            >
              Enter Admin
            </a>
            <a
              href="/admin"
              className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
            >
              Dashboard Preview
            </a>
          </div>
        </section>
        <section className="flex-1">
          <div className="grid gap-5 rounded-3xl border border-black/10 bg-white/80 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                  Live Signals
                </p>
                <h2 className="text-2xl font-semibold text-[#151515]">
                  Today&apos;s Pulse
                </h2>
              </div>
              <div className="rounded-full bg-[#f47b4f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                Active
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "New captions", value: "128" },
                { label: "Fresh images", value: "42" },
                { label: "Reports", value: "3" },
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
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#6b5f57]">
                Focus Today
              </p>
              <p className="mt-2 text-sm leading-6 text-[#151515]">
                Review trending captions for public release and curate
                community-specific image sets to keep the feed lively.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
