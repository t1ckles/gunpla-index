import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";
import { rowsToKits } from "../src/lib/parse-models.ts";
import { kitIdentityKey } from "../src/lib/utils.ts";

const SKIP_SHEETS = new Set(["raw"]);

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = resolve(root, "src/GunPla Models.xlsx");
const outputPath = resolve(root, "src/data/models.json");

const workbook = XLSX.read(readFileSync(workbookPath), {
  type: "buffer",
  cellDates: true,
});

const kits = workbook.SheetNames.flatMap((sheetName) => {
  if (SKIP_SHEETS.has(sheetName.trim().toLowerCase())) {
    console.log(`Skipping stale aggregate sheet "${sheetName}"`);
    return [];
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    workbook.Sheets[sheetName],
    { defval: "", raw: false },
  );
  const parsed = rowsToKits(rows, "excel");
  console.log(`Parsed ${parsed.length} kits from "${sheetName}"`);
  return parsed;
});

const unique = new Map<string, (typeof kits)[number]>();
kits.forEach((kit) => {
  const key = kitIdentityKey(kit);
  if (!unique.has(key)) unique.set(key, kit);
});

const deduped = [...unique.values()];

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(deduped, null, 2)}\n`, "utf8");

console.log(`Wrote ${deduped.length} kits → src/data/models.json`);
