import {
  effectivePublication,
  localPageRoute,
  publicNearbyLocations
} from "./schema.mjs";

const SERVICE_LABELS = Object.freeze({
  "monte-escalier": "Monte-escalier",
  "douche-senior": "Douche senior"
});

const SERVICE_GUIDES = Object.freeze({
  "monte-escalier": {
    national: "/monte-escalier/",
    price: "/guides/prix-monte-escalier/",
    priceLabel: "Voir le guide détaillé des prix",
    projectHeadingDepartment: "Types de monte-escalier",
    projectHeadingCity: "Configurations de projet à étudier"
  },
  "douche-senior": {
    national: "/douche-senior/",
    price: "/guides/prix-douche-senior/",
    priceLabel: "Voir le guide détaillé des prix",
    projectHeadingDepartment: "Transformations possibles",
    projectHeadingCity: "Votre installation actuelle et votre projet"
  }
});

const COVERAGE_CONTENT = Object.freeze({
  coverage_available: {
    background: "#EBF1E8",
    border: "#D7E2D2",
    color: "#2C463B",
    text: "Des professionnels prenant en charge ce type de projet interviennent dans votre secteur. Indiquez votre code postal pour vérifier les possibilités correspondant précisément à votre adresse."
  },
  coverage_partial: {
    background: "#FCF6E8",
    border: "#E6D8AE",
    color: "#5C4E22",
    text: "La disponibilité varie selon le code postal et le type de travaux. Indiquez votre adresse pour vérifier les possibilités dans votre secteur."
  },
  coverage_unavailable: {
    background: "#FCF6E8",
    border: "#E6D8AE",
    color: "#5C4E22",
    text: "Nous ne disposons pas actuellement d’une couverture confirmée pour ce code postal. Vous pouvez continuer à consulter nos guides et laisser une demande si le parcours opérationnel le permet."
  }
});

const SERVICE_DETAIL_LABELS = Object.freeze({
  "monte-escalier": {
    stairLocation: "Escalier intérieur ou extérieur",
    stairShape: "Escalier droit, tournant ou à déterminer",
    levels: "Nombre de niveaux",
    turns: "Virages",
    landings: "Paliers",
    width: "Largeur disponible",
    obstacles: "Obstacles à prendre en compte",
    railType: "Type de rail",
    possibleTimelines: "Délais possibles",
    availableModels: "Modèles disponibles"
  },
  "douche-senior": {
    currentInstallation: "Installation actuelle",
    bathReplacement: "Baignoire à remplacer",
    showerSecuring: "Douche à sécuriser",
    bathroomReconfiguration: "Salle de bain à réagencer",
    receiverType: "Type de receveur",
    extraFlatShower: "Douche extra-plate",
    walkInShower: "Douche de plain-pied",
    seat: "Siège",
    grabBars: "Barres d’appui",
    plumbing: "Plomberie",
    waterproofing: "Étanchéité",
    coownership: "Copropriété"
  }
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function section(title, content, gap = 14) {
  if (!content) return "";
  return `<section style="display:flex;flex-direction:column;gap:${gap}px">
      <h2 style="margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:clamp(25px,2.8vw,31px);color:#1F2E27">${escapeHtml(title)}</h2>
      ${content}
    </section>`;
}

function breadcrumb(page) {
  const guides = SERVICE_GUIDES[page.service];
  const serviceLabel = SERVICE_LABELS[page.service];
  const items = [
    { label: "Accueil", href: "/" },
    { label: serviceLabel, href: guides.national }
  ];
  if (page.pageLevel === "city") {
    items.push({
      label: page.departmentName,
      href: `/${page.service}/${page.departmentSlug}/`
    });
  }
  items.push({
    label: page.pageLevel === "city" ? page.cityName : page.departmentName,
    href: null
  });
  return `<nav aria-label="Fil d’Ariane" style="font-size:17px;color:#6B7A70;margin-bottom:20px">${items.map((item, index) => {
    const label = item.href
      ? `<a href="${escapeAttribute(item.href)}" style="color:#2E5B4C;text-decoration:none" style-hover="text-decoration:underline">${escapeHtml(item.label)}</a>`
      : `<span aria-current="page">${escapeHtml(item.label)}</span>`;
    return `${index ? ' <span aria-hidden="true">›</span> ' : ""}${label}`;
  }).join("")}</nav>`;
}

export function breadcrumbData(page) {
  const guides = SERVICE_GUIDES[page.service];
  const items = [
    { name: "Accueil", route: "/" },
    { name: SERVICE_LABELS[page.service], route: guides.national }
  ];
  if (page.pageLevel === "city") {
    items.push({
      name: page.departmentName,
      route: `/${page.service}/${page.departmentSlug}/`
    });
  }
  items.push({
    name: page.pageLevel === "city" ? page.cityName : page.departmentName,
    route: localPageRoute(page)
  });
  return items;
}

function blocProjet(page, title = "") {
  const city = page.pageLevel === "city" ? ` ville="${escapeAttribute(page.cityName)}"` : "";
  return `<dc-import name="BlocProjet"${city} projet="${escapeAttribute(page.cta.project)}" cp-exemple="${escapeAttribute(page.cta.postalCodeExample)}" title="${escapeAttribute(title)}" hint-size="100%,300px"></dc-import>`;
}

function hero(page) {
  const introduction = page.introduction
    ? `<p style="margin:0;font-size:20.5px;color:#41504A">${escapeHtml(page.introduction)}</p>`
    : "";
  return `<section style="background:linear-gradient(180deg,#F3EFE4 0%,#FAF7F0 100%);border-bottom:1px solid #E5DFD2">
    <div style="max-width:1200px;margin:0 auto;padding:40px 24px 52px">
      ${breadcrumb(page)}
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr));gap:44px;align-items:center">
        <div style="display:flex;flex-direction:column;gap:16px;max-width:620px">
          <h1 style="margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:clamp(32px,3.8vw,46px);line-height:1.15;letter-spacing:-0.015em;color:#1F2E27;text-wrap:balance">${escapeHtml(page.h1)}</h1>
          ${introduction}
        </div>
        ${blocProjet(page, page.cta.title)}
      </div>
    </div>
  </section>`;
}

function draftBanner(publication) {
  if (publication.status !== "draft") return "";
  return `<div data-local-draft-banner style="background:#5C4E22;padding:12px 24px;display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;justify-content:center">
    <span style="background:#E9B44C;color:#1F2E27;font-weight:700;font-size:14.5px;letter-spacing:0.06em;text-transform:uppercase;padding:4px 12px;border-radius:999px">Brouillon</span>
    <span style="font-size:16.5px;color:#F5EBD0;text-align:center">Données locales incomplètes — page non indexable et absente des sitemaps. Les modules sans données vérifiées sont masqués.</span>
  </div>`;
}

function scopeSection(page) {
  if (!page.geographicScope) return "";
  return section(
    "Périmètre de ce guide",
    `<p style="margin:0;color:#41504A">${escapeHtml(page.geographicScope)}</p>`
  );
}

function priceSection(page) {
  if (!page.nationalPriceReference?.length) return "";
  const place = page.pageLevel === "city"
    ? `à ${page.cityName}`
    : `dans le ${page.departmentName}`;
  const label = page.service === "douche-senior" ? "une douche senior" : "un monte-escalier";
  const guide = SERVICE_GUIDES[page.service];
  const rows = page.nationalPriceReference.map((item) => `
        <div style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:16px 22px;display:flex;flex-wrap:wrap;gap:8px 20px;align-items:baseline;justify-content:space-between">
          <span style="font-size:17.5px;font-weight:600;color:#1F2E27">${escapeHtml(item.label)}</span>
          <span style="font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:21px;color:#2E5B4C">${escapeHtml(item.range)}</span>
        </div>`).join("");
  return section(
    `Quel budget prévoir pour ${label} ${place} ?`,
    `<div data-local-price-block style="display:flex;flex-direction:column;gap:10px">${rows}
      </div>
      <p style="margin:0;color:#41504A">Ces montants sont des repères nationaux, pas un devis ni un prix local. Le coût dépend de la configuration du logement et du projet. <a href="${guide.price}">${guide.priceLabel}</a>.</p>`
  );
}

function inseeCard(datum) {
  const value = typeof datum.value === "number"
    ? new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(datum.value)
    : datum.value;
  const unit = datum.unit === "%" ? " %" : datum.unit ? ` ${datum.unit}` : "";
  return `<div data-local-insee-card style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:4px">
    <span style="font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:28px;color:#2E5B4C">${escapeHtml(value)}${escapeHtml(unit)}</span>
    <span style="font-size:16.5px;color:#41504A">${escapeHtml(datum.indicator)}</span>
    <span style="font-size:15.5px;color:#6B7A70">${escapeHtml(datum.source)} · ${escapeHtml(datum.vintage)} · ${escapeHtml(datum.geography)} · code INSEE ${escapeHtml(datum.inseeCode)} · récupéré le ${escapeHtml(datum.retrievedAt)}</span>
  </div>`;
}

function localDataSection(page) {
  const data = [...(page.demographicData || []), ...(page.housingData || [])];
  if (!data.length) return "";
  const place = page.pageLevel === "city" ? page.cityName : `Le ${page.departmentName}`;
  const commentary = page.localHousingCommentary
    ? `<p style="margin:0;color:#41504A">${escapeHtml(page.localHousingCommentary)}</p>`
    : "";
  return section(
    `${place} en quelques repères`,
    `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px">
        ${data.map(inseeCard).join("")}
      </div>
      ${commentary}`,
    18
  );
}

function projectOptionsSection(page) {
  if (!page.projectOptions?.length) return "";
  const heading = page.pageLevel === "city"
    ? SERVICE_GUIDES[page.service].projectHeadingCity
    : SERVICE_GUIDES[page.service].projectHeadingDepartment;
  const cards = page.projectOptions.map((option) => `<a href="${escapeAttribute(option.href)}" style="text-decoration:none;background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:8px" style-hover="border-color:#2E5B4C;box-shadow:0 6px 18px rgba(34,50,43,0.10)">
          <h3 style="margin:0;font-size:19px;font-weight:600;color:#1F2E27">${escapeHtml(option.title)}</h3>
          <p style="margin:0;font-size:16.5px;color:#41504A">${escapeHtml(option.description)}</p>
          <span style="margin-top:auto;font-weight:600;font-size:16.5px;color:#2E5B4C">Décrire ce projet ›</span>
        </a>`).join("");
  const coownership = page.service === "douche-senior" && page.coownershipConsiderations
    ? `<div style="background:#EBF1E8;border:1px solid #D7E2D2;border-radius:14px;padding:18px 22px"><p style="margin:0;font-size:17px;color:#2C463B"><strong>En copropriété</strong> — ${escapeHtml(page.coownershipConsiderations)}</p></div>`
    : "";
  return section(
    heading,
    `<div data-local-project-options style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px">${cards}</div>${coownership}`,
    18
  );
}

function displayDetailValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(" · ");
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object" && typeof value.label === "string") return value.label;
  return "";
}

function serviceSpecificSection(page) {
  const labels = SERVICE_DETAIL_LABELS[page.service] || {};
  const details = Object.entries(labels)
    .map(([field, label]) => ({
      label,
      value: displayDetailValue(page.serviceDetails?.[field])
    }))
    .filter((item) => item.value);
  if (!details.length) return "";
  const heading = page.service === "monte-escalier"
    ? "Caractéristiques du monte-escalier à étudier"
    : "Éléments de la douche à étudier";
  return section(
    heading,
    `<div data-local-service-details="${escapeAttribute(page.service)}" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px">${details.map((item) => `<div style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:6px">
      <h3 style="margin:0;font-size:18.5px;font-weight:600;color:#1F2E27">${escapeHtml(item.label)}</h3>
      <p style="margin:0;font-size:16.5px;color:#41504A">${escapeHtml(item.value)}</p>
    </div>`).join("")}</div>`,
    18
  );
}

function localCostSection(page) {
  if (!page.localCostFactors?.length) return "";
  return section(
    "Facteurs locaux pouvant influencer le projet",
    `<ul style="margin:0;padding-left:24px;color:#41504A">${page.localCostFactors.map((factor) => `<li>${escapeHtml(factor)}</li>`).join("")}</ul>`
  );
}

function resourceCard(item) {
  return `<a href="${escapeAttribute(item.url)}" style="text-decoration:none;background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:4px" style-hover="border-color:#2E5B4C">
    <span style="font-weight:600;font-size:18px;color:#1F2E27">${escapeHtml(item.title)}</span>
    ${item.description ? `<span style="font-size:16.5px;color:#41504A">${escapeHtml(item.description)}</span>` : ""}
    <span style="font-size:16.5px;color:#6B7A70">${escapeHtml(item.organization)} · vérifié le ${escapeHtml(item.checkedAt)}</span>
  </a>`;
}

function resourcesSection(page) {
  const resources = [...(page.localAssistancePrograms || []), ...(page.usefulLocalContacts || [])];
  if (!resources.length) return "";
  return section(
    "Aides locales et contacts utiles",
    `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">${resources.map(resourceCard).join("")}</div>`
  );
}

function coverageSection(page) {
  const coverage = COVERAGE_CONTENT[page.professionalCoverageStatus];
  const place = page.pageLevel === "city"
    ? `à ${page.cityName}`
    : `dans le ${page.departmentName}`;
  return section(
    `Professionnels intervenant ${place}`,
    `<div data-coverage="${escapeAttribute(page.professionalCoverageStatus)}" style="background:${coverage.background};border:1px solid ${coverage.border};border-radius:14px;padding:18px 22px">
      <p style="margin:0;font-size:17.5px;color:${coverage.color}">${escapeHtml(coverage.text)}</p>
    </div>`
  );
}

function processSection() {
  const steps = [
    ["Décrivez votre projet", "Indiquez votre logement, le projet recherché et votre code postal — gratuit et sans engagement."],
    ["Nous vérifions le secteur", "Go Senior vérifie si un professionnel indépendant prenant en charge ce type de travaux intervient dans votre zone."],
    ["Échangez sur votre projet", "Lorsqu’une solution est disponible, un professionnel peut vous recontacter pour préciser le besoin et préparer un devis personnalisé. Vous restez libre à chaque étape."]
  ];
  return section(
    "Comment fonctionne la mise en relation ?",
    `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px">${steps.map((step, index) => `<div style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:10px">
          <span style="width:34px;height:34px;border-radius:50%;background:#EBF1E8;color:#2E5B4C;font-weight:700;font-size:17px;display:flex;align-items:center;justify-content:center">${index + 1}</span>
          <h3 style="margin:0;font-size:19px;font-weight:600;color:#1F2E27">${escapeHtml(step[0])}</h3>
          <p style="margin:0;font-size:16.5px;color:#41504A">${escapeHtml(step[1])}</p>
        </div>`).join("")}</div>
      <p style="margin:0;font-size:16.5px;color:#6B7A70">Mise en relation un à un : votre demande est transmise à un seul professionnel intervenant dans votre secteur.</p>`,
    18
  );
}

function faqSection(page) {
  if (!page.faq?.length) return "";
  const place = page.pageLevel === "city" ? ` à ${page.cityName}` : ` dans le ${page.departmentName}`;
  const items = page.faq.map((item) => `<details data-local-faq style-hover="border-color:#2E5B4C;background:#FDFCF9" style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:0 22px">
        <summary style="cursor:pointer;font-weight:600;font-size:19px;color:#1F2E27;padding:17px 0;list-style:none;display:flex;justify-content:space-between;gap:12px">${escapeHtml(item.question)}<span style="color:#2E5B4C" aria-hidden="true">+</span></summary>
        <p style="margin:0;padding:0 0 17px;font-size:18px;color:#41504A">${escapeHtml(item.answer)}</p>
      </details>`).join("");
  return section(
    `Questions fréquentes${place}`,
    `<div style="display:flex;flex-direction:column;gap:10px">${items}</div>`,
    16
  );
}

function nearbySection(page, allPages) {
  const nearby = publicNearbyLocations(page, allPages);
  if (!nearby.length) return "";
  const links = nearby.map((item) => `<a href="${escapeAttribute(localPageRoute(item))}" style="border:1px solid #C9C2B2;border-radius:999px;padding:9px 18px;text-decoration:none;font-weight:600">${escapeHtml(item.cityName || item.departmentName)}</a>`).join("");
  const heading = page.pageLevel === "department"
    ? `Villes du ${page.departmentName} déjà publiées`
    : "Villes voisines";
  return section(
    heading,
    `<div data-local-nearby style="display:flex;flex-wrap:wrap;gap:12px">${links}</div>`
  );
}

function sourcesSection(page) {
  if (!page.officialSources?.length) return "";
  const sources = page.officialSources.map((source) => `<a href="${escapeAttribute(source.url)}" style="text-decoration:none;background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:4px" style-hover="border-color:#2E5B4C">
      <span style="font-weight:600;font-size:18px;color:#1F2E27">${escapeHtml(source.organization)} — ${escapeHtml(source.title)}</span>
      <span style="font-size:16.5px;color:#41504A">${escapeHtml(source.supports)} · données ${escapeHtml(source.dataDate)}</span>
      <span style="font-size:16.5px;color:#6B7A70">Consulté le ${escapeHtml(source.checkedAt)}</span>
    </a>`).join("");
  return section(
    "Sources officielles",
    `<div data-local-sources style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">${sources}</div>`
  );
}

function finalCta(page) {
  const place = page.pageLevel === "city" ? ` à ${page.cityName}` : ` dans le ${page.departmentName}`;
  const conclusion = page.conclusion
    ? `<p style="margin:0;font-size:18.5px;color:#C6D7CB">${escapeHtml(page.conclusion)}</p>`
    : `<p style="margin:0;font-size:18.5px;color:#C6D7CB">Indiquez votre code postal pour vérifier les possibilités dans votre secteur.</p>`;
  return `<section style="background:#1F4237;border-radius:20px;padding:clamp(28px,4vw,44px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:32px;align-items:center">
    <div style="display:flex;flex-direction:column;gap:10px">
      <h2 style="margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:clamp(24px,2.8vw,30px);color:#FFFFFF">Votre projet${escapeHtml(place)}</h2>
      ${conclusion}
    </div>
    ${blocProjet(page)}
  </section>`;
}

function templateBody(page, allPages) {
  const publication = effectivePublication(page);
  return `${draftBanner(publication)}
  ${hero(page)}
  <div style="max-width:1200px;margin:0 auto;padding:56px 24px 88px;display:flex;flex-direction:column;gap:56px">
    ${scopeSection(page)}
    ${priceSection(page)}
    ${localDataSection(page)}
    ${projectOptionsSection(page)}
    ${serviceSpecificSection(page)}
    ${localCostSection(page)}
    ${resourcesSection(page)}
    ${coverageSection(page)}
    ${processSection()}
    ${faqSection(page)}
    ${nearbySection(page, allPages)}
    ${sourcesSection(page)}
    ${finalCta(page)}
  </div>`;
}

function renderDocument(page, allPages, template) {
  const active = page.service;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${escapeAttribute(page.metaDescription)}">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&amp;family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&amp;display=swap" rel="stylesheet">
<style>
html,body{overflow-x:hidden;max-width:100%}
img{max-width:100%;height:auto}
.gsh-desk{display:flex}.gsh-mob{display:none}.gsh-bar{display:none}
@media(max-width:1060px){.gsh-desk{display:none !important}.gsh-mob{display:flex !important}.gsh-bar{display:flex !important}body{padding-bottom:76px}}
body{margin:0;background:#FAF7F0;font-family:'Libre Franklin',system-ui,sans-serif;color:#22322B;font-size:19.5px;line-height:1.65}
a{color:#2E5B4C}a:hover{color:#1F4237}
:focus-visible{outline:3px solid #C05A2E;outline-offset:2px;border-radius:4px}
details summary::-webkit-details-marker{display:none}
</style>
<title>${escapeHtml(page.seoTitle)}</title>
</helmet>
<dc-import name="Header" active="${escapeAttribute(active)}" hint-size="100%,78px"></dc-import>
<main data-local-page="${escapeAttribute(page.id)}" data-local-template="${escapeAttribute(template)}">
  ${templateBody(page, allPages)}
</main>
<dc-import name="Footer" hint-size="100%,520px"></dc-import>
</x-dc>
</body>
</html>`;
}

export function renderMonteEscalierDepartment(page, allPages) {
  return renderDocument(page, allPages, "monte-escalier-department");
}

export function renderMonteEscalierCity(page, allPages) {
  return renderDocument(page, allPages, "monte-escalier-city");
}

export function renderDoucheSeniorDepartment(page, allPages) {
  return renderDocument(page, allPages, "douche-senior-department");
}

export function renderDoucheSeniorCity(page, allPages) {
  return renderDocument(page, allPages, "douche-senior-city");
}

const TEMPLATES = Object.freeze({
  "monte-escalier-department": renderMonteEscalierDepartment,
  "monte-escalier-city": renderMonteEscalierCity,
  "douche-senior-department": renderDoucheSeniorDepartment,
  "douche-senior-city": renderDoucheSeniorCity
});

export function renderLocalPage(page, allPages) {
  const key = `${page.service}-${page.pageLevel}`;
  const template = TEMPLATES[key];
  if (!template) throw new Error(`Template local inconnu: ${key}`);
  return template(page, allPages);
}
