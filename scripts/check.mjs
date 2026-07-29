import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const failures = [];
const htmlFiles = [];
const checkedTargets = new Map();

async function targetExists(target) {
  if (!checkedTargets.has(target)) {
    checkedTargets.set(target, access(target).then(() => true, () => false));
  }
  return checkedTargets.get(target);
}

async function walk(directory) {
  for (const entry of await readdir(directory)) {
    const absolute = path.join(directory, entry);
    const info = await stat(absolute);
    if (info.isDirectory()) await walk(absolute);
    else if (entry.endsWith(".html")) htmlFiles.push(absolute);
  }
}

await walk(dist);

for (const file of htmlFiles) {
  const source = await readFile(file, "utf8");
  const relative = path.relative(dist, file);
  const productionPage = path.basename(file) === "index.html";

  if (!/<html\s+lang="fr">/i.test(source)) failures.push(`${relative}: attribut lang manquant`);
  if (productionPage && !/<link rel="canonical" href="https:\/\/go-senior\.fr\//i.test(source)) {
    failures.push(`${relative}: canonical manquant`);
  }
  if (productionPage && !/<meta name="robots" content="(?:index|noindex),follow">/i.test(source)) {
    failures.push(`${relative}: directive robots manquante`);
  }
  if (productionPage) {
    const analyticsLoaderCount = (
      source.match(/googletagmanager\.com\/gtag\/js\?id=G-HBZWTD0J4F/g) || []
    ).length;
    const analyticsConfigCount = (
      source.match(/gtag\('config', 'G-HBZWTD0J4F'\)/g) || []
    ).length;
    if (analyticsLoaderCount !== 1 || analyticsConfigCount !== 1) {
      failures.push(`${relative}: balise Google Analytics absente ou dupliquée`);
    }
  } else if (source.includes("G-HBZWTD0J4F")) {
    failures.push(`${relative}: balise Google Analytics présente dans un composant`);
  }
  if (/href="[^"]*\.dc\.html/i.test(source)) failures.push(`${relative}: lien .dc.html restant`);
  if (/src="uploads\//i.test(source)) failures.push(`${relative}: image non absolue`);
  const h1Count = (source.match(/<h1\b/gi) || []).length;
  const indexed = /<meta name="robots" content="index,follow">/i.test(source);
  if (productionPage && indexed && h1Count !== 1) failures.push(`${relative}: ${h1Count} H1`);

  const references = [...source.matchAll(/(?:href|src)="([^"]+)"/gi)].map((match) => match[1]);
  for (const reference of references) {
    if (
      !reference.startsWith("/")
      || reference.startsWith("//")
      || reference.includes("{{")
    ) continue;
    const pathname = reference.split(/[?#]/, 1)[0];
    if (!pathname) continue;
    const target = pathname.endsWith("/")
      ? path.join(dist, pathname, "index.html")
      : path.join(dist, pathname);
    if (!await targetExists(target)) failures.push(`${relative}: cible absente ${reference}`);
  }
}

const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
if (!sitemap.includes("https://go-senior.fr/")) failures.push("sitemap.xml: accueil manquant");
if (sitemap.includes("/projet/")) failures.push("sitemap.xml: page projet ne doit pas être indexée");
if (!sitemap.includes("/actualites/")) failures.push("sitemap.xml: actualités manquantes");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlFiles.length} HTML files with no structural errors.`);
}
