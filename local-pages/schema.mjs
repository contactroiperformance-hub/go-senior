export const LOCAL_PAGE_FIELDS = Object.freeze([
  "id",
  "service",
  "pageLevel",
  "regionName",
  "regionSlug",
  "departmentName",
  "departmentSlug",
  "departmentCode",
  "cityName",
  "citySlug",
  "inseeCode",
  "postalCodes",
  "intercommunalityName",
  "seoTitle",
  "metaDescription",
  "h1",
  "introduction",
  "geographicScope",
  "nationalPriceReference",
  "localCostFactors",
  "demographicData",
  "housingData",
  "localHousingCommentary",
  "projectOptions",
  "coownershipConsiderations",
  "localAssistancePrograms",
  "usefulLocalContacts",
  "professionalCoverageStatus",
  "coveredPostalCodes",
  "nearbyLocations",
  "faq",
  "officialSources",
  "conclusion",
  "cta",
  "sourceCheckedAt",
  "status",
  "indexStatus",
  "sitemapStatus",
  "publishedAt",
  "updatedAt"
]);

export const SERVICES = Object.freeze(["monte-escalier", "douche-senior"]);
export const PAGE_LEVELS = Object.freeze(["department", "city"]);
export const COVERAGE_STATUSES = Object.freeze([
  "coverage_available",
  "coverage_partial",
  "coverage_unavailable"
]);
export const CONTENT_STATUSES = Object.freeze(["draft", "published"]);
export const INDEX_STATUSES = Object.freeze(["noindex", "index"]);
export const SITEMAP_STATUSES = Object.freeze(["excluded", "included"]);

const PLACEHOLDER_PATTERN =
  /\[(?:x(?:\s|%|hab|\.)|année|url|date|introduction|question|réponse|conclusion|source|dispositif|adresse|configuration|commune|facteur)[^\]]*\]|\{\{[^}]+\}\}|lorem ipsum/i;

const SERVICE_FIELDS = Object.freeze({
  "monte-escalier": [
    "stairLocation",
    "stairShape",
    "levels",
    "turns",
    "landings",
    "width",
    "obstacles",
    "railType",
    "possibleTimelines",
    "availableModels",
    "nationalPriceRanges",
    "projectAssistance"
  ],
  "douche-senior": [
    "currentInstallation",
    "bathReplacement",
    "showerSecuring",
    "bathroomReconfiguration",
    "receiverType",
    "extraFlatShower",
    "walkInShower",
    "seat",
    "grabBars",
    "plumbing",
    "waterproofing",
    "coownership",
    "nationalPriceRanges",
    "projectAssistance"
  ]
});

const CROSS_SERVICE_FIELDS = Object.freeze({
  "monte-escalier": ["receiverType", "extraFlatShower", "walkInShower", "plumbing", "waterproofing"],
  "douche-senior": ["stairLocation", "stairShape", "turns", "landings", "railType"]
});

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isArray = Array.isArray;

function collectStringValues(value, values = []) {
  if (typeof value === "string") values.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStringValues(item, values));
  else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStringValues(item, values));
  }
  return values;
}

export function containsPublicPlaceholder(value) {
  return collectStringValues(value).some((text) => PLACEHOLDER_PATTERN.test(text));
}

export function localPageRoute(page) {
  const base = `/${page.service}/${page.departmentSlug}/`;
  return page.pageLevel === "city" ? `${base}${page.citySlug}/` : base;
}

export function localTemplateName(page) {
  return `${page.service}-${page.pageLevel}`;
}

export function validateLocalPage(page) {
  const errors = [];

  for (const field of LOCAL_PAGE_FIELDS) {
    if (!(field in page)) errors.push(`champ manquant: ${field}`);
  }
  if (!SERVICES.includes(page.service)) errors.push(`service invalide: ${page.service}`);
  if (!PAGE_LEVELS.includes(page.pageLevel)) errors.push(`niveau invalide: ${page.pageLevel}`);
  if (!COVERAGE_STATUSES.includes(page.professionalCoverageStatus)) {
    errors.push(`couverture invalide: ${page.professionalCoverageStatus}`);
  }
  if (!CONTENT_STATUSES.includes(page.status)) errors.push(`statut invalide: ${page.status}`);
  if (!INDEX_STATUSES.includes(page.indexStatus)) errors.push(`indexStatus invalide: ${page.indexStatus}`);
  if (!SITEMAP_STATUSES.includes(page.sitemapStatus)) {
    errors.push(`sitemapStatus invalide: ${page.sitemapStatus}`);
  }

  for (const field of [
    "postalCodes",
    "nationalPriceReference",
    "localCostFactors",
    "demographicData",
    "housingData",
    "projectOptions",
    "localAssistancePrograms",
    "usefulLocalContacts",
    "coveredPostalCodes",
    "nearbyLocations",
    "faq",
    "officialSources"
  ]) {
    if (!isArray(page[field])) errors.push(`${field} doit être une liste`);
  }
  for (const [field, values] of [
    ["postalCodes", page.postalCodes || []],
    ["coveredPostalCodes", page.coveredPostalCodes || []]
  ]) {
    if (values.some((code) => !/^\d{5}$/.test(String(code)))) {
      errors.push(`${field} contient un code postal invalide`);
    }
  }
  const declaredPostalCodes = new Set((page.postalCodes || []).map(String));
  const coveredPostalCodes = new Set((page.coveredPostalCodes || []).map(String));
  if (
    declaredPostalCodes.size
    && [...coveredPostalCodes].some((code) => !declaredPostalCodes.has(code))
  ) {
    errors.push("coveredPostalCodes contient un code hors du périmètre déclaré");
  }
  if (
    page.professionalCoverageStatus === "coverage_unavailable"
    && coveredPostalCodes.size
  ) {
    errors.push("couverture indisponible incompatible avec des codes postaux actifs");
  }
  if (
    ["coverage_available", "coverage_partial"].includes(page.professionalCoverageStatus)
    && !coveredPostalCodes.size
  ) {
    errors.push("une couverture disponible ou partielle exige des codes postaux actifs");
  }
  if (
    page.pageLevel === "city"
    && page.professionalCoverageStatus === "coverage_available"
    && [...declaredPostalCodes].some((code) => !coveredPostalCodes.has(code))
  ) {
    errors.push("couverture ville disponible exige tous les codes postaux déclarés");
  }
  if (
    page.pageLevel === "city"
    && page.professionalCoverageStatus === "coverage_partial"
    && declaredPostalCodes.size
    && [...declaredPostalCodes].every((code) => coveredPostalCodes.has(code))
  ) {
    errors.push("couverture ville partielle incohérente: tous les codes sont actifs");
  }

  for (const field of ["id", "departmentName", "departmentSlug", "seoTitle", "metaDescription", "h1"]) {
    if (!isNonEmptyString(page[field])) errors.push(`${field} est obligatoire`);
  }
  if (page.pageLevel === "city") {
    if (!isNonEmptyString(page.cityName)) errors.push("cityName est obligatoire pour une ville");
    if (!isNonEmptyString(page.citySlug)) errors.push("citySlug est obligatoire pour une ville");
    if (!isNonEmptyString(page.inseeCode)) errors.push("inseeCode est obligatoire pour une ville");
  }

  if (!page.serviceDetails || typeof page.serviceDetails !== "object") {
    errors.push("serviceDetails est obligatoire");
  } else if (SERVICE_FIELDS[page.service]) {
    for (const field of SERVICE_FIELDS[page.service]) {
      if (!(field in page.serviceDetails)) errors.push(`serviceDetails.${field} est obligatoire`);
    }
    for (const forbidden of CROSS_SERVICE_FIELDS[page.service]) {
      if (forbidden in page.serviceDetails) {
        errors.push(`serviceDetails.${forbidden} appartient à l’autre service`);
      }
    }
  }

  if (page.canonical !== localPageRoute(page)) {
    errors.push(`canonical attendu: ${localPageRoute(page)}`);
  }
  return errors;
}

function isStructuredInseeDatum(datum) {
  return datum
    && isNonEmptyString(datum.indicator)
    && datum.value !== null
    && datum.value !== undefined
    && isNonEmptyString(datum.unit)
    && isNonEmptyString(datum.vintage)
    && isNonEmptyString(datum.geography)
    && isNonEmptyString(datum.inseeCode)
    && isNonEmptyString(datum.source)
    && isNonEmptyString(datum.retrievedAt);
}

function isStructuredSource(source) {
  return source
    && isNonEmptyString(source.organization)
    && isNonEmptyString(source.title)
    && isNonEmptyString(source.supports)
    && isNonEmptyString(source.dataDate)
    && isNonEmptyString(source.checkedAt)
    && /^https:\/\/[^ ]+$/i.test(source.url || "");
}

export function publicationReadiness(page) {
  const reasons = validateLocalPage(page);
  const requiredText = [
    ["introduction", page.introduction],
    ["geographicScope", page.geographicScope],
    ["localHousingCommentary", page.localHousingCommentary],
    ["conclusion", page.conclusion],
    ["sourceCheckedAt", page.sourceCheckedAt]
  ];
  for (const [name, value] of requiredText) {
    if (!isNonEmptyString(value)) reasons.push(`${name} incomplet`);
  }

  const inseeData = [...(page.demographicData || []), ...(page.housingData || [])];
  if (!page.demographicData?.length) reasons.push("données démographiques INSEE manquantes");
  if (!page.housingData?.length) reasons.push("données logement INSEE manquantes");
  if (inseeData.some((datum) => !isStructuredInseeDatum(datum))) {
    reasons.push("donnée INSEE incomplètement structurée");
  }

  if (!page.officialSources?.length) reasons.push("sources officielles manquantes");
  if (page.officialSources?.some((source) => !isStructuredSource(source))) {
    reasons.push("source officielle incomplètement structurée");
  }
  if (!page.officialSources?.some((source) => source.scope === "local")) {
    reasons.push("source locale obligatoire manquante");
  }
  if (!page.localAssistancePrograms?.length && !page.usefulLocalContacts?.length) {
    reasons.push("aides ou ressources locales vérifiées manquantes");
  }

  const faqCount = page.faq?.length || 0;
  if (faqCount < 6 || faqCount > 10) reasons.push("FAQ requise: 6 à 10 questions");
  if (page.pageLevel === "city" && (page.faq || []).filter((item) => item.local === true).length < 3) {
    reasons.push("FAQ ville requise: au moins 3 questions locales");
  }
  if (!page.cta || !isNonEmptyString(page.cta.title) || !isNonEmptyString(page.cta.project)) {
    reasons.push("CTA fonctionnel manquant");
  }
  if (containsPublicPlaceholder(page)) reasons.push("placeholder public détecté");

  return {
    ready: reasons.length === 0,
    reasons: [...new Set(reasons)]
  };
}

export function effectivePublication(page) {
  const readiness = publicationReadiness(page);
  const requestedPublished = page.status === "published";
  const publishable = requestedPublished && readiness.ready;
  return {
    ...readiness,
    publishable,
    status: publishable ? "published" : "draft",
    indexStatus: publishable && page.indexStatus === "index" ? "index" : "noindex",
    sitemapStatus: publishable && page.sitemapStatus === "included" ? "included" : "excluded"
  };
}

export function isPublicLocalPage(page) {
  const publication = effectivePublication(page);
  return publication.status === "published"
    && publication.indexStatus === "index"
    && publication.sitemapStatus === "included";
}

export function localSitemapUrls(pages, origin, service, pageLevel) {
  return pages
    .filter((page) => page.service === service && page.pageLevel === pageLevel)
    .filter(isPublicLocalPage)
    .map((page) => new URL(localPageRoute(page), origin).href);
}

export function publicNearbyLocations(page, allPages) {
  const allowed = new Map(
    allPages
      .filter(isPublicLocalPage)
      .map((candidate) => [candidate.id, candidate])
  );
  return (page.nearbyLocations || [])
    .map((item) => allowed.get(typeof item === "string" ? item : item.id))
    .filter(Boolean);
}

function normalizeEditorialText(page) {
  const segments = [
    page.introduction,
    page.geographicScope,
    ...(page.localCostFactors || []),
    page.localHousingCommentary,
    ...(page.localAssistancePrograms || []).flatMap((item) => [item.title, item.description]),
    ...(page.usefulLocalContacts || []).flatMap((item) => [item.title, item.description]),
    ...(page.faq || []).flatMap((item) => [item.question, item.answer]),
    page.conclusion
  ].filter(isNonEmptyString);
  return segments.join(" ")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 4);
}

export function editorialSimilarity(left, right) {
  const leftTokens = new Set(normalizeEditorialText(left));
  const rightTokens = new Set(normalizeEditorialText(right));
  if (leftTokens.size < 20 || rightTokens.size < 20) return 0;
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return union ? intersection / union : 0;
}

export function similarityReport(pages, threshold = 0.72) {
  const issues = [];
  for (let i = 0; i < pages.length; i += 1) {
    for (let j = i + 1; j < pages.length; j += 1) {
      const similarity = editorialSimilarity(pages[i], pages[j]);
      if (similarity >= threshold) {
        issues.push({
          left: pages[i].id,
          right: pages[j].id,
          similarity
        });
      }
    }
  }
  return issues;
}

export function sitemapXml(urls) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
    "</urlset>",
    ""
  ].join("\n");
}
