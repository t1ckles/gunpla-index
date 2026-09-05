import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import {
  BUILD_STATUSES,
  GRADES,
  SCALES,
  type Kit,
  type KitInput,
} from "@/lib/types";
import { emptyLore, parseImageList } from "@/lib/utils";

const blankForm = (): KitInput => ({
  kitName: "",
  unitCode: "",
  catalogNumber: "",
  gradeLine: "",
  grade: "HG",
  gradeCode: "HG",
  scale: "1/144",
  series: "",
  timeline: "",
  franchise: "Gundam",
  buildStatus: "Backlog",
  customPaint: false,
  mods: "",
  notes: "",
  images: [],
  releaseYear: null,
  purchaseDate: "",
  purchasePrice: null,
  lore: emptyLore(),
});

function kitToForm(kit: Kit): KitInput {
  return {
    kitName: kit.kitName,
    unitCode: kit.unitCode,
    catalogNumber: kit.catalogNumber,
    gradeLine: kit.gradeLine,
    grade: kit.grade,
    gradeCode: kit.gradeCode,
    scale: kit.scale,
    series: kit.series,
    timeline: kit.timeline,
    franchise: kit.franchise,
    buildStatus: kit.buildStatus,
    customPaint: kit.customPaint,
    mods: kit.mods,
    notes: kit.notes,
    images: kit.images,
    releaseYear: kit.releaseYear,
    purchaseDate: kit.purchaseDate,
    purchasePrice: kit.purchasePrice,
    lore: kit.lore,
  };
}

export function KitForm({
  initialKit,
  onSubmit,
  onCancel,
}: {
  initialKit?: Kit | null;
  onSubmit: (input: KitInput) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<KitInput>(() =>
    initialKit ? kitToForm(initialKit) : blankForm(),
  );
  const [imageText, setImageText] = useState(() =>
    initialKit ? initialKit.images.join("\n") : "",
  );
  const [weapons, setWeapons] = useState(() =>
    initialKit ? initialKit.lore.signatureWeapons.join(", ") : "",
  );

  function update<K extends keyof KitInput>(key: K, value: KitInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      ...form,
      gradeCode: form.gradeCode || form.grade,
      gradeLine: form.gradeLine || `${form.grade} ${form.scale}`,
      franchise: form.franchise || form.series,
      images: parseImageList(imageText),
      lore: {
        ...form.lore,
        signatureWeapons: weapons
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    });
    if (!initialKit) {
      setForm(blankForm());
      setImageText("");
      setWeapons("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Model / Kit Name">
          <Input
            required
            value={form.kitName}
            onChange={(event) => update("kitName", event.target.value)}
            placeholder="Gundam Aerial Rebuild"
          />
        </Field>
        <Field label="Unit Designation">
          <Input
            value={form.unitCode}
            onChange={(event) => update("unitCode", event.target.value)}
            placeholder="XVX-016RN"
          />
        </Field>
        <Field label="Box / Catalog #">
          <Input
            value={form.catalogNumber}
            onChange={(event) => update("catalogNumber", event.target.value)}
            placeholder="HGWFM #18"
          />
        </Field>
        <Field label="Grade Code">
          <Input
            value={form.gradeCode}
            onChange={(event) => update("gradeCode", event.target.value)}
            placeholder="HGUC"
          />
        </Field>
        <Field label="Grade Family">
          <Select
            value={form.grade}
            onChange={(event) => {
              const grade = event.target.value as KitInput["grade"];
              update("grade", grade);
              if (!form.gradeCode || form.gradeCode === form.grade) {
                update("gradeCode", grade);
              }
            }}
          >
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Scale">
          <Select
            value={form.scale}
            onChange={(event) => update("scale", event.target.value as KitInput["scale"])}
          >
            {SCALES.map((scale) => (
              <option key={scale} value={scale}>
                {scale}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Series / Universe">
          <Input
            value={form.series}
            onChange={(event) => update("series", event.target.value)}
            placeholder="The Witch from Mercury"
          />
        </Field>
        <Field label="Timeline / Era">
          <Input
            value={form.timeline}
            onChange={(event) => update("timeline", event.target.value)}
            placeholder="Ad Stella (AS)"
          />
        </Field>
        <Field label="Build Status">
          <Select
            value={form.buildStatus}
            onChange={(event) =>
              update("buildStatus", event.target.value as KitInput["buildStatus"])
            }
          >
            {BUILD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Release Year">
          <Input
            type="number"
            min="1980"
            max="2100"
            value={form.releaseYear ?? ""}
            onChange={(event) =>
              update(
                "releaseYear",
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          />
        </Field>
        <Field label="Purchase Date">
          <Input
            type="date"
            value={form.purchaseDate}
            onChange={(event) => update("purchaseDate", event.target.value)}
          />
        </Field>
        <Field label="Purchase Price (USD)">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.purchasePrice ?? ""}
            onChange={(event) =>
              update(
                "purchasePrice",
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          />
        </Field>
        <Field label="Custom Paint">
          <Select
            value={form.customPaint ? "yes" : "no"}
            onChange={(event) => update("customPaint", event.target.value === "yes")}
          >
            <option value="no">Stock / no custom paint</option>
            <option value="yes">Custom paint or heavy mods</option>
          </Select>
        </Field>
      </div>

      <Field
        label="Box Art / Image URLs"
        hint="One URL per line. These feed the dashboard card and modal gallery."
      >
        <Textarea
          value={imageText}
          onChange={(event) => setImageText(event.target.value)}
          placeholder="https://example.com/box-art.jpg"
        />
      </Field>

      <Field label="Custom Build Notes">
        <Textarea
          value={form.notes}
          onChange={(event) => update("notes", event.target.value)}
          placeholder="Paint recipes, panel lining, waterslides, extra detail parts…"
        />
      </Field>
      <Field label="Mods / Paint Recipe">
        <Textarea
          value={form.mods}
          onChange={(event) => update("mods", event.target.value)}
          placeholder="LED unit, third-party decals, metal paint mix…"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Manufacturer">
          <Input
            value={form.lore.manufacturer}
            onChange={(event) =>
              update("lore", { ...form.lore, manufacturer: event.target.value })
            }
          />
        </Field>
        <Field label="Pilot">
          <Input
            value={form.lore.pilot}
            onChange={(event) =>
              update("lore", { ...form.lore, pilot: event.target.value })
            }
          />
        </Field>
        <Field label="Power Output">
          <Input
            value={form.lore.powerOutput}
            onChange={(event) =>
              update("lore", { ...form.lore, powerOutput: event.target.value })
            }
          />
        </Field>
        <Field label="Signature Weapons" hint="Comma-separated">
          <Input
            value={weapons}
            onChange={(event) => setWeapons(event.target.value)}
            placeholder="Beam Rifle, Shield"
          />
        </Field>
      </div>
      <Field label="Lore / Background">
        <Textarea
          value={form.lore.background}
          onChange={(event) =>
            update("lore", { ...form.lore, background: event.target.value })
          }
        />
      </Field>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary">
          {initialKit ? "Save Changes" : "Add Kit to Hangar"}
        </Button>
        {initialKit && onCancel ? (
          <Button type="button" onClick={onCancel}>
            Cancel Edit
          </Button>
        ) : null}
      </div>
    </form>
  );
}
