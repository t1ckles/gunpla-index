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
import { clearCollection, loadCollection, saveCollection } from "@/lib/storage";
import type { Kit, KitInput, LocalCollection } from "@/lib/types";
import { createId } from "@/lib/utils";

type Listener = () => void;

const seedState: LocalCollection = {
  version: 2,
  kits: seedKits,
  knownSeedIds: seedKits.map((kit) => kit.id),
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
  writeState({
    ...current,
    kits,
    knownSeedIds: [...new Set([...current.knownSeedIds, ...seedKits.map((kit) => kit.id)])],
  });
}

interface CollectionContextValue {
  kits: Kit[];
  ready: boolean;
  addKit: (input: KitInput) => Kit;
  updateKit: (id: string, input: KitInput) => void;
  deleteKit: (id: string) => void;
  importKits: (incoming: Kit[], mode: "merge" | "replace") => void;
  resetToSpreadsheet: () => void;
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

  const deleteKit = useCallback((id: string) => {
    writeKits(hydrateFromStorage().kits.filter((kit) => kit.id !== id));
  }, []);

  const importKits = useCallback((incoming: Kit[], mode: "merge" | "replace") => {
    const current = hydrateFromStorage();
    writeKits(mode === "replace" ? incoming : mergeKits(current.kits, incoming));
  }, []);

  const resetToSpreadsheet = useCallback(() => {
    clearCollection();
    writeState({
      version: 2,
      kits: seedKits,
      knownSeedIds: seedKits.map((kit) => kit.id),
    });
  }, []);

  const value = useMemo(
    () => ({
      kits: state.kits,
      ready,
      addKit,
      updateKit,
      deleteKit,
      importKits,
      resetToSpreadsheet,
    }),
    [state.kits, ready, addKit, updateKit, deleteKit, importKits, resetToSpreadsheet],
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
