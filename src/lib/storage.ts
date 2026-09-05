import { STORAGE_KEY } from "./constants";
import type { CollectionExport, CustomList, Kit, LocalCollection } from "./types";
import { kitIdentityKey } from "./utils";

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

function hasUserContent(kit: Kit) {
  return Boolean(
    kit.notes ||
      kit.mods ||
      kit.customPaint ||
      kit.images.length ||
      kit.lore.background ||
      kit.lore.manufacturer ||
      kit.lore.pilot ||
      kit.purchaseDate ||
      kit.purchasePrice != null ||
      kit.releaseYear != null ||
      kit.buildStatus !== "Backlog",
  );
}

export function mergeSeedKits(local: LocalCollection, seed: Kit[]): Kit[] {
  const localById = new Map(local.kits.map((kit) => [kit.id, kit]));
  const localByIdentity = new Map(
    local.kits.map((kit) => [kitIdentityKey(kit), kit]),
  );
  const matchedLocalIds = new Set<string>();

  const merged = seed.map((seedKit) => {
    const localKit =
      localById.get(seedKit.id) ?? localByIdentity.get(kitIdentityKey(seedKit));
    if (!localKit) return seedKit;
    matchedLocalIds.add(localKit.id);
    if (!hasUserContent(localKit)) return seedKit;
    return {
      ...seedKit,
      buildStatus: localKit.buildStatus,
      customPaint: localKit.customPaint,
      mods: localKit.mods,
      notes: localKit.notes,
      images: localKit.images.length ? localKit.images : seedKit.images,
      releaseYear: localKit.releaseYear ?? seedKit.releaseYear,
      purchaseDate: localKit.purchaseDate || seedKit.purchaseDate,
      purchasePrice: localKit.purchasePrice ?? seedKit.purchasePrice,
      lore: localKit.lore.background || localKit.lore.manufacturer
        ? localKit.lore
        : seedKit.lore,
      createdAt: localKit.createdAt,
      updatedAt: localKit.updatedAt,
    };
  });

  const userAdded = local.kits.filter(
    (kit) => kit.source === "user" && !matchedLocalIds.has(kit.id),
  );

  return [...merged, ...userAdded];
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

    const kits = mergeSeedKits(parsed, seed);
    const validIds = new Set(kits.map((kit) => kit.id));
    const seedByIdentity = new Map(seed.map((kit) => [kitIdentityKey(kit), kit]));
    const lists = parsed.lists.map((list) => ({
      ...list,
      kitIds: [
        ...new Set(
          list.kitIds
            .map((id) => {
              if (validIds.has(id)) return id;
              const previous = parsed.kits.find((kit) => kit.id === id);
              if (!previous) return null;
              return seedByIdentity.get(kitIdentityKey(previous))?.id ?? null;
            })
            .filter((id): id is string => Boolean(id)),
        ),
      ],
    }));

    return {
      version: 3,
      kits,
      knownSeedIds: seed.map((kit) => kit.id),
      lists,
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
