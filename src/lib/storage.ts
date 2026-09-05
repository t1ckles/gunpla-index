import { STORAGE_KEY } from "./constants";
import type { CollectionExport, Kit, LocalCollection } from "./types";

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

function asLocal(value: unknown): LocalCollection | null {
  if (Array.isArray(value) && value.every(isKit)) {
    return {
      version: 2,
      kits: value,
      knownSeedIds: value.map((kit) => kit.id),
    };
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
      return { version: 2, kits, knownSeedIds };
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
    return {
      version: 2,
      kits: seed,
      knownSeedIds: seed.map((kit) => kit.id),
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        version: 2,
        kits: seed,
        knownSeedIds: seed.map((kit) => kit.id),
      };
    }

    const parsed = asLocal(JSON.parse(raw) as unknown);
    if (!parsed) {
      return {
        version: 2,
        kits: seed,
        knownSeedIds: seed.map((kit) => kit.id),
      };
    }

    const knownSeedIds = [...new Set([...parsed.knownSeedIds, ...seed.map((kit) => kit.id)])];
    return {
      version: 2,
      kits: mergeSeedKits(parsed, seed),
      knownSeedIds,
    };
  } catch {
    return {
      version: 2,
      kits: seed,
      knownSeedIds: seed.map((kit) => kit.id),
    };
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
