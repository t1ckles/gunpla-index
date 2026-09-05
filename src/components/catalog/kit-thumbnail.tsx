import { ImageOff } from "lucide-react";
import type { Kit } from "@/lib/types";
import { cn, getKitTheme } from "@/lib/utils";

export function KitThumbnail({
  kit,
  src,
  className,
  variant = "card",
}: {
  kit: Kit;
  src?: string;
  className?: string;
  variant?: "card" | "gallery" | "thumb";
}) {
  const theme = getKitTheme(kit);
  const image = src ?? kit.images[0];
  const frame =
    variant === "gallery"
      ? "px-8 py-6"
      : variant === "thumb"
        ? "p-1.5"
        : "px-5 pt-10 pb-[5.75rem]";

  return (
    <div
      className={cn("relative overflow-hidden bg-zinc-950", className)}
      style={{
        backgroundImage: `linear-gradient(145deg, ${theme.from}, ${theme.to})`,
        boxShadow: `inset 0 0 80px ${theme.glow}`,
      }}
    >
      {image ? (
        <img
          src={image}
          alt={`${kit.kitName} thumbnail`}
          className={cn(
            "absolute inset-0 size-full object-contain object-center",
            frame,
          )}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 200 240"
            className="absolute inset-0 size-full opacity-90"
            aria-hidden
          >
            <defs>
              <pattern
                id={`hangar-grid-${kit.id}`}
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M16 0 H0 V16"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="200" height="240" fill={`url(#hangar-grid-${kit.id})`} />
            <path
              d="M20 210 L100 170 L180 210"
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1"
            />
            <path
              d="M40 210 L100 182 L160 210"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            <rect
              x="58"
              y="118"
              width="84"
              height="52"
              rx="3"
              fill="rgba(9,9,11,0.45)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.5"
            />
            <path
              d="M70 118 V108 H130 V118"
              fill="none"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1.5"
            />
            <rect x="66" y="128" width="68" height="8" fill="rgba(34,211,238,0.18)" />
            <rect x="74" y="144" width="20" height="12" fill="rgba(255,255,255,0.08)" />
            <rect x="106" y="144" width="20" height="12" fill="rgba(255,255,255,0.08)" />
            <path
              d="M24 28 H48 M24 28 V52 M152 28 H176 M176 28 V52 M24 188 V212 H48 M176 188 V212 H152"
              fill="none"
              stroke="rgba(34,211,238,0.45)"
              strokeWidth="1.5"
            />
          </svg>
          <div className="absolute inset-x-0 top-6 px-5 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-200/80">
              Hangar slot
            </p>
            <p className="mt-2 font-mono text-lg tracking-[0.14em] text-white">
              {kit.unitCode || "NO CODE"}
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
            <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
              <ImageOff className="size-3" />
              Awaiting box art
            </p>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-white/5" />
    </div>
  );
}
