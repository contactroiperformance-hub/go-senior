import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const failures = [];
const htmlFiles = [];
const checkedTargets = new Map();
const indexedMetadata = [];

function visibleMetadataText(value = "") {
  return value
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

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
  if (productionPage && !/<meta name="robots" content="(?:index|noindex),follow(?:,[^"]+)?">/i.test(source)) {
    failures.push(`${relative}: directive robots manquante`);
  }
  if (productionPage) {
    const head = source.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || "";
    const titleCount = (head.match(/<title>/gi) || []).length;
    const descriptionCount = (head.match(/<meta name="description"/gi) || []).length;
    const canonicalCount = (head.match(/<link rel="canonical"/gi) || []).length;
    const structuredDataCount = (head.match(/type="application\/ld\+json"/gi) || []).length;
    const localFontCount = (
      head.match(/\/uploads\/fonts\/(?:libre-franklin|source-serif-4)-latin\.woff2/gi) || []
    ).length;
    if (titleCount !== 1) failures.push(`${relative}: ${titleCount} balise title dans head`);
    if (descriptionCount !== 1) failures.push(`${relative}: ${descriptionCount} meta description dans head`);
    if (canonicalCount !== 1) failures.push(`${relative}: ${canonicalCount} canonical dans head`);
    if (structuredDataCount !== 1) failures.push(`${relative}: JSON-LD absent ou dupliqué`);
    if (/<meta name="robots" content="index,follow(?:,[^"]+)?">/i.test(head)) {
      const title = visibleMetadataText(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
      const description = visibleMetadataText(head.match(/<meta name="description" content="([^"]*)"/i)?.[1]);
      const openGraphTitle = visibleMetadataText(head.match(/<meta property="og:title" content="([^"]*)"/i)?.[1]);
      const openGraphDescription = visibleMetadataText(head.match(/<meta property="og:description" content="([^"]*)"/i)?.[1]);
      const titleLength = [...title].length;
      const descriptionLength = [...description].length;
      indexedMetadata.push({ relative, title, description });
      if (titleLength < 30 || titleLength > 75) {
        failures.push(`${relative}: title SEO de ${titleLength} caractères (attendu 30 à 75)`);
      }
      if (descriptionLength < 110 || descriptionLength > 175) {
        failures.push(`${relative}: meta description de ${descriptionLength} caractères (attendu 110 à 175)`);
      }
      if (openGraphTitle !== title) failures.push(`${relative}: og:title différent du title SEO`);
      if (openGraphDescription !== description) failures.push(`${relative}: og:description différente de la meta description`);
    }
    for (const faviconSignal of [
      'href="/favicon.svg"',
      'href="/favicon-32.png"',
      'href="/favicon-16.png"',
      'href="/favicon-48.png"',
      'href="/apple-touch-icon.png"',
      'href="/site.webmanifest"',
      '<meta name="theme-color" content="#2E5B4C">'
    ]) {
      if (!head.includes(faviconSignal)) failures.push(`${relative}: signal favicon manquant ${faviconSignal}`);
    }
    if (localFontCount !== 4) failures.push(`${relative}: polices locales absentes ou dupliquées`);
    if (/fonts\.(?:googleapis|gstatic)\.com/i.test(head)) {
      failures.push(`${relative}: ressource Google Fonts externe restante`);
    }
    const jsonLd = head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
    if (jsonLd) {
      try {
        const parsed = JSON.parse(jsonLd);
        const types = new Set((parsed["@graph"] || []).map((entry) => entry["@type"]));
        if (!types.has("Organization") || !types.has("WebSite") || !types.has("WebPage")) {
          failures.push(`${relative}: graphe JSON-LD incomplet`);
        }
        if (relative === "index.html") {
          const organization = (parsed["@graph"] || []).find((entry) => entry["@type"] === "Organization");
          if (organization?.logo !== "https://go-senior.fr/favicon-512.png") {
            failures.push("index.html: logo Organization manquant ou incorrect");
          }
        }
      } catch {
        failures.push(`${relative}: JSON-LD invalide`);
      }
    }
    const analyticsLoaderCount = (
      source.match(/googletagmanager\.com\/gtag\/js\?id=G-HBZWTD0J4F/g) || []
    ).length;
    const analyticsConfigCount = (
      source.match(/gtag\('config', 'G-HBZWTD0J4F'\)/g) || []
    ).length;
    if (analyticsLoaderCount !== 1 || analyticsConfigCount !== 1) {
      failures.push(`${relative}: balise Google Analytics absente ou dupliquée`);
    }
    const consentLoaderCount = (
      source.match(/\/consent\.js\?v=[a-f0-9]{10}/g) || []
    ).length;
    const consentDefaultCount = (
      source.match(/gtag\('consent', 'default'/g) || []
    ).length;
    if (consentLoaderCount !== 1 || consentDefaultCount !== 1) {
      failures.push(`${relative}: Consent Mode v2 absent ou dupliqué`);
    }
    const localReactCount = (
      source.match(/\/vendor\/react(?:-dom)?-18\.3\.1\.min\.js/g) || []
    ).length;
    if (localReactCount !== 2) failures.push(`${relative}: runtime React local absent ou dupliqué`);
  } else {
    if (source.includes("G-HBZWTD0J4F")) {
      failures.push(`${relative}: balise Google Analytics présente dans un composant`);
    }
    if (source.includes("xu36kqlw73")) {
      failures.push(`${relative}: balise Microsoft Clarity présente dans un composant`);
    }
  }
  if (/href="[^"]*\.dc\.html/i.test(source)) failures.push(`${relative}: lien .dc.html restant`);
  if (/src="uploads\//i.test(source)) failures.push(`${relative}: image non absolue`);
  const h1Count = (source.match(/<h1\b/gi) || []).length;
  const indexed = /<meta name="robots" content="index,follow(?:,[^"]+)?">/i.test(source);
  if (productionPage && indexed && h1Count !== 1) failures.push(`${relative}: ${h1Count} H1`);

  const emailProtectionRemoved = source
    .replace(/<!--email_off-->[\s\S]*?<!--\/email_off-->/gi, "")
    .replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, "");
  if (/<a\b[^>]*\bhref=["']mailto:/i.test(emailProtectionRemoved)) {
    failures.push(`${relative}: lien e-mail visible non protégé de la transformation Cloudflare`);
  }
  const visibleTextWithoutTags = emailProtectionRemoved.replace(/<[^>]+>/g, " ");
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(visibleTextWithoutTags)) {
    failures.push(`${relative}: adresse e-mail visible non protégée de la transformation Cloudflare`);
  }

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

for (const field of ["title", "description"]) {
  const occurrences = new Map();
  for (const metadata of indexedMetadata) {
    const matches = occurrences.get(metadata[field]) || [];
    matches.push(metadata.relative);
    occurrences.set(metadata[field], matches);
  }
  for (const [value, matches] of occurrences) {
    if (matches.length > 1) {
      failures.push(`${field} SEO dupliqué sur ${matches.join(", ")}: ${value}`);
    }
  }
}

for (const faviconFile of [
  "favicon.svg",
  "favicon-16.png",
  "favicon-32.png",
  "favicon-48.png",
  "favicon-64.png",
  "favicon-192.png",
  "favicon-512.png",
  "apple-touch-icon.png",
  "site.webmanifest"
]) {
  if (!await targetExists(path.join(dist, faviconFile))) failures.push(`${faviconFile}: actif favicon absent du build`);
}
try {
  const manifest = JSON.parse(await readFile(path.join(dist, "site.webmanifest"), "utf8"));
  if (manifest.theme_color !== "#2E5B4C") failures.push("site.webmanifest: theme_color incorrect");
  if (!manifest.icons?.some((icon) => icon.src === "/favicon-192.png" && icon.sizes === "192x192")) {
    failures.push("site.webmanifest: icône 192x192 manquante");
  }
  if (!manifest.icons?.some((icon) => icon.src === "/favicon-512.png" && icon.sizes === "512x512")) {
    failures.push("site.webmanifest: icône 512x512 manquante");
  }
} catch {
  failures.push("site.webmanifest: manifeste invalide");
}

for (const entry of await readdir(root)) {
  if (!entry.endsWith(".dc.html")) continue;
  const source = await readFile(path.join(root, entry), "utf8");
  if (!/<meta\s+name="viewport"/i.test(source)) failures.push(`${entry}: meta viewport manquante`);
  if (!/overflow-x\s*:\s*hidden/i.test(source)) failures.push(`${entry}: blocage horizontal manquant`);
}

const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
if (!sitemap.includes("https://go-senior.fr/")) failures.push("sitemap.xml: accueil manquant");
if (sitemap.includes("/projet/")) failures.push("sitemap.xml: page projet ne doit pas être indexée");
if (sitemap.includes("<loc>https://go-senior.fr/actualites/</loc>")) {
  failures.push("sitemap.xml: la liste actualités ne doit pas encore être indexée");
}
if (!sitemap.includes("<loc>https://go-senior.fr/actualites/compte-personnel-france-renov/</loc><lastmod>2026-08-19</lastmod>")) {
  failures.push("sitemap.xml: actualité France Rénov’ indexable manquante");
}
const sitemapUrls = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)];
if (!sitemapUrls.length) failures.push("sitemap.xml: aucune URL détectée");
for (const [, loc, lastmod] of sitemapUrls) {
  if (!lastmod) failures.push(`sitemap.xml: lastmod manquant pour ${loc}`);
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) failures.push(`sitemap.xml: lastmod invalide pour ${loc}`);
}

const newsPage = await readFile(path.join(dist, "actualites", "index.html"), "utf8");
if (!newsPage.includes('<meta name="robots" content="noindex,follow">')) {
  failures.push("actualites/index.html: fixtures éditoriales non protégées de l’indexation");
}
for (const target of [
  "/actualites/compte-personnel-france-renov/",
  "/guides/plafonds-ressources/",
  "/guides/apa-pch/"
]) {
  if (!newsPage.includes(target)) failures.push(`actualites/index.html: destination manquante ${target}`);
}

const projectPage = await readFile(path.join(dist, "projet", "index.html"), "utf8");
if (!projectPage.includes("body .gsh-bar{display:none !important}body{padding-bottom:0 !important}")) {
  failures.push("projet/index.html: barre mobile du formulaire non masquée");
}
const homePage = await readFile(path.join(dist, "index.html"), "utf8");
if (!homePage.includes(".gsh-bar{display:flex !important}body{padding-bottom:76px}")) {
  failures.push("index.html: barre mobile globale masquée par erreur");
}
const newsArticle = await readFile(path.join(dist, "actualites", "compte-personnel-france-renov", "index.html"), "utf8");
if (!newsArticle.includes('<link rel="canonical" href="https://go-senior.fr/actualites/compte-personnel-france-renov/">')) {
  failures.push("actualité France Rénov’: URL canonique incorrecte");
}
if (!newsArticle.includes('<meta name="robots" content="index,follow,')) {
  failures.push("actualité France Rénov’: directive index,follow manquante");
}
if (!newsArticle.includes('<meta property="og:type" content="article">')) {
  failures.push("actualité France Rénov’: type Open Graph article manquant");
}
if (!newsArticle.includes('href="/methodologie-editoriale/"')) {
  failures.push("actualité France Rénov’: auteur non relié à la méthode éditoriale");
}
const newsJsonLd = JSON.parse(newsArticle.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1] || "{}");
const newsArticleSchema = (newsJsonLd["@graph"] || []).find((entry) => entry["@type"] === "NewsArticle");
if (!newsArticleSchema) failures.push("actualité France Rénov’: schéma NewsArticle manquant");
else {
  if (newsArticleSchema.datePublished !== "2026-07-28") failures.push("actualité France Rénov’: datePublished incorrecte");
  if (newsArticleSchema.dateModified !== "2026-08-19") failures.push("actualité France Rénov’: dateModified incorrecte");
  if (newsArticleSchema.author?.url !== "https://go-senior.fr/methodologie-editoriale/") failures.push("actualité France Rénov’: auteur structuré incomplet");
  if (!Array.isArray(newsArticleSchema.citation) || newsArticleSchema.citation.length < 2) failures.push("actualité France Rénov’: citations officielles structurées manquantes");
  if (!newsArticleSchema.citation?.some((url) => url.includes("anah.gouv.fr/presse/compter-du-17-aout-2026"))) failures.push("actualité France Rénov’: communiqué Anah exact manquant");
}

const localArticle = await readFile(path.join(dist, "douche-senior", "gironde", "bordeaux", "index.html"), "utf8");
const localJsonLd = JSON.parse(localArticle.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1] || "{}");
const localArticleSchema = (localJsonLd["@graph"] || []).find((entry) => entry["@type"] === "Article");
if (!localArticleSchema) failures.push("page locale Bordeaux: schéma Article manquant");
else {
  if (!localArticleSchema.datePublished || !localArticleSchema.dateModified) failures.push("page locale Bordeaux: dates structurées manquantes");
  if (!Array.isArray(localArticleSchema.citation) || !localArticleSchema.citation.length) failures.push("page locale Bordeaux: citations officielles structurées manquantes");
}

const robots = await readFile(path.join(dist, "robots.txt"), "utf8");
for (const userAgent of ["OAI-SearchBot", "PerplexityBot", "Claude-SearchBot"]) {
  if (!robots.includes(`User-agent: ${userAgent}\nAllow: /`)) {
    failures.push(`robots.txt: autorisation explicite manquante pour ${userAgent}`);
  }
}

const headers = await readFile(path.join(dist, "_headers"), "utf8");
if (!headers.includes("/*.dc.html\n  X-Robots-Tag: noindex, nofollow")) {
  failures.push("_headers: protection .dc.html manquante");
}
if (!headers.includes("/*.dc\n  X-Robots-Tag: noindex, nofollow")) {
  failures.push("_headers: protection des URL .dc propres manquante");
}
if (!headers.includes("/support.js\n  Cache-Control: public, max-age=31536000, immutable")) {
  failures.push("_headers: cache immuable du runtime manquant");
}
if (!headers.includes("/consent.js\n  Cache-Control: public, max-age=31536000, immutable")) {
  failures.push("_headers: cache immuable du gestionnaire de consentement manquant");
}
if (!headers.includes("/vendor/*\n  Cache-Control: public, max-age=31536000, immutable")) {
  failures.push("_headers: cache immuable des dépendances manquant");
}
if (!headers.includes("/projet/*\n  Cache-Control: public, max-age=0, must-revalidate, no-transform")) {
  failures.push("_headers: protection du lien support manquante");
}

const consentScript = await readFile(path.join(dist, "consent.js"), "utf8");
for (const signal of ["ad_storage", "analytics_storage", "ad_user_data", "ad_personalization"]) {
  if (!consentScript.includes(signal)) failures.push(`consent.js: signal v2 manquant ${signal}`);
}
if (!consentScript.includes("xu36kqlw73")) failures.push("consent.js: identifiant Clarity manquant");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlFiles.length} HTML files with no structural errors.`);
}
