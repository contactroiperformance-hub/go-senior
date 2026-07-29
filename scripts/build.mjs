import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const origin = "https://go-senior.fr";
const analyticsTag = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HBZWTD0J4F"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-HBZWTD0J4F');
</script>`;
const clarityTag = `<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "xu36kqlw73");
</script>`;

const pages = [
  ["Accueil.dc.html", "/", true],
  ["Monte-escalier.dc.html", "/monte-escalier/", true],
  ["Douche-senior.dc.html", "/douche-senior/", true],
  ["MaPrimeAdapt.dc.html", "/maprimeadapt/", true],
  ["Guides.dc.html", "/guides/", true],
  ["Guide-prix-monte-escalier.dc.html", "/guides/prix-monte-escalier/", true],
  ["Guide-droit-tournant.dc.html", "/guides/monte-escalier-droit-ou-tournant/", true],
  ["Guide-aides-monte-escalier.dc.html", "/guides/aides-monte-escalier/", true],
  ["Guide-monte-escalier-exterieur.dc.html", "/guides/monte-escalier-exterieur/", true],
  ["Guide-occasion-location.dc.html", "/guides/monte-escalier-occasion-location/", true],
  ["Guide-delai-installation.dc.html", "/guides/delai-installation-monte-escalier/", true],
  ["Guide-prix-douche-senior.dc.html", "/guides/prix-douche-senior/", true],
  ["Guide-remplacer-baignoire-douche.dc.html", "/guides/remplacer-baignoire-par-douche/", true],
  ["Guide-douche-senior-pmr.dc.html", "/guides/douche-senior-ou-pmr/", true],
  ["Guide-baignoire-porte-douche.dc.html", "/guides/baignoire-a-porte-ou-douche/", true],
  ["Guide-equipements-douche.dc.html", "/guides/equipements-securiser-douche/", true],
  ["Guide-prix-salle-de-bain.dc.html", "/guides/prix-salle-de-bain-adaptee/", true],
  ["Guide-plafonds-ressources.dc.html", "/guides/plafonds-ressources/", true],
  ["Guide-apa-pch.dc.html", "/guides/apa-pch/", true],
  ["Formulaire.dc.html", "/projet/", false],
  ["Actualites.dc.html", "/actualites/", true],
  ["A-propos.dc.html", "/a-propos/", true],
  ["Methodologie.dc.html", "/methodologie-editoriale/", true],
  ["Contact.dc.html", "/contact/", true],
  ["Mentions-legales.dc.html", "/mentions-legales/", false],
  ["Conditions-generales.dc.html", "/conditions-generales/", false],
  ["Politique-confidentialite.dc.html", "/politique-de-confidentialite/", false],
  ["Politique-cookies.dc.html", "/politique-cookies/", false]
];

const routes = new Map(pages.map(([file, route]) => [file, route]));
routes.set("Banniere-cookies.dc.html", "/politique-cookies/");
routes.set("Actualite-modele.dc.html", "/actualites/");
routes.set("Modele-article.dc.html", "/guides/");
routes.set("Modele-departement.dc.html", "/monte-escalier/");
routes.set("Modele-ville.dc.html", "/monte-escalier/");
routes.set("Design-system.dc.html", "/");

function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function titleFrom(source) {
  return source.match(/<title>([\s\S]*?)<\/title>/i)?.[1]
    .replace(/<[^>]+>/g, "")
    .trim() || "Go Senior";
}

function descriptionFrom(source) {
  return source.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]
    || "Go Senior vous aide à comprendre les solutions, les prix et les aides pour adapter votre logement et préserver votre autonomie.";
}

function replaceLinks(source) {
  let result = source;
  for (const [file, route] of [...routes.entries()].sort((a, b) => b[0].length - a[0].length)) {
    result = result.replaceAll(file, route);
  }
  return result;
}

function addProductionHead(source, route, indexed) {
  const canonical = `${origin}${route}`;
  const title = titleFrom(source);
  const description = descriptionFrom(source);
  const social = [
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:locale" content="fr_FR">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Go Senior">`,
    `<meta property="og:title" content="${escapeAttribute(title)}">`,
    `<meta property="og:description" content="${escapeAttribute(description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta name="twitter:card" content="summary">`
  ].join("\n");

  let result = source.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*>/i, "");
  result = result.replace("</head>", `${analyticsTag}\n${clarityTag}\n</head>`);
  result = result.replace(
    "<helmet>",
    `<helmet>\n<meta name="robots" content="${indexed ? "index,follow" : "noindex,follow"}">\n${social}`
  );
  return result;
}

function transform(source, route = null, indexed = false) {
  let result = source
    .replaceAll("\u00a0!important", " !important")
    .replace("<html>", '<html lang="fr">')
    .replace(
      '<script src="./support.js"></script>',
      '<base href="/">\n<script src="/support.js"></script>'
    )
    .replaceAll('src="uploads/', 'src="/uploads/')
    .replaceAll('href="uploads/', 'href="/uploads/');

  result = replaceLinks(result);
  if (route) result = addProductionHead(result, route, indexed);
  return result;
}

async function writeRoute(route, content) {
  const directory = route === "/"
    ? dist
    : path.join(dist, route.replace(/^\/|\/$/g, ""));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), content);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const rootFiles = await readdir(root);
const designFiles = rootFiles.filter((name) => name.endsWith(".dc.html"));

for (const file of designFiles) {
  const source = await readFile(path.join(root, file), "utf8");
  await writeFile(path.join(dist, file), transform(source));
}

for (const [file, route, indexed] of pages) {
  const source = await readFile(path.join(root, file), "utf8");
  await writeRoute(route, transform(source, route, indexed));
}

await cp(path.join(root, "uploads"), path.join(dist, "uploads"), { recursive: true });
await cp(path.join(root, "support.js"), path.join(dist, "support.js"));

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages
    .filter(([, , indexed]) => indexed)
    .map(([, route]) => `  <url><loc>${origin}${route}</loc></url>`),
  "</urlset>",
  ""
].join("\n");

const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN

/*.dc.html
  X-Robots-Tag: noindex, nofollow

/uploads/*
  Cache-Control: public, max-age=31536000, immutable

/support.js
  Cache-Control: public, max-age=86400
`;

const redirects = [
  ...pages.map(([file, route]) => `/${file} ${route} 301`),
  ""
].join("\n");

const notFound = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Page introuvable — Go Senior</title>
  <style>
    body{margin:0;background:#FAF7F0;color:#22322B;font:18px/1.6 system-ui,sans-serif}
    main{max-width:720px;margin:12vh auto;padding:32px}
    h1{font:700 clamp(36px,6vw,60px)/1.1 Georgia,serif;color:#1F2E27}
    a{display:inline-block;margin-top:16px;padding:14px 22px;border-radius:10px;background:#2E5B4C;color:white;text-decoration:none;font-weight:700}
  </style>
</head>
<body><main><p>Erreur 404</p><h1>Cette page n’existe pas.</h1><p>Retrouvez nos guides et nos solutions depuis la page d’accueil.</p><a href="/">Retour à l’accueil</a></main></body>
</html>`;

await Promise.all([
  writeFile(path.join(dist, "sitemap.xml"), sitemap),
  writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`),
  writeFile(path.join(dist, "_headers"), headers),
  writeFile(path.join(dist, "_redirects"), redirects),
  writeFile(path.join(dist, "404.html"), notFound)
]);

console.log(`Built ${pages.length} production routes and ${designFiles.length} design components.`);
