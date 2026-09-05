import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const distAssets = resolve("dist/assets");
const destAssets = resolve("assets");

if (!existsSync(distAssets)) {
  throw new Error("dist/assets is missing. Run the Vite build first.");
}

rmSync(destAssets, { recursive: true, force: true });
cpSync(distAssets, destAssets, { recursive: true });

const faviconSrc = resolve("public/favicon.svg");
if (existsSync(faviconSrc)) {
  cpSync(faviconSrc, resolve("favicon.svg"));
}

console.log("Copied dist/assets → assets/ for GitHub Pages (main branch root).");
