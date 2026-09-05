import { motion } from "framer-motion";
import { Hash, Palette, Ruler } from "lucide-react";
import { GradeBadge } from "@/components/ui/grade-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Kit } from "@/lib/types";
import { KitThumbnail } from "./kit-thumbnail";

export function KitCard({
  kit,
  onSelect,
}: {
  kit: Kit;
  onSelect: (kit: Kit) => void;
}) {
  return (
    <motion.button
      layout
      type="button"
      onClick={() => onSelect(kit)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="group glass-card relative w-full overflow-hidden rounded-2xl text-left"
    >
      <KitThumbnail kit={kit} className="aspect-[4/5]" />
      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
        <GradeBadge grade={kit.grade} code={kit.gradeCode} />
        <span className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-black/45 px-2 py-1 font-mono text-[11px] text-zinc-100 backdrop-blur">
          <Ruler className="size-3" />
          {kit.scale}
        </span>
      </div>
      <div className="absolute right-3 top-3">
        <StatusBadge status={kit.buildStatus} />
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
    </motion.button>
  );
}
