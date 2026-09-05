import { BookmarkPlus, Eraser, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { CustomList } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ListsPanel({
  lists,
  selectedListIds,
  onToggleList,
  onCreate,
  onClear,
  onDelete,
}: {
  lists: CustomList[];
  selectedListIds: string[];
  onToggleList: (listId: string) => void;
  onCreate: (name: string) => void;
  onClear: (listId: string) => void;
  onDelete: (listId: string) => void;
}) {
  const [name, setName] = useState("");

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreate(name);
    setName("");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          Custom lists
        </p>
        <p className="text-[11px] text-zinc-500">Saved in this browser</p>
      </div>

      <form onSubmit={handleCreate} className="flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <BookmarkPlus className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="New list name — Display shelf, Contest…"
            className="h-10 w-full rounded-xl border border-white/10 bg-zinc-950/60 pl-10 pr-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/50"
          />
        </label>
        <Button type="submit" variant="primary" disabled={!name.trim()}>
          <Plus className="size-4" />
          Create list
        </Button>
      </form>

      {lists.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-5 text-sm text-zinc-500">
          Create a list, then add kits from a card or the kit detail panel.
        </p>
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {lists.map((list) => {
            const selected = selectedListIds.includes(list.id);
            return (
              <div
                key={list.id}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2",
                  selected
                    ? "border-amber-300/40 bg-amber-400/10"
                    : "border-white/10 bg-zinc-950/40",
                )}
              >
                <button
                  type="button"
                  onClick={() => onToggleList(list.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate text-sm text-zinc-100">
                    {list.name}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500">
                    {list.kitIds.length} kit{list.kitIds.length === 1 ? "" : "s"}
                  </span>
                </button>
                <Button
                  size="sm"
                  onClick={() => onClear(list.id)}
                  disabled={list.kitIds.length === 0}
                  aria-label={`Clear ${list.name}`}
                >
                  <Eraser className="size-3.5" />
                  Clear
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(list.id)}
                  aria-label={`Delete ${list.name}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
