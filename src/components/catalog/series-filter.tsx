import { Search } from "lucide-react";
import { useMemo } from "react";
import type { Kit } from "@/lib/types";
import {
  cn,
  groupSeriesByTimeline,
  timelineCode,
  timelineTitle,
} from "@/lib/utils";

export function SeriesFilter({
  kits,
  seriesQuery,
  selectedTimelines,
  onSeriesQueryChange,
  onToggleTimeline,
  onClear,
}: {
  kits: Kit[];
  seriesQuery: string;
  selectedTimelines: string[];
  onSeriesQueryChange: (value: string) => void;
  onToggleTimeline: (timeline: string) => void;
  onClear: () => void;
}) {
  const groups = useMemo(() => groupSeriesByTimeline(kits), [kits]);
  const active = selectedTimelines.length > 0 || seriesQuery.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Universe
          </p>
          {active ? (
            <button
              type="button"
              onClick={onClear}
              className="text-[11px] uppercase tracking-[0.16em] text-cyan-300 hover:text-cyan-100"
            >
              Clear universe filters
            </button>
          ) : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const selected = selectedTimelines.includes(group.timeline);
            return (
              <button
                key={group.timeline}
                type="button"
                onClick={() => onToggleTimeline(group.timeline)}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                  selected
                    ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-50"
                    : "border-white/10 bg-zinc-950/40 text-zinc-200 hover:border-white/20",
                )}
              >
                <span>
                  <span className="block font-mono text-[10px] tracking-[0.18em] text-cyan-200">
                    {timelineCode(group.timeline)}
                  </span>
                  <span className="block text-sm">{timelineTitle(group.timeline)}</span>
                </span>
                <span className="font-mono text-xs text-zinc-400">{group.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          Search
        </span>
        <span className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={seriesQuery}
            onChange={(event) => onSeriesQueryChange(event.target.value)}
            placeholder="Filter by series name…"
            className="h-10 w-full rounded-xl border border-white/10 bg-zinc-950/60 pl-10 pr-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/50"
          />
        </span>
      </label>
    </div>
  );
}
