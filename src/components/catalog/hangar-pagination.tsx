import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HangarPagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="glass-card flex flex-col gap-3 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300">
          Hangar deck
        </p>
        <p className="mt-1 font-display text-lg tracking-[0.16em] text-white">
          BAY {String(page).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}
        </p>
        <p className="font-mono text-xs text-zinc-500">
          {start}–{end} of {total}
        </p>
      </div>

      <nav aria-label="Hangar pages" className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-10 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-xs uppercase tracking-[0.14em] text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
          Prev
        </button>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: pageCount }, (_, index) => {
            const value = index + 1;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onPageChange(value)}
                aria-current={value === page ? "page" : undefined}
                className={cn(
                  "grid h-10 min-w-10 place-items-center rounded-lg border font-mono text-sm",
                  value === page
                    ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.18)]"
                    : "border-white/10 bg-zinc-950/50 text-zinc-400 hover:border-white/20 hover:text-white",
                )}
              >
                {String(value).padStart(2, "0")}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className="inline-flex h-10 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-xs uppercase tracking-[0.14em] text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  );
}
