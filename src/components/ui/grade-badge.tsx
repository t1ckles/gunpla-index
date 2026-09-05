import { GRADE_META } from "@/lib/constants";
import type { Grade } from "@/lib/types";
import { cn } from "@/lib/utils";

const tones: Record<Grade, string> = {
  EG: "border-teal-300/40 bg-teal-400/10 text-teal-100",
  HG: "border-cyan-300/40 bg-cyan-400/10 text-cyan-100",
  RG: "border-sky-300/40 bg-sky-400/10 text-sky-100",
  MG: "border-amber-300/40 bg-amber-400/10 text-amber-100",
  PG: "border-violet-300/40 bg-violet-400/10 text-violet-100",
  SD: "border-rose-300/40 bg-rose-400/10 text-rose-100",
  "RE/100": "border-orange-300/40 bg-orange-400/10 text-orange-100",
  FM: "border-lime-300/40 bg-lime-400/10 text-lime-100",
  "30MM": "border-emerald-300/40 bg-emerald-400/10 text-emerald-100",
  Other: "border-zinc-400/30 bg-zinc-500/10 text-zinc-100",
};

export function GradeBadge({
  grade,
  code,
  compact = false,
  className,
}: {
  grade: Grade;
  code?: string;
  compact?: boolean;
  className?: string;
}) {
  const meta = GRADE_META[grade];
  const codeLabel = code && code !== "Other" ? code : grade;
  const label =
    grade === "Other" && (!code || code === "Other")
      ? "Other Line"
      : `${meta.fullName} (${codeLabel})`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-semibold tracking-wide",
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        tones[grade],
        className,
      )}
      title={label}
    >
      <span
        className={cn(
          "grid place-items-center rounded-[2px] border border-current/50 font-mono",
          compact ? "size-3 text-[7px]" : "size-3.5 text-[8px]",
        )}
      >
        {meta.label.slice(0, 1)}
      </span>
      <span className="font-sans">{label}</span>
    </span>
  );
}
