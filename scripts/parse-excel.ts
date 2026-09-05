import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";
import { rowsToKits } from "../src/lib/parse-models.ts";
import { inferTimeline, kitIdentityKey, slugify } from "../src/lib/utils.ts";
import type { Kit } from "../src/lib/types.ts";

const SKIP_SHEETS = new Set(["raw"]);

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = resolve(root, "src/GunPla Models.xlsx");
const outputPath = resolve(root, "src/data/models.json");

const workbook = XLSX.read(readFileSync(workbookPath), {
  type: "buffer",
  cellDates: true,
});

const previous: Kit[] = existsSync(outputPath)
  ? (JSON.parse(readFileSync(outputPath, "utf8")) as Kit[])
  : [];

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

const unique = new Map<string, Kit>();
kits.forEach((kit) => {
  const key = kitIdentityKey(kit);
  if (!unique.has(key)) unique.set(key, applyOfficialFieldFixes(kit));
});

function applyOfficialFieldFixes(kit: Kit): Kit {
  const next = { ...kit };

  if (kit.catalogNumber.toUpperCase().startsWith("HGAC") && /HGCE/i.test(kit.gradeLine)) {
    next.gradeLine = kit.gradeLine.replace(/HGCE/gi, "HGAC");
    next.gradeCode = "HGAC";
  }

  if (kit.kitName === "Shenlong Gundam" && /^XXG-01S$/i.test(kit.unitCode)) {
    next.unitCode = "XXXG-01S";
  }

  if (kit.kitName === "Leo" && /OZ-06MS/i.test(kit.unitCode)) {
    next.unitCode = "OZ-06MS";
  }

  if (/nu gundam/i.test(kit.kitName) && kit.series === "Mobile Suit Gundam") {
    next.series = "Mobile Suit Gundam: Char's Counterattack";
    next.timeline = inferTimeline(next.series, next.timeline);
    next.franchise = "Gundam";
  }

  next.timeline = inferTimeline(next.series, next.timeline);
  next.id = slugify(`${next.catalogNumber}-${next.unitCode}-${next.kitName}`);
  return next;
}

function findPrevious(kit: Kit) {
  return (
    previous.find((old) => kitIdentityKey(old) === kitIdentityKey(kit)) ??
    previous.find((old) => old.id === kit.id) ??
    previous.find(
      (old) => old.catalogNumber.toLowerCase() === kit.catalogNumber.toLowerCase(),
    )
  );
}

const merged = [...unique.values()].map((kit) => {
  const old = findPrevious(kit);
  if (!old) return kit;

  const hasLore = Boolean(
    old.lore.background || old.lore.manufacturer || old.lore.pilot,
  );

  return {
    ...kit,
    id: old.id,
    lore: hasLore ? old.lore : kit.lore,
    images: old.images.length ? old.images : kit.images,
    notes: old.notes || kit.notes,
    mods: old.mods || kit.mods,
    customPaint: old.customPaint || kit.customPaint,
    buildStatus: old.buildStatus,
    purchaseDate: old.purchaseDate || kit.purchaseDate,
    purchasePrice: old.purchasePrice ?? kit.purchasePrice,
    releaseYear: kit.releaseYear ?? old.releaseYear,
    createdAt: old.createdAt,
    updatedAt: old.updatedAt,
  };
});

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(merged, null, 2)}\n`, "utf8");

console.log(`Wrote ${merged.length} kits → src/data/models.json`);
