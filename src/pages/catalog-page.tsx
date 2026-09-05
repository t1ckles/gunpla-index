import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { HangarPagination } from "@/components/catalog/hangar-pagination";
import { KitCard } from "@/components/catalog/kit-card";
import { KitModal } from "@/components/catalog/kit-modal";
import { ListsPanel } from "@/components/catalog/lists-panel";
import { SeriesFilter } from "@/components/catalog/series-filter";
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
  type SortOption,
} from "@/lib/types";
import { cn, sortKits } from "@/lib/utils";

const initialFilters: CollectionFilters = {
  query: "",
  grades: [],
  series: [],
  seriesQuery: "",
  timelines: [],
  statuses: [],
  listIds: [],
  sort: "alphabetical",
};

const PAGE_SIZE = 9;

export function CatalogPage() {
  const {
    kits,
    lists,
    ready,
    setKitStatus,
    createList,
    toggleKitInList,
    clearList,
    deleteList,
  } = useCollection();
  const [filters, setFilters] = useState<CollectionFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = kits.find((kit) => kit.id === selectedId) ?? null;

  const visible = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const seriesQuery = filters.seriesQuery.trim().toLowerCase();
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
      const matchesSeriesSearch =
        !seriesQuery ||
        kit.series.toLowerCase().includes(seriesQuery) ||
        kit.timeline.toLowerCase().includes(seriesQuery);
      const matchesGrade =
        filters.grades.length === 0 || filters.grades.includes(kit.grade);
      const matchesTimeline =
        filters.timelines.length === 0 ||
        filters.timelines.includes(kit.timeline);
      const matchesStatus =
        filters.statuses.length === 0 ||
        filters.statuses.includes(kit.buildStatus);
      const matchesLists =
        filters.listIds.length === 0 ||
        filters.listIds.some((listId) =>
          lists.find((list) => list.id === listId)?.kitIds.includes(kit.id),
        );
      return (
        matchesQuery &&
        matchesSeriesSearch &&
        matchesGrade &&
        matchesTimeline &&
        matchesStatus &&
        matchesLists
      );
    });
    return sortKits(filtered, filters.sort);
  }, [filters, kits, lists]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageKits = visible.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  function goToPage(next: number) {
    setPage(Math.min(pageCount, Math.max(1, next)));
    document.getElementById("hangar-grid")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

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

          <div className="mt-5 space-y-5">
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
            <ListsPanel
              lists={lists}
              selectedListIds={filters.listIds}
              onToggleList={(listId) =>
                setFilters((current) => ({
                  ...current,
                  listIds: toggleValue(current.listIds, listId),
                }))
              }
              onCreate={createList}
              onClear={clearList}
              onDelete={(listId) => {
                deleteList(listId);
                setFilters((current) => ({
                  ...current,
                  listIds: current.listIds.filter((id) => id !== listId),
                }));
              }}
            />
            <SeriesFilter
              kits={kits}
              seriesQuery={filters.seriesQuery}
              selectedTimelines={filters.timelines}
              onSeriesQueryChange={(seriesQuery) =>
                setFilters((current) => ({ ...current, seriesQuery }))
              }
              onToggleTimeline={(timeline) =>
                setFilters((current) => ({
                  ...current,
                  timelines: toggleValue(current.timelines, timeline),
                }))
              }
              onClear={() =>
                setFilters((current) => ({
                  ...current,
                  seriesQuery: "",
                  timelines: [],
                }))
              }
            />
          </div>
        </div>
      </motion.section>

      {visible.length > 0 ? (
        <div id="hangar-grid" className="space-y-5">
          <HangarPagination
            page={currentPage}
            pageCount={pageCount}
            total={visible.length}
            pageSize={PAGE_SIZE}
            onPageChange={goToPage}
          />
          <AnimatePresence mode="wait">
            <motion.section
              key={currentPage}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {pageKits.map((kit) => (
                <KitCard
                  key={kit.id}
                  kit={kit}
                  lists={lists}
                  onSelect={(next) => setSelectedId(next.id)}
                  onStatusChange={(status) => setKitStatus(kit.id, status)}
                  onToggleList={(listId) => toggleKitInList(listId, kit.id)}
                />
              ))}
            </motion.section>
          </AnimatePresence>
          {pageCount > 1 ? (
            <HangarPagination
              page={currentPage}
              pageCount={pageCount}
              total={visible.length}
              pageSize={PAGE_SIZE}
              onPageChange={goToPage}
            />
          ) : null}
        </div>
      ) : null}

      {ready && visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center text-zinc-400">
          No kits match those filters. Clear a tag or add a new entry from Manage.
        </div>
      ) : null}

      <KitModal
        kit={selected}
        lists={lists}
        onClose={() => setSelectedId(null)}
        onStatusChange={(status) => {
          if (selected) setKitStatus(selected.id, status);
        }}
        onToggleList={(listId) => {
          if (selected) toggleKitInList(listId, selected.id);
        }}
      />
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
