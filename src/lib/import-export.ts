import { normalizeImportedKit } from "./parse-models";
import type { CollectionExport, Kit } from "./types";

export function kitToRow(kit: Kit) {
  return {
    "Grade / Line": kit.gradeLine || `${kit.grade} ${kit.scale}`,
    Grade: kit.grade,
    Scale: kit.scale,
    "Box / Catalog #": kit.catalogNumber,
    "Model Number / Designation": kit.unitCode,
    "Kit Name / Description": kit.kitName,
    "Series / Universe": kit.series,
    "Timeline / Era": kit.timeline,
    "Build Status": kit.buildStatus,
    "Custom Notes": kit.notes,
    "Custom Paint/Mods": kit.customPaint ? kit.mods || "Yes" : kit.mods || "",
    "Release Year": kit.releaseYear ?? "",
    "Purchase Date": kit.purchaseDate,
    "Purchase Price": kit.purchasePrice ?? "",
    Images: kit.images.join(" | "),
  };
}

export function toExportPayload(kits: Kit[]): CollectionExport {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    source: "ms-index",
    kits,
  };
}

export function parseJsonImport(text: string): Kit[] {
  const parsed = JSON.parse(text) as unknown;
  const rows = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object" && "kits" in parsed
      ? (parsed as CollectionExport).kits
      : [];

  if (!Array.isArray(rows)) {
    throw new Error("JSON must be an array of kits or an export object.");
  }

  return rows.map((row) => normalizeImportedKit(row));
}

export function parseCsv(text: string): Kit[] {
  const rows = splitCsv(text);
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows
    .slice(1)
    .filter((row) => row.some(Boolean))
    .map((cells) => {
      const mapped: Record<string, string> = {};
      headers.forEach((header, index) => {
        mapped[header] = cells[index] ?? "";
      });
      return normalizeImportedKit(mapped);
    });
}

function splitCsv(text: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }
  if (current || row.length) {
    row.push(current);
    rows.push(row);
  }
  return rows;
}

export function toCsv(kits: Kit[]) {
  const headers = [
    "Grade / Line",
    "Grade",
    "Scale",
    "Box / Catalog #",
    "Model Number / Designation",
    "Kit Name / Description",
    "Series / Universe",
    "Timeline / Era",
    "Build Status",
    "Custom Notes",
    "Custom Paint/Mods",
    "Release Year",
    "Purchase Date",
    "Purchase Price",
    "Images",
  ];
  const lines = [
    headers.join(","),
    ...kits.map((kit) => {
      const row = kitToRow(kit);
      return headers
        .map((header) => csvEscape(String(row[header as keyof typeof row] ?? "")))
        .join(",");
    }),
  ];
  return lines.join("\n");
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export function mergeKits(existing: Kit[], incoming: Kit[]) {
  const next = [...existing];
  incoming.forEach((kit) => {
    const index = next.findIndex(
      (item) =>
        item.id === kit.id ||
        (item.catalogNumber &&
          item.catalogNumber === kit.catalogNumber &&
          item.kitName.toLowerCase() === kit.kitName.toLowerCase()) ||
        (item.unitCode &&
          item.unitCode === kit.unitCode &&
          item.kitName.toLowerCase() === kit.kitName.toLowerCase()),
    );
    if (index >= 0) {
      next[index] = {
        ...next[index],
        ...kit,
        id: next[index].id,
        source: next[index].source,
        createdAt: next[index].createdAt,
        updatedAt: new Date().toISOString(),
      };
    } else {
      next.push(kit);
    }
  });
  return next;
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function parseWorkbookFile(file: File): Promise<Kit[]> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    workbook.Sheets[sheetName],
    { defval: "", raw: false },
  );
  return rows.map((row) => normalizeImportedKit(row, "user"));
}
