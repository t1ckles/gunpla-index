import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { KitCard } from "@/components/catalog/kit-card";
import { KitModal } from "@/components/catalog/kit-modal";
import { GradeBadge } from "@/components/ui/grade-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCollection } from "@/context/collection-context";
import { SORT_LABELS } from "@/lib/constants";
import {
  BUILD_STATUSES,
  GRADES,
  type BuildStatus,
  type CollectionFilters,
  type Grade,
  type Kit,
  type SortOption,
} from "@/lib/types";
import { cn, sortKits, uniqueValues } from "@/lib/utils";

const initialFilters: CollectionFilters = {
  query: "",
  grades: [],
  series: [],
  statuses: [],
  sort: "alphabetical",
};

export function CatalogPage() {
  const { kits, ready } = useCollection();
  const [filters, setFilters] = useState<CollectionFilters>(initialFilters);
  const [selected, setSelected] = useState<Kit | null>(null);
  const seriesOptions = useMemo(() => uniqueValues(kits, "series"), [kits]);

  const visible = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const filtered = kits.filter((kit) => {
      const matchesQuery =
        !query ||
        [
          kit.kitName,
          kit.unitCode,
          kit.catalogNumber,
          kit.series,
          kit.timeline,
          kit.franchise,
          kit.notes,
          kit.gradeCode,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesGrade =
        filters.grades.length === 0 || filters.grades.includes(kit.grade);
      const matchesSeries =
        filters.series.length === 0 || filters.series.includes(kit.series);
      const matchesStatus =
        filters.statuses.length === 0 ||
        filters.statuses.includes(kit.buildStatus);
      return matchesQuery && matchesGrade && matchesSeries && matchesStatus;
    });
    return sortKits(filtered, filters.sort);
  }, [filters, kits]);

  function toggleValue<T>(list: T[], value: T) {
    return list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
  }

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
              Collection Catalog
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-[0.12em] text-white sm:text-5xl">
              HANGAR BAY
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Live catalog from <span className="text-zinc-200">GunPla Models.xlsx</span>.
              Filter by grade, series, or build status — badges use icons so status
              stays readable beyond color.
            </p>
          </div>
          <p className="font-mono text-sm text-zinc-500">
            {ready ? `${visible.length} / ${kits.length} displayed` : "Loading archive…"}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={filters.query}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, query: event.target.value }))
                }
                placeholder="Search kit name, unit code, catalog, series, notes…"
                className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950/60 pl-10 pr-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/60 px-3">
              <SlidersHorizontal className="size-4 text-zinc-500" />
              <select
                value={filters.sort}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    sort: event.target.value as SortOption,
                  }))
                }
                className="h-11 bg-transparent text-sm text-zinc-100 outline-none"
              >
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value} className="bg-zinc-950">
                    Sort: {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 space-y-3">
            <FilterRow label="Grade">
              {GRADES.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() =>
                    setFilters((current) => ({
                      ...current,
                      grades: toggleValue(current.grades, grade),
                    }))
                  }
                  className={cn(
                    "rounded-lg transition-opacity",
                    filters.grades.length && !filters.grades.includes(grade)
                      ? "opacity-40"
                      : "opacity-100",
                  )}
                >
                  <GradeBadge grade={grade as Grade} />
                </button>
              ))}
            </FilterRow>
            <FilterRow label="Status">
              {BUILD_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setFilters((current) => ({
                      ...current,
                      statuses: toggleValue(current.statuses, status),
                    }))
                  }
                  className={cn(
                    "rounded-full transition-opacity",
                    filters.statuses.length && !filters.statuses.includes(status)
                      ? "opacity-40"
                      : "opacity-100",
                  )}
                >
                  <StatusBadge status={status as BuildStatus} />
                </button>
              ))}
            </FilterRow>
            <FilterRow label="Series">
              {seriesOptions.map((series) => {
                const active = filters.series.includes(series);
                return (
                  <button
                    key={series}
                    type="button"
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        series: toggleValue(current.series, series),
                      }))
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em] transition-colors",
                      active
                        ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-100"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20",
                    )}
                  >
                    {series}
                  </button>
                );
              })}
            </FilterRow>
          </div>
        </div>
      </motion.section>

      <motion.section layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((kit) => (
            <KitCard key={kit.id} kit={kit} onSelect={setSelected} />
          ))}
        </AnimatePresence>
      </motion.section>

      {ready && visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center text-zinc-400">
          No kits match those filters. Clear a tag or add a new entry from Manage.
        </div>
      ) : null}

      <KitModal kit={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
