import { FileJson, FileSpreadsheet, RotateCcw, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/context/collection-context";
import {
  downloadFile,
  parseCsv,
  parseJsonImport,
  parseWorkbookFile,
  toCsv,
  toExportPayload,
} from "@/lib/import-export";

export function ImportExport() {
  const { kits, importKits, resetToSpreadsheet } = useCollection();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"merge" | "replace">("merge");

  async function handleFile(file: File) {
    try {
      const name = file.name.toLowerCase();
      const incoming = name.endsWith(".xlsx") || name.endsWith(".xls")
        ? await parseWorkbookFile(file)
        : name.endsWith(".csv")
          ? parseCsv(await file.text())
          : parseJsonImport(await file.text());

      if (!incoming.length) {
        setMessage("No kits found in that file.");
        return;
      }
      importKits(incoming, mode);
      setMessage(
        `${mode === "replace" ? "Replaced" : "Merged"} ${incoming.length} kit${incoming.length === 1 ? "" : "s"}.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed.");
    }
  }

  return (
    <section className="glass-card space-y-4 rounded-2xl p-5">
      <div>
        <h2 className="font-display text-2xl text-white">Bulk Import / Export</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-400">
          Export the live hangar as JSON or CSV, or import an updated spreadsheet.
          New Excel rows merge in on the next rebuild; browser edits stay in
          localStorage until you reset.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          onClick={() =>
            downloadFile(
              "ms-index-collection.json",
              JSON.stringify(toExportPayload(kits), null, 2),
              "application/json",
            )
          }
        >
          <FileJson className="size-4" />
          Export JSON
        </Button>
        <Button
          onClick={() =>
            downloadFile("ms-index-collection.csv", toCsv(kits), "text/csv")
          }
        >
          <FileSpreadsheet className="size-4" />
          Export CSV
        </Button>
        <Button onClick={() => fileRef.current?.click()}>
          <Upload className="size-4" />
          Import File
        </Button>
        <Button onClick={resetToSpreadsheet} variant="ghost">
          <RotateCcw className="size-4" />
          Reset to Spreadsheet
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
        <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
          Import mode
        </span>
        {(["merge", "replace"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em] ${
              mode === value
                ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-100"
                : "border-white/10 text-zinc-400"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".json,.csv,.xlsx,.xls,application/json,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />

      {message ? <p className="text-sm text-cyan-200">{message}</p> : null}
    </section>
  );
}
