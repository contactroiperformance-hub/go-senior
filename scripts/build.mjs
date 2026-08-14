import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform as minifyJavaScript } from "esbuild";
import { localPages } from "../local-pages/data.mjs";
import {
  containsPublicPlaceholder,
  effectivePublication,
  isPublicLocalPage,
  localSitemapUrls,
  localPageRoute,
  similarityReport,
  sitemapXml,
  validateLocalPage
} from "../local-pages/schema.mjs";
import { breadcrumbData, renderDepartmentDirectory, renderLocalPage } from "../local-pages/render.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const origin = "https://go-senior.fr";
const departmentDirectoryRoutes = Object.freeze({
  "monte-escalier": "/monte-escalier/departements/",
  "douche-senior": "/douche-senior/departements/"
});
const organizationId = `${origin}/#organization`;
const websiteId = `${origin}/#website`;
const defaultSocialImage = `${origin}/uploads/cover-linkedin-1584x396.png`;
const supportSource = await readFile(path.join(root, "support.js"), "utf8");
const supportVersion = createHash("sha256").update(supportSource).digest("hex").slice(0, 10);
const consentSource = await readFile(path.join(root, "consent.js"), "utf8");
const consentVersion = createHash("sha256").update(consentSource).digest("hex").slice(0, 10);
const fontHead = `<link rel="preload" href="/uploads/fonts/libre-franklin-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/uploads/fonts/source-serif-4-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face{font-family:'Libre Franklin';font-style:normal;font-weight:100 900;font-display:swap;src:url('/uploads/fonts/libre-franklin-latin.woff2') format('woff2')}
@font-face{font-family:'Source Serif 4';font-style:normal;font-weight:200 900;font-display:swap;src:url('/uploads/fonts/source-serif-4-latin.woff2') format('woff2')}
</style>`;
const consentBootstrap = `<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });
</script>`;
const analyticsTag = `<!-- Google tag (gtag.js) — Consent Mode v2 advanced -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HBZWTD0J4F"></script>
<script>
  gtag('js', new Date());

  gtag('config', 'G-HBZWTD0J4F');
</script>`;
const consentTag = `<script defer src="/consent.js?v=${consentVersion}"></script>`;

const missingDescriptions = new Map([
  ["Accueil.dc.html", "Découvrez les solutions pour adapter votre logement, comprenez les prix et les aides disponibles, puis trouvez des professionnels pouvant intervenir dans votre secteur."],
  ["Monte-escalier.dc.html", "Comparez les modèles droits, tournants et extérieurs, comprenez les coûts et vérifiez les solutions disponibles dans votre secteur."],
  ["Douche-senior.dc.html", "Comparez les solutions de douche à accès facilité, les équipements disponibles, les coûts et les possibilités d’intervention près de chez vous."],
  ["MaPrimeAdapt.dc.html", "MaPrimeAdapt’ est une aide publique destinée à financer une partie des travaux qui rendent un logement plus adapté à la perte d’autonomie ou au handicap."],
  ["Guides.dc.html", "Des explications claires et indépendantes sur les solutions, les prix et les aides."],
  ["Formulaire.dc.html", "Décrivez votre projet et indiquez votre code postal pour vérifier les solutions disponibles dans votre secteur."],
  ["A-propos.dc.html", "Go Senior aide les seniors et leurs proches à préparer l’adaptation de leur logement : comprendre les solutions, situer les coûts et connaître les aides."],
  ["Methodologie.dc.html", "Des décisions importantes méritent des explications fiables. Voici les règles que nous appliquons à chaque page du site."],
  ["Contact.dc.html", "Une question sur le service, un guide à corriger, une demande concernant vos données ? Voici comment nous joindre."]
]);

const sharedComponents = new Set([
  "BlocProjet.dc.html",
  "Footer.dc.html",
  "Header.dc.html",
  "MiniFormulaire.dc.html",
  "EstimateurBudget.dc.html",
  "Simulateur.dc.html"
]);
const localModelFiles = new Set([
  "Modele-departement.dc.html",
  "Modele-ville.dc.html",
  "Modele-departement-douche.dc.html",
  "Modele-ville-douche.dc.html"
]);

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
  // Les contenus actuels sont des fixtures éditoriales : la route reste
  // consultable, mais ne doit entrer dans l'index qu'avec de vrais articles.
  ["Actualites.dc.html", "/actualites/", false],
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
routes.set("Modele-departement-douche.dc.html", "/douche-senior/");
routes.set("Modele-ville-douche.dc.html", "/douche-senior/");
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

function descriptionFrom(source, file) {
  return source.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]
    || missingDescriptions.get(file)
    || "Go Senior vous aide à comprendre les solutions, les prix et les aides pour adapter votre logement et préserver votre autonomie.";
}

function cleanTitle(title) {
  return title
    .replace(/\s+[—|]\s+Go Senior$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function imageFrom(source) {
  const match = source.match(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/i);
  if (!match) return { url: defaultSocialImage, alt: "Go Senior" };
  const alt = match[0].match(/\balt="([^"]*)"/i)?.[1] || "Go Senior";
  return {
    url: new URL(match[1], origin).href,
    alt
  };
}

function structuredData(route, title, description, customBreadcrumbs = null) {
  const canonical = `${origin}${route}`;
  const graph = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Go Senior",
      legalName: "DIGITAL NETWORK ACQUISITION (DNA)",
      url: `${origin}/`,
      email: "support@go-senior.fr",
      address: {
        "@type": "PostalAddress",
        streetAddress: "73 rue du Château",
        postalCode: "92100",
        addressLocality: "Boulogne-Billancourt",
        addressCountry: "FR"
      }
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${origin}/`,
      name: "Go Senior",
      inLanguage: "fr-FR",
      publisher: { "@id": organizationId }
    },
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      inLanguage: "fr-FR",
      isPartOf: { "@id": websiteId },
      publisher: { "@id": organizationId }
    }
  ];

  if (route !== "/") {
    let items;
    if (customBreadcrumbs?.length) {
      items = customBreadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: new URL(item.route, origin).href
      }));
    } else {
      const parts = route.split("/").filter(Boolean);
      items = [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: `${origin}/`
        }
      ];
      if (parts[0] === "guides" && parts.length > 1) {
        items.push({
          "@type": "ListItem",
          position: 2,
          name: "Guides",
          item: `${origin}/guides/`
        });
      }
      items.push({
        "@type": "ListItem",
        position: items.length + 1,
        name: cleanTitle(title),
        item: canonical
      });
    }
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: items
    });
    graph[2].breadcrumb = { "@id": `${canonical}#breadcrumb` };
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph
  }).replaceAll("<", "\\u003c");
}

function stripRuntimeMetadata(source) {
  return source
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*>\s*/i, "")
    .replace(/<meta\s+name="robots"\s+content="[^"]*"\s*>\s*/i, "")
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*>\s*/i, "");
}

function stripSharedFontHead(source) {
  return source
    .replace(/<link\s+rel="preconnect"\s+href="https:\/\/fonts\.googleapis\.com"\s*>\s*/gi, "")
    .replace(/<link\s+rel="preconnect"\s+href="https:\/\/fonts\.gstatic\.com"\s+crossorigin(?:="")?\s*>\s*/gi, "")
    .replace(/<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+"\s+rel="stylesheet"\s*>\s*/gi, "");
}

function addImageLoadingPolicy(source, file) {
  let imageIndex = 0;
  return source.replace(/<img\b(?![^>]*\bloading=)([^>]*)>/gi, (match, attributes) => {
    const shouldPrioritize = file !== "Accueil.dc.html" && imageIndex === 0;
    imageIndex += 1;
    const loading = shouldPrioritize
      ? ' loading="eager" fetchpriority="high"'
      : ' loading="lazy" fetchpriority="low"';
    return `<img${loading} decoding="async"${attributes}>`;
  });
}

function replaceLinks(source) {
  let result = source;
  for (const [file, route] of [...routes.entries()].sort((a, b) => b[0].length - a[0].length)) {
    result = result.replaceAll(file, route);
  }
  return result;
}

function protectFrenchColons(source) {
  return source.replace(
    /<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]+>|[^<]+/gi,
    (token) => token.startsWith("<") ? token : token.replace(/ (?=:)/g, "\u00a0")
  );
}

function protectVisibleEmailAddresses(source) {
  const fragments = [];
  const reserve = (fragment) => {
    const placeholder = `GO_SENIOR_PROTECTED_EMAIL_${fragments.length}_PLACEHOLDER`;
    fragments.push({ placeholder, fragment });
    return placeholder;
  };

  let result = source.replace(
    /<!--email_off-->[\s\S]*?<!--\/email_off-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi,
    (fragment) => reserve(fragment)
  );

  result = result.replace(
    /<a\b[^>]*\bhref=["']mailto:[^"']+["'][^>]*>[\s\S]*?<\/a>/gi,
    (anchor) => reserve(`<!--email_off-->${anchor}<!--/email_off-->`)
  );

  result = result.replace(/<[^>]+>|[^<]+/g, (token) => {
    if (token.startsWith("<")) return token;
    return token.replace(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
      (email) => `<!--email_off-->${email}<!--/email_off-->`
    );
  });

  for (const { placeholder, fragment } of fragments) {
    result = result.replaceAll(placeholder, fragment);
  }
  return result;
}

function addProductionHead(source, file, route, indexed, options = {}) {
  const canonical = `${origin}${route}`;
  const title = titleFrom(source);
  const description = descriptionFrom(source, file);
  const image = imageFrom(source);
  const robots = indexed
    ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    : "noindex,follow";
  const social = [
    `<title>${title}</title>`,
    `<meta name="description" content="${escapeAttribute(description)}">`,
    `<meta name="robots" content="${robots}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<link rel="alternate" hreflang="fr-FR" href="${canonical}">`,
    `<meta property="og:locale" content="fr_FR">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Go Senior">`,
    `<meta property="og:title" content="${escapeAttribute(title)}">`,
    `<meta property="og:description" content="${escapeAttribute(description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${escapeAttribute(image.url)}">`,
    `<meta property="og:image:alt" content="${escapeAttribute(image.alt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttribute(title)}">`,
    `<meta name="twitter:description" content="${escapeAttribute(description)}">`,
    `<meta name="twitter:image" content="${escapeAttribute(image.url)}">`,
    `<meta name="author" content="Go Senior">`,
    `<meta name="theme-color" content="#1F4237">`,
    `<script type="application/ld+json">${structuredData(route, title, description, options.breadcrumbs)}</script>`
  ].join("\n");

  let result = stripRuntimeMetadata(stripSharedFontHead(source));
  result = result.replace(
    "</head>",
    `${social}\n${fontHead}\n${consentBootstrap}\n${analyticsTag}\n${consentTag}\n</head>`
  );
  return result;
}

function transform(source, file, route = null, indexed = false, stripSharedFonts = false, options = {}) {
  let result = source
    .replaceAll("\u00a0!important", " !important")
    .replace("<html>", '<html lang="fr">')
    .replace(
      '<script src="./support.js"></script>',
      `<base href="/">
<script defer src="/vendor/react-18.3.1.min.js"></script>
<script defer src="/vendor/react-dom-18.3.1.min.js"></script>
<script defer src="/support.js?v=${supportVersion}"></script>`
    )
    .replaceAll('src="uploads/', 'src="/uploads/')
    .replaceAll('href="uploads/', 'href="/uploads/');

  result = replaceLinks(result);
  result = addImageLoadingPolicy(result, file);
  if (stripSharedFonts) result = stripSharedFontHead(result);
  if (route) result = addProductionHead(result, file, route, indexed, options);
  result = protectFrenchColons(result);
  result = protectVisibleEmailAddresses(result);
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
const designFiles = rootFiles.filter(
  (name) => name.endsWith(".dc.html") && !localModelFiles.has(name)
);

const localSchemaErrors = localPages.flatMap((page) =>
  validateLocalPage(page).map((error) => `${page.id}: ${error}`)
);
if (localSchemaErrors.length) {
  throw new Error(`Schéma local invalide:\n${localSchemaErrors.join("\n")}`);
}
const localSimilarityIssues = similarityReport(
  localPages.filter((page) => page.status === "published")
);
if (localSimilarityIssues.length) {
  throw new Error(`Contenus locaux trop similaires:\n${JSON.stringify(localSimilarityIssues, null, 2)}`);
}

for (const file of designFiles) {
  const source = await readFile(path.join(root, file), "utf8");
  await writeFile(
    path.join(dist, file),
    transform(source, file, null, false, sharedComponents.has(file))
  );
}

for (const [file, route, indexed] of pages) {
  const source = await readFile(path.join(root, file), "utf8");
  await writeRoute(route, transform(source, file, route, indexed));
}

for (const [service, departmentDirectoryRoute] of Object.entries(departmentDirectoryRoutes)) {
  const serviceLabel = service === "douche-senior" ? "Douche senior" : "Monte-escalier";
  await writeRoute(
    departmentDirectoryRoute,
    transform(
      renderDepartmentDirectory(localPages, service),
      `${service}-departements.generated.html`,
      departmentDirectoryRoute,
      true,
      false,
      {
        breadcrumbs: [
          { name: "Accueil", route: "/" },
          { name: serviceLabel, route: `/${service}/` },
          { name: "Départements", route: departmentDirectoryRoute }
        ]
      }
    )
  );
}

for (const page of localPages) {
  const publication = effectivePublication(page);
  const source = renderLocalPage(page, localPages);
  if (publication.status === "published" && containsPublicPlaceholder(source)) {
    throw new Error(`${page.id}: placeholder ou instruction éditoriale détecté dans le contenu public rendu`);
  }
  await writeRoute(
    localPageRoute(page),
    transform(
      source,
      `${page.id}.local.html`,
      localPageRoute(page),
      publication.indexStatus === "index",
      false,
      { breadcrumbs: breadcrumbData(page) }
    )
  );
}

await cp(path.join(root, "uploads"), path.join(dist, "uploads"), { recursive: true });
await cp(path.join(root, "vendor"), path.join(dist, "vendor"), { recursive: true });
const minifiedSupport = await minifyJavaScript(supportSource, {
  minify: true,
  target: "es2020"
});
const minifiedConsent = await minifyJavaScript(consentSource, {
  minify: true,
  target: "es2020"
});
await writeFile(path.join(dist, "support.js"), minifiedSupport.code);
await writeFile(path.join(dist, "consent.js"), minifiedConsent.code);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages
    .filter(([, , indexed]) => indexed)
    .map(([, route]) => `  <url><loc>${origin}${route}</loc></url>`),
  ...Object.values(departmentDirectoryRoutes)
    .map((route) => `  <url><loc>${origin}${route}</loc></url>`),
  ...localPages
    .filter(isPublicLocalPage)
    .map((page) => `  <url><loc>${origin}${localPageRoute(page)}</loc></url>`),
  "</urlset>",
  ""
].join("\n");

const localSitemapDefinitions = [
  ["monte-escalier-departements.xml", "monte-escalier", "department"],
  ["monte-escalier-villes.xml", "monte-escalier", "city"],
  ["douche-senior-departements.xml", "douche-senior", "department"],
  ["douche-senior-villes.xml", "douche-senior", "city"]
];
const localSitemaps = localSitemapDefinitions.map(([file, service, pageLevel]) => {
  const urls = localSitemapUrls(localPages, origin, service, pageLevel);
  return [file, sitemapXml(urls)];
});

const draftHeaders = localPages
  .filter((page) => effectivePublication(page).status === "draft")
  .map((page) => `${localPageRoute(page)}\n  X-Robots-Tag: noindex, follow`)
  .join("\n\n");

const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN

/*.dc.html
  X-Robots-Tag: noindex, nofollow

/*.dc
  X-Robots-Tag: noindex, nofollow

/uploads/*
  Cache-Control: public, max-age=31536000, immutable

/support.js
  Cache-Control: public, max-age=31536000, immutable

/consent.js
  Cache-Control: public, max-age=31536000, immutable

/vendor/*
  Cache-Control: public, max-age=31536000, immutable

/projet/*
  Cache-Control: public, max-age=0, must-revalidate, no-transform

${draftHeaders}
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

await mkdir(path.join(dist, "sitemaps"), { recursive: true });
await Promise.all([
  writeFile(path.join(dist, "sitemap.xml"), sitemap),
  writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`),
  writeFile(path.join(dist, "_headers"), headers),
  writeFile(path.join(dist, "_redirects"), redirects),
  writeFile(path.join(dist, "404.html"), notFound),
  ...localSitemaps.map(([file, content]) =>
    writeFile(path.join(dist, "sitemaps", file), content)
  )
]);

console.log(`Built ${pages.length + localPages.length + Object.keys(departmentDirectoryRoutes).length} production routes and ${designFiles.length} design components.`);
