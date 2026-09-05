import { motion } from "framer-motion";
import { Hash, Palette, Ruler } from "lucide-react";
import { GradeBadge } from "@/components/ui/grade-badge";
import { StatusSelect } from "@/components/ui/status-select";
import type { BuildStatus, CustomList, Kit } from "@/lib/types";
import { cn } from "@/lib/utils";
import { KitThumbnail } from "./kit-thumbnail";

export function KitCard({
  kit,
  lists,
  onSelect,
  onStatusChange,
  onToggleList,
}: {
  kit: Kit;
  lists: CustomList[];
  onSelect: (kit: Kit) => void;
  onStatusChange: (status: BuildStatus) => void;
  onToggleList: (listId: string) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="group glass-card overflow-hidden rounded-2xl"
    >
      <button
        type="button"
        onClick={() => onSelect(kit)}
        className="relative block w-full text-left"
      >
        <KitThumbnail kit={kit} className="aspect-[4/5]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <GradeBadge grade={kit.grade} code={kit.gradeCode} compact />
          <span className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-black/45 px-2 py-1 font-mono text-[11px] text-zinc-100 backdrop-blur">
            <Ruler className="size-3" />
            {kit.scale}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-4">
          <p className="font-mono text-xs tracking-[0.22em] text-cyan-200">
            {kit.unitCode || "UNREGISTERED"}
          </p>
          <h3 className="font-display text-xl leading-tight text-white">
            {kit.kitName}
          </h3>
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-xs uppercase tracking-[0.16em] text-zinc-300">
              {kit.series}
            </p>
            {kit.customPaint ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-100">
                <Palette className="size-3" />
                Custom
              </span>
            ) : null}
          </div>
          {kit.catalogNumber ? (
            <p className="flex items-center gap-1 font-mono text-[10px] tracking-wider text-zinc-400">
              <Hash className="size-3" />
              {kit.catalogNumber}
            </p>
          ) : null}
        </div>
      </button>

      <div className="space-y-2 border-t border-white/10 p-3">
        <StatusSelect value={kit.buildStatus} onChange={onStatusChange} />
        {lists.length ? (
          <div className="flex flex-wrap gap-1.5">
            {lists.map((list) => {
              const active = list.kitIds.includes(kit.id);
              return (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => onToggleList(list.id)}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider",
                    active
                      ? "border-amber-300/40 bg-amber-400/15 text-amber-100"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-200",
                  )}
                >
                  {list.name}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
