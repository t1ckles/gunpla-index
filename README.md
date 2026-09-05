# MS-Index

A dark, high-contrast hangar for cataloging GunPla and Mobile Suit model kits. The catalog is generated from `src/GunPla Models.xlsx` and can be extended in the browser.

## Features

- **Spreadsheet-first catalog** — `npm run parse-excel` turns the Excel file into `src/data/models.json`
- **Collection dashboard** with live search, grade / series / status filters, and animated kit cards
- **Kit modal** with image gallery, statistics, lore, and personal build notes
- **Manage page** to add, edit, and delete kits
- **JSON / CSV / Excel import & export**
- **localStorage merge** — browser edits persist, and new spreadsheet rows appear on the next rebuild
- **GitHub Pages ready** — static `dist` output plus a deploy workflow

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Excel parser runs automatically before `dev` and `build`.

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
| `npm run parse-excel` | Convert the spreadsheet into `src/data/models.json` |
| `npm run dev` | Parse, then start Vite |
| `npm run build` | Parse, typecheck, and emit `dist/` |
| `npm run preview` | Preview the static build |
| `npm run deploy` | Build for GitHub Pages and publish `dist/` with `gh-pages` |

## GitHub Pages

1. Enable **GitHub Pages** for the repo and set the source to **GitHub Actions**.
2. Push to `main`. The workflow builds with `GITHUB_PAGES=true` so asset paths use `/{repo}/` (this repo: `/gunpla-index/`).
3. The app uses hash routing (`/#/manage`), so collection links work on project pages without a custom 404 rewrite.

Manual publish:

```bash
npm run deploy
```

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- lucide-react, clsx, tailwind-merge
- SheetJS (`xlsx`) for spreadsheet parsing
