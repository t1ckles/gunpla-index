import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Cpu,
  Factory,
  Hash,
  StickyNote,
  Swords,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, type ComponentType } from "react";
import { GradeBadge } from "@/components/ui/grade-badge";
import { StatusSelect } from "@/components/ui/status-select";
import { Button } from "@/components/ui/button";
import type { BuildStatus, CustomList, Kit } from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { ImageGallery } from "./image-gallery";

export function KitModal({
  kit,
  lists,
  onClose,
  onStatusChange,
  onToggleList,
}: {
  kit: Kit | null;
  lists: CustomList[];
  onClose: () => void;
  onStatusChange: (status: BuildStatus) => void;
  onToggleList: (listId: string) => void;
}) {
  useEffect(() => {
    if (!kit) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [kit, onClose]);

  return (
    <AnimatePresence>
      {kit ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close kit details"
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="kit-modal-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative z-10 max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950/95 shadow-[0_0_80px_rgba(34,211,238,0.12)] sm:rounded-3xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950/90 px-5 py-4 backdrop-blur">
              <div>
                <p className="font-mono text-xs tracking-[0.24em] text-cyan-300">
                  {kit.unitCode}
                </p>
                <h2
                  id="kit-modal-title"
                  className="font-display text-2xl text-white sm:text-3xl"
                >
                  {kit.kitName}
                </h2>
              </div>
              <Button onClick={onClose} aria-label="Close">
                <X className="size-4" />
                Close
              </Button>
            </div>

            <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr]">
              <ImageGallery kit={kit} />

              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <GradeBadge grade={kit.grade} code={kit.gradeCode} />
                  <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-zinc-200">
                    {kit.scale}
                  </span>
                </div>

                <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">
                    Build status
                  </h3>
                  <StatusSelect value={kit.buildStatus} onChange={onStatusChange} />
                  <p className="mt-2 text-xs text-zinc-500">
                    Changes save to this browser immediately.
                  </p>
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">
                    Custom lists
                  </h3>
                  {lists.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      Create a list in the hangar filters, then assign this kit here.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {lists.map((list) => {
                        const active = list.kitIds.includes(kit.id);
                        return (
                          <button
                            key={list.id}
                            type="button"
                            onClick={() => onToggleList(list.id)}
                            className={cn(
                              "rounded-full border px-3 py-1 text-xs uppercase tracking-wider",
                              active
                                ? "border-amber-300/40 bg-amber-400/15 text-amber-100"
                                : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20",
                            )}
                          >
                            {list.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>

                <section className="grid grid-cols-2 gap-3">
                  <Stat icon={Hash} label="Catalog" value={kit.catalogNumber || "—"} />
                  <Stat icon={Calendar} label="Release Year" value={kit.releaseYear ?? "—"} />
                  <Stat icon={Calendar} label="Purchased" value={formatDate(kit.purchaseDate)} />
                  <Stat icon={Wallet} label="Price" value={formatCurrency(kit.purchasePrice)} />
                  <Stat icon={BookOpen} label="Series" value={kit.series || "—"} />
                  <Stat icon={BookOpen} label="Timeline" value={kit.timeline || "—"} />
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">
                    <Cpu className="size-4 text-cyan-300" />
                    Mobile Suit Details
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <Detail icon={Factory} label="Manufacturer" value={kit.lore.manufacturer} />
                    <Detail icon={User} label="Pilot" value={kit.lore.pilot} />
                    <Detail icon={Cpu} label="Power Output" value={kit.lore.powerOutput} />
                    <Detail
                      icon={Swords}
                      label="Signature Weapons"
                      value={
                        kit.lore.signatureWeapons.length
                          ? kit.lore.signatureWeapons.join(" · ")
                          : "—"
                      }
                    />
                  </dl>
                  {kit.lore.background ? (
                    <p className="mt-4 text-sm leading-6 text-zinc-300">
                      {kit.lore.background}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-zinc-500">
                      No lore saved yet. Add manufacturer, pilot, and background
                      notes from Manage.
                    </p>
                  )}
                </section>
              </div>
            </div>

            <section className="border-t border-white/10 px-5 py-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
                <StickyNote className="size-4" />
                Personal Notes
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                <NoteCard
                  title="Build log"
                  body={
                    kit.notes ||
                    "No build notes yet. Add paint recipes, lining notes, or decal logs from Manage."
                  }
                />
                <NoteCard
                  title="Custom paint / mods"
                  body={
                    kit.mods ||
                    (kit.customPaint
                      ? "Custom work flagged, but no recipe saved."
                      : "Stock build — no extra detail parts logged.")
                  }
                />
              </div>
            </section>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-100">{value}</p>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-cyan-300" />
      <div>
        <dt className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          {label}
        </dt>
        <dd className="text-zinc-100">{value || "—"}</dd>
      </div>
    </div>
  );
}

function NoteCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-amber-300/15 bg-amber-400/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-200">{body}</p>
    </div>
  );
}
