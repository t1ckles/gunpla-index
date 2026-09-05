import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FRANCHISE_THEMES } from "./constants";
import type { BuildStatus, Kit, SortOption } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

const STATUS_RANK: Record<BuildStatus, number> = {
  Backlog: 0,
  "In Progress": 1,
  "On Hold": 2,
  Completed: 3,
};

export function sortKits(kits: Kit[], sort: SortOption) {
  const copy = [...kits];
  switch (sort) {
    case "alphabetical":
      return copy.sort((a, b) => a.kitName.localeCompare(b.kitName));
    case "grade":
      return copy.sort(
        (a, b) =>
          a.grade.localeCompare(b.grade) ||
          a.gradeCode.localeCompare(b.gradeCode),
      );
    case "buildStatus":
      return copy.sort(
        (a, b) => STATUS_RANK[a.buildStatus] - STATUS_RANK[b.buildStatus],
      );
    case "series":
      return copy.sort((a, b) => a.series.localeCompare(b.series));
    case "catalog":
      return copy.sort((a, b) =>
        a.catalogNumber.localeCompare(b.catalogNumber, undefined, {
          numeric: true,
        }),
      );
    default:
      return copy;
  }
}

export function uniqueValues(kits: Kit[], key: keyof Kit) {
  return [
    ...new Set(
      kits
        .map((kit) => String(kit[key] ?? "").trim())
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

export function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `kit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyLore() {
  return {
    manufacturer: "",
    pilot: "",
    powerOutput: "",
    signatureWeapons: [],
    background: "",
  };
}

export function parseImageList(value: string) {
  return value
    .split(/[\n,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getKitTheme(kit: Pick<Kit, "series" | "timeline">) {
  return (
    FRANCHISE_THEMES[kit.series] ??
    FRANCHISE_THEMES[kit.timeline] ??
    FRANCHISE_THEMES.default
  );
}

export function kitIdentityKey(kit: Pick<Kit, "catalogNumber" | "unitCode" | "kitName">) {
  return [kit.catalogNumber, kit.unitCode, kit.kitName]
    .map((value) => value.trim().toLowerCase())
    .join("|");
}

export function inferTimeline(series: string, timeline = "") {
  const explicit = timeline.trim();
  if (explicit) {
    if (/gundam wing/i.test(series) && /cosmic era/i.test(explicit)) {
      return "After Colony (AC)";
    }
    return explicit;
  }

  const exact: Record<string, string> = {
    "Mobile Suit Gundam": "Universal Century (UC)",
    "Mobile Suit Zeta Gundam": "Universal Century (UC)",
    "Mobile Suit Gundam 0083: Stardust Memory": "Universal Century (UC)",
    "Mobile Suit Gundam 0083": "Universal Century (UC)",
    "Mobile Suit Gundam: The 08th MS Team": "Universal Century (UC)",
    "Mobile Suit Gundam F91": "Universal Century (UC)",
    "Mobile Suit Gundam UC": "Universal Century (UC)",
    "Mobile Suit Victory Gundam": "Universal Century (UC)",
    "Mobile Suit Gundam Wing": "After Colony (AC)",
    "Mobile Suit Gundam Wing: Endless Waltz": "After Colony (AC)",
    "Mobile Suit Gundam Wing: EW": "After Colony (AC)",
    "Mobile Suit Gundam SEED": "Cosmic Era (CE)",
    "Mobile Suit Gundam SEED DESTINY": "Cosmic Era (CE)",
    "Mobile Suit Gundam 00": "Anno Domini (AD)",
    "Mobile Suit Gundam IRON-BLOODED ORPHANS": "Post Disaster (PD)",
    "IRON-BLOODED ORPHANS": "Post Disaster (PD)",
    "Mobile Suit Gundam: The Witch from Mercury": "Ad Stella (AS)",
    "The Witch from Mercury": "Ad Stella (AS)",
    "Mobile Suit Gundam: Requiem for Vengeance": "Universal Century (UC)",
    "Requiem for Vengeance": "Universal Century (UC)",
    "Mobile Suit Gundam: Char's Counterattack": "Universal Century (UC)",
    "Mobile Suit Gundam AGE": "Advanced Generation (AG)",
    "Gundam Reconguista in G": "Regild Century (RC)",
    "Mobile Suit Gundam GQuuuuuuX": "Universal Century (Alternate)",
  };
  if (exact[series]) return exact[series];

  const haystack = series.toLowerCase();
  if (haystack.includes("witch from mercury")) return "Ad Stella (AS)";
  if (haystack.includes("gquuuuux")) return "Universal Century (Alternate)";
  if (haystack.includes("reconguista")) return "Regild Century (RC)";
  if (/\bage\b/.test(haystack)) return "Advanced Generation (AG)";
  if (haystack.includes("wing")) return "After Colony (AC)";
  if (haystack.includes("seed")) return "Cosmic Era (CE)";
  if (haystack.includes("iron-blooded") || haystack.includes("orphans")) {
    return "Post Disaster (PD)";
  }
  if (haystack.includes("macross")) return "Macross";
  if (haystack.includes("star wars")) return "Star Wars Universe";
  if (haystack.includes("armored core")) return "Rubicon 3";
  if (haystack.includes("30 minutes")) return "30MM Universe";
  if (
    haystack.includes("gundam") ||
    haystack.includes("zeta") ||
    haystack.includes("unicorn")
  ) {
    return "Universal Century (UC)";
  }
  return "";
}

export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96) || "kit"
  );
}

const SERIES_SHORT_NAMES: Record<string, string> = {
  "Mobile Suit Gundam": "Mobile Suit Gundam",
  "Mobile Suit Gundam / 0080": "0080",
  "Mobile Suit Gundam F91": "F91",
  "Mobile Suit Gundam 00": "Gundam 00",
  "Mobile Suit Gundam 0083": "0083",
  "Mobile Suit Gundam: The 08th MS Team": "08th MS Team",
  "Mobile Suit Gundam Wing: EW": "Wing: Endless Waltz",
  "Mobile Suit Gundam Wing": "Gundam Wing",
  "Mobile Suit Gundam SEED": "SEED",
  "Mobile Suit Gundam SEED DESTINY": "SEED DESTINY",
  "Mobile Suit Gundam SEED ASTRAY": "SEED ASTRAY",
  "Mobile Suit Gundam SEED MSV": "SEED MSV",
  "Mobile Suit Gundam UC": "Unicorn",
  "Mobile Suit Zeta Gundam": "Zeta Gundam",
  "Mobile Suit Victory Gundam": "Victory Gundam",
  "Mobile Suit Gundam Thunderbolt": "Thunderbolt",
  "Mobile Suit Crossbone Gundam": "Crossbone Gundam",
  "Gundam Reconguista in G": "Reconguista in G",
  "IRON-BLOODED ORPHANS": "Iron-Blooded Orphans",
  "The Witch from Mercury": "Witch from Mercury",
  "Mobile Suit Gundam: The Witch from Mercury": "Witch from Mercury",
  "Mobile Suit Gundam 0083: Stardust Memory": "0083",
  "Mobile Suit Gundam Wing: Endless Waltz": "Wing: Endless Waltz",
  "Mobile Suit Gundam IRON-BLOODED ORPHANS": "Iron-Blooded Orphans",
  "Mobile Suit Gundam: Requiem for Vengeance": "Requiem for Vengeance",
  "Mobile Suit Gundam GQuuuuuuX": "GQuuuuuuX",
  "Mobile Suit Gundam AGE": "Gundam AGE",
  "Mobile Suit Gundam: Char's Counterattack": "Char's Counterattack",
  "Requiem for Vengeance": "Requiem for Vengeance",
  "Armored Core VI: Fires of Rubicon": "Armored Core VI",
  "30 Minutes Missions": "30 Minutes Missions",
  "Super Dimension Fortress Macross": "SDF Macross",
  "Macross Plus": "Macross Plus",
  "Star Wars": "Star Wars",
};

export function shortSeriesName(series: string) {
  if (SERIES_SHORT_NAMES[series]) return SERIES_SHORT_NAMES[series];
  return series
    .replace(/^Mobile Suit Gundam(?::\s*|\s+\/\s+|\s+)/i, "")
    .replace(/^Mobile Suit\s+/i, "")
    .trim() || series;
}

export function timelineCode(timeline: string) {
  return timeline.match(/\(([^)]+)\)/)?.[1] ?? timeline;
}

export function timelineTitle(timeline: string) {
  return timeline.replace(/\s*\([^)]+\)\s*$/, "").trim() || timeline;
}

export function groupSeriesByTimeline(kits: Kit[]) {
  const groups = new Map<string, Map<string, number>>();
  kits.forEach((kit) => {
    const timeline = kit.timeline || "Unlisted";
    const series = kit.series || "Untitled series";
    if (!groups.has(timeline)) groups.set(timeline, new Map());
    const seriesCounts = groups.get(timeline)!;
    seriesCounts.set(series, (seriesCounts.get(series) ?? 0) + 1);
  });

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([timeline, seriesCounts]) => ({
      timeline,
      count: [...seriesCounts.values()].reduce((sum, value) => sum + value, 0),
      series: [...seriesCounts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => shortSeriesName(a.name).localeCompare(shortSeriesName(b.name))),
    }));
}
