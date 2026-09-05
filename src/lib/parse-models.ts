import {
  BUILD_STATUSES,
  GRADES,
  SCALES,
  type BuildStatus,
  type Grade,
  type Kit,
  type KitLore,
  type Scale,
} from "./types";
import { emptyLore, slugify } from "./utils";

const HEADER_ALIASES: Record<string, string> = {
  "grade / line": "gradeLine",
  grade: "grade",
  scale: "scale",
  "box / catalog #": "catalogNumber",
  "box / catalog": "catalogNumber",
  "catalog #": "catalogNumber",
  catalog: "catalogNumber",
  "model number / designation": "unitCode",
  "model / unit designation": "unitCode",
  "unit model number": "unitCode",
  "unit code": "unitCode",
  designation: "unitCode",
  "kit name / description": "kitName",
  "kit name": "kitName",
  name: "kitName",
  "series / universe": "series",
  series: "series",
  franchise: "franchise",
  "timeline / era": "timeline",
  timeline: "timeline",
  era: "timeline",
  "build status": "buildStatus",
  status: "buildStatus",
  "custom notes": "notes",
  notes: "notes",
  "custom paint/mods": "mods",
  "custom paint": "customPaint",
  mods: "mods",
  "release year": "releaseYear",
  "purchase date": "purchaseDate",
  "purchase price": "purchasePrice",
  images: "images",
  "image urls": "images",
  manufacturer: "manufacturer",
  pilot: "pilot",
  "power output": "powerOutput",
  weapons: "signatureWeapons",
  "signature weapons": "signatureWeapons",
  lore: "background",
  background: "background",
};

const GRADE_CODE_MAP: Record<string, Grade> = {
  EG: "EG",
  HG: "HG",
  HGUC: "HG",
  HGCE: "HG",
  HGAC: "HG",
  HGIBO: "HG",
  HGWFM: "HG",
  HGGQX: "HG",
  "HG AGE": "HG",
  "HG SEED": "HG",
  "HG MSV": "HG",
  "HG TB": "HG",
  "HG G-SELF": "HG",
  RG: "RG",
  MG: "MG",
  PG: "PG",
  SD: "SD",
  FM: "FM",
  "RE/100": "RE/100",
  "30MM": "30MM",
  ACVI: "30MM",
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function cell(value: unknown) {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function asGrade(value = ""): Grade {
  const match = GRADES.find(
    (grade) => grade.toLowerCase() === value.trim().toLowerCase(),
  );
  return match ?? "Other";
}

function asScale(value = ""): Scale {
  const match = SCALES.find((scale) => scale === value.trim());
  return match ?? "1/144";
}

function asStatus(value = ""): BuildStatus {
  const match = BUILD_STATUSES.find(
    (status) => status.toLowerCase() === value.trim().toLowerCase(),
  );
  return match ?? "Backlog";
}

function asBoolean(value = "") {
  return /^(true|yes|y|1|painted|custom)$/i.test(value.trim());
}

function asNumber(value = "") {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseScale(gradeLine: string, explicit?: string): Scale {
  if (explicit) return asScale(explicit);
  const match = gradeLine.match(/1\/\d+/);
  if (match && SCALES.includes(match[0] as Scale)) {
    return match[0] as Scale;
  }
  if (/non[- ]?scale/i.test(gradeLine)) return "Non-scale";
  return "1/144";
}

function parseGradeCode(gradeLine: string, explicitGrade?: string) {
  if (explicitGrade && GRADE_CODE_MAP[explicitGrade.toUpperCase()]) {
    return explicitGrade.toUpperCase();
  }

  const parenMatches = [...gradeLine.matchAll(/\(([^)]+)\)/g)].map(
    (match) => match[1],
  );
  for (const token of parenMatches) {
    const normalized = token.trim().toUpperCase();
    if (GRADE_CODE_MAP[normalized]) return normalized;
    if (/^HG[\s/-]?[A-Z0-9]+/i.test(token)) return token.trim();
  }

  const prefix = gradeLine.match(
    /\b(EG|RG|MG|PG|SD|FM|HGUC|HGCE|HGAC|HGIBO|HGWFM|HGGQX|30MM)\b/i,
  );
  if (prefix) return prefix[1].toUpperCase();

  if (/entry grade/i.test(gradeLine)) return "EG";
  if (/real grade/i.test(gradeLine)) return "RG";
  if (/master grade/i.test(gradeLine)) return "MG";
  if (/perfect grade/i.test(gradeLine)) return "PG";
  if (/high grade/i.test(gradeLine)) return "HG";
  if (/30 minutes|30mm/i.test(gradeLine)) return "30MM";
  if (/armored core/i.test(gradeLine)) return "ACVI";

  return explicitGrade?.trim() || "Other";
}

function gradeFromCode(code: string): Grade {
  const exact = GRADE_CODE_MAP[code.toUpperCase()];
  if (exact) return exact;
  if (/^HG/i.test(code)) return "HG";
  if (/^RG/i.test(code)) return "RG";
  if (/^MG/i.test(code)) return "MG";
  if (/30MM|ACVI/i.test(code)) return "30MM";
  return asGrade(code);
}

function inferFranchise(series: string, timeline: string) {
  const haystack = `${series} ${timeline}`.toLowerCase();
  if (haystack.includes("macross")) return "Macross";
  if (haystack.includes("star wars")) return "Star Wars";
  if (haystack.includes("armored core")) return "Armored Core";
  if (haystack.includes("30 minutes") || haystack.includes("30mm")) {
    return "30 Minutes Missions";
  }
  if (haystack.includes("evangelion")) return "Evangelion";
  if (haystack.includes("gundam") || haystack.includes("universal century")) {
    return "Gundam";
  }
  return timeline || series || "Other";
}

function nowIso() {
  return new Date().toISOString();
}

export function mapRow(raw: Record<string, unknown>): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const [header, value] of Object.entries(raw)) {
    const key = HEADER_ALIASES[normalizeHeader(header)];
    if (key) mapped[key] = cell(value);
  }
  return mapped;
}

export function rowToKit(
  raw: Record<string, unknown>,
  index = 0,
  source: Kit["source"] = "excel",
): Kit | null {
  const mapped = mapRow(raw);
  const kitName =
    mapped.kitName ||
    cell(raw["Kit Name / Description"] ?? raw["Kit Name"] ?? raw.kitName);
  if (!kitName) return null;

  const gradeLine =
    mapped.gradeLine ||
    cell(raw["Grade / Line"] ?? raw.gradeLine ?? mapped.grade);
  const gradeCode = parseGradeCode(gradeLine, mapped.grade);
  const scale = parseScale(gradeLine, mapped.scale);
  const unitCode = mapped.unitCode;
  const catalogNumber = mapped.catalogNumber;
  const series = mapped.series;
  const timeline = mapped.timeline;
  const stamp = cell(raw.createdAt) || (source === "excel" ? "2024-01-01T00:00:00.000Z" : nowIso());
  const lore: KitLore = {
    ...emptyLore(),
    manufacturer: mapped.manufacturer ?? "",
    pilot: mapped.pilot ?? "",
    powerOutput: mapped.powerOutput ?? "",
    signatureWeapons: (mapped.signatureWeapons ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    background: mapped.background ?? "",
  };

  if (raw.lore && typeof raw.lore === "object") {
    Object.assign(lore, raw.lore);
  }

  const id =
    typeof raw.id === "string" && raw.id
      ? raw.id
      : slugify(`${catalogNumber}-${unitCode}-${kitName}`) || `kit-${index + 1}`;

  return {
    id,
    kitName,
    unitCode,
    catalogNumber,
    gradeLine: gradeLine || `${gradeCode} ${scale}`,
    grade: gradeFromCode(gradeCode),
    gradeCode,
    scale,
    series,
    timeline,
    franchise: mapped.franchise || inferFranchise(series, timeline),
    buildStatus: asStatus(mapped.buildStatus),
    customPaint: asBoolean(mapped.customPaint ?? mapped.mods),
    mods: mapped.mods ?? "",
    notes: mapped.notes ?? "",
    images: parseImageField(raw.images ?? mapped.images),
    releaseYear: asNumber(mapped.releaseYear ?? ""),
    purchaseDate: mapped.purchaseDate ?? "",
    purchasePrice: asNumber(mapped.purchasePrice ?? ""),
    lore,
    source,
    createdAt: stamp,
    updatedAt: cell(raw.updatedAt) || stamp,
  };
}

function parseImageField(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value ?? "")
    .split(/[\n|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function rowsToKits(
  rows: Record<string, unknown>[],
  source: Kit["source"] = "excel",
) {
  return rows
    .map((row, index) => rowToKit(row, index, source))
    .filter((kit): kit is Kit => Boolean(kit));
}

export function normalizeImportedKit(row: unknown, source: Kit["source"] = "user"): Kit {
  if (!row || typeof row !== "object") {
    throw new Error("Each imported kit must be an object.");
  }

  const raw = row as Record<string, unknown>;
  const parsed = rowToKit(raw, 0, source);
  if (!parsed) {
    throw new Error("Imported kit is missing a kit name.");
  }

  if (raw.lore && typeof raw.lore === "object") {
    parsed.lore = {
      ...emptyLore(),
      ...(raw.lore as KitLore),
    };
  }

  if (typeof raw.grade === "string" && GRADES.includes(raw.grade as Grade)) {
    parsed.grade = raw.grade as Grade;
  }
  if (typeof raw.scale === "string" && SCALES.includes(raw.scale as Scale)) {
    parsed.scale = raw.scale as Scale;
  }
  if (typeof raw.buildStatus === "string") {
    parsed.buildStatus = asStatus(raw.buildStatus);
  }
  if (typeof raw.customPaint === "boolean") {
    parsed.customPaint = raw.customPaint;
  }
  if (Array.isArray(raw.images)) {
    parsed.images = raw.images.map(String);
  }

  return parsed;
}
