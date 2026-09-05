import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";
import { rowsToKits } from "../src/lib/parse-models.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = resolve(root, "src/GunPla Models.xlsx");
const outputPath = resolve(root, "src/data/models.json");

const workbook = XLSX.readFile(workbookPath, { cellDates: true });
const sheetName = workbook.SheetNames[0];

if (!sheetName) {
  throw new Error("The Excel workbook does not contain any sheets.");
}

const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
  workbook.Sheets[sheetName],
  { defval: "", raw: false },
);

const kits = rowsToKits(rows, "excel");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(kits, null, 2)}\n`, "utf8");

console.log(
  `Parsed ${kits.length} kits from "${sheetName}" → src/data/models.json`,
);
