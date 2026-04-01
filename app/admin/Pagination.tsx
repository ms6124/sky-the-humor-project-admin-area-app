type PaginationProps = {
  currentPage: number;
  totalPages: number;
  previousHref?: string;
  nextHref?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  previousHref,
  nextHref,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-black/10 bg-white/85 px-4 py-3 text-xs uppercase tracking-[0.25em] text-[#6b5f57] shadow-md">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex flex-wrap gap-2">
        {previousHref ? (
          <a
            href={previousHref}
            className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
          >
            Previous
          </a>
        ) : (
          <span className="cursor-not-allowed rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#6b5f57]/60">
            Previous
          </span>
        )}
        {nextHref ? (
          <a
            href={nextHref}
            className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
          >
            Next
          </a>
        ) : (
          <span className="cursor-not-allowed rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#6b5f57]/60">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
