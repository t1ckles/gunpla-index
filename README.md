# MS-Index

A dark, high-contrast hangar for cataloging GunPla and Mobile Suit model kits. The catalog is generated from `src/GunPla Models.xlsx` and can be extended in the browser.

## Features

- **JSON catalog** — edit `src/data/models.json` by hand, or regenerate it from Excel with `npm run parse-excel`
- **Collection dashboard** with live search, grade / series / status filters, and animated kit cards
- **Kit modal** with image gallery, statistics, lore, and personal build notes
- **Manage page** to add, edit, and delete kits
- **JSON / CSV / Excel import & export**
- **localStorage merge** — browser edits persist, and new spreadsheet rows appear on the next rebuild
- **GitHub Pages ready** — production assets are copied to `assets/` so the `main` branch root can host the site

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Edit `src/data/models.json` directly; `dev` and `build` will not overwrite it. Run `npm run parse-excel` only when you want to regenerate JSON from the spreadsheet.

## Spreadsheet columns

The parser reads the first sheet of `src/GunPla Models.xlsx` and maps:

| Spreadsheet column | App field |
| --- | --- |
| Grade / Line | Grade family, grade code, scale |
| Box / Catalog # | Catalog number |
| Model Number / Designation | Unit code |
| Kit Name / Description | Kit name |
| Series / Universe | Series |
| Timeline / Era | Timeline |
| Build Status, Custom Notes, Release Year | Optional extras if you add those columns |

Kits from the sheet default to **Backlog** until you update them on `/manage`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run parse-excel` | Overwrite `src/data/models.json` from the spreadsheet tabs |
| `npm run dev` | Start Vite without touching `models.json` |
| `npm run build` | Typecheck and emit `dist/` / `assets/` without touching `models.json` |
| `npm run preview` | Preview the static build |
| `npm run deploy` | Build for GitHub Pages and publish `dist/` with `gh-pages` |

## GitHub Pages

GitHub Pages is serving the `main` branch root. A Vite source file cannot run there, so `npm run build` also copies the compiled bundle to `assets/` at the repo root.

1. In the repo: **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**.
2. Run `npm run build`, commit the updated `assets/` folder, and push.
3. The live site loads `./assets/app.js` instead of `/src/main.tsx`.

Hash routes (`/#/manage`) work on project pages without a custom 404 rewrite.

```bash
npm run build
npm run deploy
```

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- lucide-react, clsx, tailwind-merge
- SheetJS (`xlsx`) for spreadsheet parsing
