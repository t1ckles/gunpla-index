import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { seedKits } from "@/data/seed";
import { mergeKits } from "@/lib/import-export";
import { loadCollection, saveCollection } from "@/lib/storage";
import type {
  BuildStatus,
  CustomList,
  Kit,
  KitInput,
  LocalCollection,
} from "@/lib/types";
import { createId } from "@/lib/utils";

type Listener = () => void;

const seedState: LocalCollection = {
  version: 3,
  kits: seedKits,
  knownSeedIds: seedKits.map((kit) => kit.id),
  lists: [],
};

let snapshot = seedState;
let didHydrate = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function hydrateFromStorage() {
  if (typeof window === "undefined" || didHydrate) return snapshot;
  snapshot = loadCollection(seedKits);
  didHydrate = true;
  return snapshot;
}

function getSnapshot() {
  return hydrateFromStorage();
}

function getServerSnapshot() {
  return seedState;
}

function writeState(next: LocalCollection) {
  snapshot = next;
  saveCollection(next);
  emit();
}

function writeKits(kits: Kit[]) {
  const current = hydrateFromStorage();
  const remaining = new Set(kits.map((kit) => kit.id));
  writeState({
    ...current,
    version: 3,
    kits,
    knownSeedIds: [...new Set([...current.knownSeedIds, ...seedKits.map((kit) => kit.id)])],
    lists: current.lists.map((list) => ({
      ...list,
      kitIds: list.kitIds.filter((id) => remaining.has(id)),
    })),
  });
}

interface CollectionContextValue {
  kits: Kit[];
  lists: CustomList[];
  ready: boolean;
  addKit: (input: KitInput) => Kit;
  updateKit: (id: string, input: KitInput) => void;
  setKitStatus: (id: string, status: BuildStatus) => void;
  deleteKit: (id: string) => void;
  importKits: (incoming: Kit[], mode: "merge" | "replace") => void;
  clearUploadedKits: () => number;
  resetToSpreadsheet: () => void;
  createList: (name: string) => CustomList | null;
  toggleKitInList: (listId: string, kitId: string) => void;
  clearList: (listId: string) => void;
  deleteList: (listId: string) => void;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const addKit = useCallback((input: KitInput) => {
    const stamp = new Date().toISOString();
    const kit: Kit = {
      ...input,
      id: input.id ?? createId(),
      source: input.source ?? "user",
      createdAt: stamp,
      updatedAt: stamp,
    };
    writeKits([kit, ...hydrateFromStorage().kits]);
    return kit;
  }, []);

  const updateKit = useCallback((id: string, input: KitInput) => {
    writeKits(
      hydrateFromStorage().kits.map((kit) =>
        kit.id === id
          ? { ...kit, ...input, id, source: kit.source, updatedAt: new Date().toISOString() }
          : kit,
      ),
    );
  }, []);

  const setKitStatus = useCallback((id: string, status: BuildStatus) => {
    writeKits(
      hydrateFromStorage().kits.map((kit) =>
        kit.id === id
          ? { ...kit, buildStatus: status, updatedAt: new Date().toISOString() }
          : kit,
      ),
    );
  }, []);

  const deleteKit = useCallback((id: string) => {
    writeKits(hydrateFromStorage().kits.filter((kit) => kit.id !== id));
  }, []);

  const importKits = useCallback((incoming: Kit[], mode: "merge" | "replace") => {
    const current = hydrateFromStorage();
    writeKits(mode === "replace" ? incoming : mergeKits(current.kits, incoming));
  }, []);

  const clearUploadedKits = useCallback(() => {
    const current = hydrateFromStorage().kits;
    const remaining = current.filter((kit) => kit.source !== "user");
    const removed = current.length - remaining.length;
    if (removed) writeKits(remaining);
    return removed;
  }, []);

  const resetToSpreadsheet = useCallback(() => {
    const current = hydrateFromStorage();
    const seedIds = new Set(seedKits.map((kit) => kit.id));
    writeState({
      version: 3,
      kits: seedKits,
      knownSeedIds: seedKits.map((kit) => kit.id),
      lists: current.lists.map((list) => ({
        ...list,
        kitIds: list.kitIds.filter((id) => seedIds.has(id)),
      })),
    });
  }, []);

  const createList = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const current = hydrateFromStorage();
    const list: CustomList = {
      id: createId(),
      name: trimmed,
      kitIds: [],
      createdAt: new Date().toISOString(),
    };
    writeState({
      ...current,
      version: 3,
      lists: [...current.lists, list],
    });
    return list;
  }, []);

  const toggleKitInList = useCallback((listId: string, kitId: string) => {
    const current = hydrateFromStorage();
    writeState({
      ...current,
      version: 3,
      lists: current.lists.map((list) => {
        if (list.id !== listId) return list;
        const hasKit = list.kitIds.includes(kitId);
        return {
          ...list,
          kitIds: hasKit
            ? list.kitIds.filter((id) => id !== kitId)
            : [...list.kitIds, kitId],
        };
      }),
    });
  }, []);

  const clearList = useCallback((listId: string) => {
    const current = hydrateFromStorage();
    writeState({
      ...current,
      version: 3,
      lists: current.lists.map((list) =>
        list.id === listId ? { ...list, kitIds: [] } : list,
      ),
    });
  }, []);

  const deleteList = useCallback((listId: string) => {
    const current = hydrateFromStorage();
    writeState({
      ...current,
      version: 3,
      lists: current.lists.filter((list) => list.id !== listId),
    });
  }, []);

  const value = useMemo(
    () => ({
      kits: state.kits,
      lists: state.lists,
      ready,
      addKit,
      updateKit,
      setKitStatus,
      deleteKit,
      importKits,
      clearUploadedKits,
      resetToSpreadsheet,
      createList,
      toggleKitInList,
      clearList,
      deleteList,
    }),
    [
      state.kits,
      state.lists,
      ready,
      addKit,
      updateKit,
      setKitStatus,
      deleteKit,
      importKits,
      clearUploadedKits,
      resetToSpreadsheet,
      createList,
      toggleKitInList,
      clearList,
      deleteList,
    ],
  );

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection must be used inside CollectionProvider");
  }
  return context;
}
