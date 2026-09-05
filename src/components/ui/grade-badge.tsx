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
  showFullName = false,
  className,
}: {
  grade: Grade;
  code?: string;
  showFullName?: boolean;
  className?: string;
}) {
  const meta = GRADE_META[grade];
  const label = code && code !== "Other" ? code : grade;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] font-bold tracking-wider",
        tones[grade],
        className,
      )}
      title={meta.fullName}
    >
      <span className="grid size-3.5 place-items-center rounded-[2px] border border-current/50 text-[8px]">
        {meta.label.slice(0, 1)}
      </span>
      {label}
      {showFullName ? (
        <span className="font-sans font-medium tracking-normal text-current/80">
          {meta.fullName}
        </span>
      ) : null}
    </span>
  );
}
