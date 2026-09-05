import { CheckCircle2, CircleDashed, LoaderCircle, PauseCircle } from "lucide-react";
import { STATUS_META } from "@/lib/constants";
import type { BuildStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const icons = {
  backlog: CircleDashed,
  progress: LoaderCircle,
  done: CheckCircle2,
  hold: PauseCircle,
};

const tones: Record<BuildStatus, string> = {
  Backlog: "border-zinc-400/30 bg-zinc-500/10 text-zinc-100",
  "In Progress": "border-amber-400/40 bg-amber-400/10 text-amber-100",
  Completed: "border-cyan-400/40 bg-cyan-400/10 text-cyan-100",
  "On Hold": "border-violet-300/40 bg-violet-400/10 text-violet-100",
};

export function StatusBadge({
  status,
  className,
}: {
  status: BuildStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  const Icon = icons[meta.icon];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        tones[status],
        className,
      )}
    >
      <Icon
        className={cn("size-3.5", status === "In Progress" && "animate-spin")}
        aria-hidden
      />
      {meta.label}
    </span>
  );
}
