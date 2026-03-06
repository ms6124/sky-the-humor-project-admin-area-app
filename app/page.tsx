export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-4xl flex-col items-start gap-8 px-6 pb-24 pt-20">
        <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/80 px-5 py-2 text-sm uppercase tracking-[0.25em] text-[#6b5f57] shadow-sm">
          Humor Project Admin
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-[#151515] sm:text-5xl">
          A quiet control room for captions, images, and the community behind
          them.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[#6b5f57]">
          Sign in to review content, manage uploads, and monitor the humor
          pipeline.
        </p>
        <a
          href="/login"
          className="rounded-full bg-[#151515] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#f9f4ef] transition hover:bg-[#2f2f2f]"
        >
          Enter Admin
        </a>
      </main>
    </div>
  );
}
