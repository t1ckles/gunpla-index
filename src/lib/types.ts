export const GRADES = [
  "EG",
  "HG",
  "RG",
  "MG",
  "PG",
  "SD",
  "RE/100",
  "FM",
  "30MM",
  "Other",
] as const;

export const SCALES = [
  "1/144",
  "1/100",
  "1/60",
  "1/72",
  "1/48",
  "1/35",
  "Non-scale",
] as const;

export const BUILD_STATUSES = [
  "Backlog",
  "In Progress",
  "Completed",
  "On Hold",
] as const;

export const SORT_OPTIONS = [
  "alphabetical",
  "grade",
  "buildStatus",
  "series",
  "catalog",
] as const;

export type Grade = (typeof GRADES)[number];
export type Scale = (typeof SCALES)[number];
export type BuildStatus = (typeof BUILD_STATUSES)[number];
export type SortOption = (typeof SORT_OPTIONS)[number];
export type KitSource = "excel" | "user";

export interface KitLore {
  manufacturer: string;
  pilot: string;
  powerOutput: string;
  signatureWeapons: string[];
  background: string;
}

export interface Kit {
  id: string;
  kitName: string;
  unitCode: string;
  catalogNumber: string;
  gradeLine: string;
  grade: Grade;
  gradeCode: string;
  scale: Scale;
  series: string;
  timeline: string;
  franchise: string;
  buildStatus: BuildStatus;
  customPaint: boolean;
  mods: string;
  notes: string;
  images: string[];
  releaseYear: number | null;
  purchaseDate: string;
  purchasePrice: number | null;
  lore: KitLore;
  source: KitSource;
  createdAt: string;
  updatedAt: string;
}

export type KitInput = Omit<Kit, "id" | "createdAt" | "updatedAt" | "source"> & {
  id?: string;
  source?: KitSource;
};

export interface CollectionExport {
  version: 1;
  exportedAt: string;
  source: "ms-index";
  kits: Kit[];
}

export interface LocalCollection {
  version: 2;
  kits: Kit[];
  knownSeedIds: string[];
}

export interface CollectionFilters {
  query: string;
  grades: Grade[];
  series: string[];
  statuses: BuildStatus[];
  sort: SortOption;
}
