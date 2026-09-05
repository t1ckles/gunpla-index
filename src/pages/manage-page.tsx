import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ImportExport } from "@/components/manage/import-export";
import { KitForm } from "@/components/manage/kit-form";
import { GradeBadge } from "@/components/ui/grade-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/context/collection-context";
import type { Kit, KitInput } from "@/lib/types";

export function ManagePage() {
  const { kits, addKit, updateKit, deleteKit } = useCollection();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const editing = kits.find((kit) => kit.id === editingId) ?? null;

  useEffect(() => {
    if (editingId && !kits.some((kit) => kit.id === editingId)) {
      setEditingId(null);
    }
  }, [editingId, kits]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return kits;
    return kits.filter((kit) =>
      `${kit.kitName} ${kit.unitCode} ${kit.catalogNumber} ${kit.series}`
        .toLowerCase()
        .includes(value),
    );
  }, [kits, query]);

  function handleSubmit(input: KitInput) {
    if (editing) {
      updateKit(editing.id, input);
      setEditingId(null);
    } else {
      addKit(input);
    }
  }

  function remove(kit: Kit) {
    const confirmed = window.confirm(`Remove ${kit.kitName} from the hangar?`);
    if (confirmed) {
      deleteKit(kit.id);
      if (editingId === kit.id) setEditingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
          Acquisition Desk
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-[0.12em] text-white sm:text-5xl">
          ADD & MANAGE
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Log a new purchase, update a finished build, or sync the hangar back
          out as JSON / CSV. Uploaded kits are tagged in the inventory and can
          be cleared from this browser without touching the spreadsheet catalog.
        </p>
      </motion.div>

      <section className="glass-card rounded-2xl p-5 sm:p-6">
        <h2 className="mb-4 font-display text-2xl text-white">
          {editing ? `Editing ${editing.kitName}` : "New Kit Entry"}
        </h2>
        <KitForm
          key={editing?.id ?? "new-kit"}
          initialKit={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditingId(null)}
        />
      </section>

      <ImportExport />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl text-white">Hangar Inventory</h2>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter inventory…"
            className="h-10 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/50 sm:w-72"
          />
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="hidden grid-cols-[1.4fr_0.7fr_0.5fr_0.8fr_auto] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-zinc-500 md:grid">
            <span>Kit</span>
            <span>Grade / Scale</span>
            <span>Status</span>
            <span>Series</span>
            <span className="text-right">Actions</span>
          </div>
          {filtered.map((kit) => (
            <div
              key={kit.id}
              className="grid gap-3 border-b border-white/5 px-4 py-4 last:border-b-0 md:grid-cols-[1.4fr_0.7fr_0.5fr_0.8fr_auto] md:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white">{kit.kitName}</p>
                  {kit.source === "user" ? (
                    <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-100">
                      Uploaded
                    </span>
                  ) : null}
                </div>
                <p className="font-mono text-xs tracking-[0.16em] text-cyan-300">
                  {kit.unitCode || "—"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <GradeBadge grade={kit.grade} code={kit.gradeCode} />
                <span className="font-mono text-xs text-zinc-400">{kit.scale}</span>
              </div>
              <StatusBadge status={kit.buildStatus} />
              <p className="text-sm text-zinc-400">{kit.series}</p>
              <div className="flex justify-end gap-2">
                <Button size="sm" onClick={() => setEditingId(kit.id)}>
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(kit)}>
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
