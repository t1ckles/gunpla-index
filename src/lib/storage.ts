import { STORAGE_KEY } from "./constants";
import type { CollectionExport, CustomList, Kit, LocalCollection } from "./types";

function isKit(value: unknown): value is Kit {
  if (!value || typeof value !== "object") return false;
  const kit = value as Partial<Kit>;
  return (
    typeof kit.id === "string" &&
    typeof kit.kitName === "string" &&
    typeof kit.unitCode === "string" &&
    typeof kit.grade === "string" &&
    typeof kit.buildStatus === "string"
  );
}

function isList(value: unknown): value is CustomList {
  if (!value || typeof value !== "object") return false;
  const list = value as Partial<CustomList>;
  return (
    typeof list.id === "string" &&
    typeof list.name === "string" &&
    Array.isArray(list.kitIds)
  );
}

function emptyState(kits: Kit[]): LocalCollection {
  return {
    version: 3,
    kits,
    knownSeedIds: kits.map((kit) => kit.id),
    lists: [],
  };
}

function asLocal(value: unknown): LocalCollection | null {
  if (Array.isArray(value) && value.every(isKit)) {
    return emptyState(value);
  }

  if (value && typeof value === "object") {
    if ("kits" in value && Array.isArray((value as CollectionExport).kits)) {
      const kits = (value as CollectionExport).kits.filter(isKit);
      const knownSeedIds =
        "knownSeedIds" in value && Array.isArray((value as LocalCollection).knownSeedIds)
          ? (value as LocalCollection).knownSeedIds.filter(
              (id): id is string => typeof id === "string",
            )
          : kits.map((kit) => kit.id);
      const lists =
        "lists" in value && Array.isArray((value as LocalCollection).lists)
          ? (value as LocalCollection).lists.filter(isList)
          : [];
      return { version: 3, kits, knownSeedIds, lists };
    }
  }

  return null;
}

export function mergeSeedKits(local: LocalCollection, seed: Kit[]): Kit[] {
  const known = new Set(local.knownSeedIds);
  const localIds = new Set(local.kits.map((kit) => kit.id));
  const additions = seed.filter(
    (kit) => !localIds.has(kit.id) && !known.has(kit.id),
  );
  return [...local.kits, ...additions];
}

export function loadCollection(seed: Kit[]): LocalCollection {
  if (typeof window === "undefined") {
    return emptyState(seed);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyState(seed);
    }

    const parsed = asLocal(JSON.parse(raw) as unknown);
    if (!parsed) {
      return emptyState(seed);
    }

    const knownSeedIds = [...new Set([...parsed.knownSeedIds, ...seed.map((kit) => kit.id)])];
    return {
      version: 3,
      kits: mergeSeedKits(parsed, seed),
      knownSeedIds,
      lists: parsed.lists,
    };
  } catch {
    return emptyState(seed);
  }
}

export function saveCollection(state: LocalCollection) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearCollection() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
