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

export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96) || "kit"
  );
}
