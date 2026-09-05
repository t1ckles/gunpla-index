import { ImageOff } from "lucide-react";
import type { Kit } from "@/lib/types";
import { cn, getKitTheme } from "@/lib/utils";

export function KitThumbnail({
  kit,
  src,
  className,
}: {
  kit: Kit;
  src?: string;
  className?: string;
}) {
  const theme = getKitTheme(kit);
  const image = src ?? kit.images[0];

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
          className="absolute inset-0 size-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 200 240"
            className="absolute inset-0 size-full opacity-80"
            aria-hidden
          >
            <path
              d="M100 28 L132 58 L148 118 L132 168 L100 208 L68 168 L52 118 L68 58 Z"
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="2"
            />
            <path
              d="M100 52 L118 72 L126 118 L118 156 L100 182 L82 156 L74 118 L82 72 Z"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.5"
            />
            <circle cx="100" cy="108" r="10" fill="rgba(34,211,238,0.7)" />
            <path
              d="M52 118 H20 M148 118 H180 M100 208 V232"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="font-mono text-lg tracking-[0.18em] text-white">
              {kit.unitCode || "NO CODE"}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
              <ImageOff className="size-3" />
              Add box art URL
            </p>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-white/5" />
    </div>
  );
}
