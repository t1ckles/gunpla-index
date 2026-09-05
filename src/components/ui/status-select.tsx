import { BUILD_STATUSES, type BuildStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusSelect({
  value,
  onChange,
  className,
}: {
  value: BuildStatus;
  onChange: (status: BuildStatus) => void;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="sr-only">Build status</span>
      <select
        value={value}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => {
          event.stopPropagation();
          onChange(event.target.value as BuildStatus);
        }}
        className="h-9 w-full rounded-lg border border-white/15 bg-zinc-950/80 px-2 text-xs text-zinc-100 outline-none focus:border-cyan-400/50"
      >
        {BUILD_STATUSES.map((status) => (
          <option key={status} value={status} className="bg-zinc-950">
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}
