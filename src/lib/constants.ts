import type { BuildStatus, Grade, SortOption } from "./types";

export const STORAGE_KEY = "ms-index.collection.v2";

export const GRADE_META: Record<
  Grade,
  { label: string; fullName: string }
> = {
  EG: { label: "EG", fullName: "Entry Grade" },
  HG: { label: "HG", fullName: "High Grade" },
  RG: { label: "RG", fullName: "Real Grade" },
  MG: { label: "MG", fullName: "Master Grade" },
  PG: { label: "PG", fullName: "Perfect Grade" },
  SD: { label: "SD", fullName: "Super Deformed" },
  "RE/100": { label: "RE", fullName: "Reborn 100" },
  FM: { label: "FM", fullName: "Full Mechanics" },
  "30MM": { label: "30", fullName: "30 Minutes Missions" },
  Other: { label: "OT", fullName: "Other Line" },
};

export const STATUS_META: Record<
  BuildStatus,
  { label: string; icon: "backlog" | "progress" | "done" | "hold" }
> = {
  Backlog: { label: "Backlog", icon: "backlog" },
  "In Progress": { label: "In Progress", icon: "progress" },
  Completed: { label: "Completed", icon: "done" },
  "On Hold": { label: "On Hold", icon: "hold" },
};

export const SORT_LABELS: Record<SortOption, string> = {
  alphabetical: "Alphabetical",
  grade: "Grade",
  buildStatus: "Build Status",
  series: "Series",
  catalog: "Catalog Number",
};

export const FRANCHISE_THEMES: Record<
  string,
  { from: string; to: string; glow: string }
> = {
  "Mobile Suit Gundam": {
    from: "#0f766e",
    to: "#155e75",
    glow: "rgba(34,211,238,0.35)",
  },
  "Mobile Suit Gundam / 0080": {
    from: "#155e75",
    to: "#0f172a",
    glow: "rgba(125,211,252,0.35)",
  },
  "Mobile Suit Gundam F91": {
    from: "#1e3a8a",
    to: "#312e81",
    glow: "rgba(165,180,252,0.35)",
  },
  "Mobile Suit Gundam 00": {
    from: "#14532d",
    to: "#365314",
    glow: "rgba(163,230,53,0.35)",
  },
  "Mobile Suit Gundam 0083": {
    from: "#1e293b",
    to: "#0f172a",
    glow: "rgba(226,232,240,0.28)",
  },
  "Mobile Suit Gundam: The 08th MS Team": {
    from: "#3f2a14",
    to: "#14532d",
    glow: "rgba(190,242,100,0.3)",
  },
  "Mobile Suit Gundam Wing": {
    from: "#334155",
    to: "#1e293b",
    glow: "rgba(248,250,252,0.28)",
  },
  "Mobile Suit Gundam Wing: EW": {
    from: "#334155",
    to: "#0f172a",
    glow: "rgba(226,232,240,0.32)",
  },
  "Mobile Suit Gundam SEED": {
    from: "#1e3a8a",
    to: "#713f12",
    glow: "rgba(250,204,21,0.35)",
  },
  "Mobile Suit Gundam SEED DESTINY": {
    from: "#172554",
    to: "#3f3f46",
    glow: "rgba(212,212,216,0.3)",
  },
  "Mobile Suit Gundam SEED ASTRAY": {
    from: "#1e3a8a",
    to: "#7f1d1d",
    glow: "rgba(248,113,113,0.32)",
  },
  "Mobile Suit Gundam SEED MSV": {
    from: "#1e3a8a",
    to: "#334155",
    glow: "rgba(147,197,253,0.3)",
  },
  "Mobile Suit Gundam UC": {
    from: "#4c1d95",
    to: "#0f172a",
    glow: "rgba(196,181,253,0.4)",
  },
  "Mobile Suit Zeta Gundam": {
    from: "#1d4ed8",
    to: "#0f172a",
    glow: "rgba(96,165,250,0.35)",
  },
  "Mobile Suit Victory Gundam": {
    from: "#0f766e",
    to: "#1e1b4b",
    glow: "rgba(94,234,212,0.32)",
  },
  "Mobile Suit Gundam Thunderbolt": {
    from: "#111827",
    to: "#1e293b",
    glow: "rgba(148,163,184,0.3)",
  },
  "Mobile Suit Crossbone Gundam": {
    from: "#7c2d12",
    to: "#111827",
    glow: "rgba(251,191,36,0.32)",
  },
  "Gundam Reconguista in G": {
    from: "#365314",
    to: "#14532d",
    glow: "rgba(190,242,100,0.3)",
  },
  "IRON-BLOODED ORPHANS": {
    from: "#7f1d1d",
    to: "#111827",
    glow: "rgba(248,113,113,0.35)",
  },
  "The Witch from Mercury": {
    from: "#9d174d",
    to: "#1e1b4b",
    glow: "rgba(244,114,182,0.4)",
  },
  "Mobile Suit Gundam GQuuuuuuX": {
    from: "#991b1b",
    to: "#111827",
    glow: "rgba(252,165,165,0.35)",
  },
  "Requiem for Vengeance": {
    from: "#3f3f46",
    to: "#18181b",
    glow: "rgba(212,212,216,0.28)",
  },
  "Armored Core VI: Fires of Rubicon": {
    from: "#7c2d12",
    to: "#111827",
    glow: "rgba(251,146,60,0.35)",
  },
  "30 Minutes Missions": {
    from: "#0e7490",
    to: "#134e4a",
    glow: "rgba(45,212,191,0.32)",
  },
  "Super Dimension Fortress Macross": {
    from: "#1e3a8a",
    to: "#0f172a",
    glow: "rgba(147,197,253,0.35)",
  },
  "Macross Plus": {
    from: "#1d4ed8",
    to: "#312e81",
    glow: "rgba(196,181,253,0.32)",
  },
  "Star Wars": {
    from: "#1e293b",
    to: "#111827",
    glow: "rgba(250,204,21,0.28)",
  },
  default: {
    from: "#164e63",
    to: "#0f172a",
    glow: "rgba(34,211,238,0.3)",
  },
};
