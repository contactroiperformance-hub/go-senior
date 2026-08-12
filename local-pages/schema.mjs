export const LOCAL_PAGE_FIELDS = Object.freeze([
  "id",
  "service",
  "pageLevel",
  "regionName",
  "regionSlug",
  "departmentName",
  "departmentSlug",
  "departmentCode",
  "locationPhrase",
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
  "coverageStatus",
  "routingStatus",
  "leadDistributionMode",
  "coveredPostalCodes",
  "nearbyLocations",
  "localPlaces",
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
export const SERVICE_COVERAGE = Object.freeze({
  monteEscalier: "nationwide",
  doucheSenior: "configurable",
  futureServices: "configurable"
});
export const COVERAGE_STATUSES = Object.freeze(["nationwide", "configurable"]);
export const ROUTING_STATUSES = Object.freeze([
  "active",
  "capped",
  "paused",
  "technical_error"
]);
export const LEAD_DISTRIBUTION_MODES = Object.freeze(["exclusive", "shared", "configurable"]);
export const CONTENT_STATUSES = Object.freeze(["draft", "published"]);
export const INDEX_STATUSES = Object.freeze(["noindex", "index"]);
export const SITEMAP_STATUSES = Object.freeze(["excluded", "included"]);

const PLACEHOLDER_PATTERN =
  /\[(?:x(?:\s|%|hab|\.)|année|url|date|introduction|question|réponse|conclusion|source|dispositif|adresse|configuration|commune|facteur)[^\]]*\]|\{\{[^}]+\}\}|lorem ipsum|liste vide|en production|jamais générée|contenu rédigé|champ insee|parcours opérationnel/i;

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

export function isValidFrenchPostalCode(value) {
  return /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/.test(String(value || ""));
}

export function projectAvailability(service, postalCode, routingStatus = "active") {
  const validPostalCode = isValidFrenchPostalCode(postalCode);
  const coverageStatus = service === "monte-escalier"
    ? SERVICE_COVERAGE.monteEscalier
    : SERVICE_COVERAGE.futureServices;
  return {
    validPostalCode,
    coverageStatus,
    covered: validPostalCode && coverageStatus === "nationwide",
    routingStatus: ROUTING_STATUSES.includes(routingStatus) ? routingStatus : "technical_error"
  };
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
  if (!COVERAGE_STATUSES.includes(page.coverageStatus)) {
    errors.push(`couverture invalide: ${page.coverageStatus}`);
  }
  if (!ROUTING_STATUSES.includes(page.routingStatus)) {
    errors.push(`routing invalide: ${page.routingStatus}`);
  }
  if (!LEAD_DISTRIBUTION_MODES.includes(page.leadDistributionMode)) {
    errors.push(`distribution invalide: ${page.leadDistributionMode}`);
  }
  const expectedCoverage = page.service === "monte-escalier"
    ? SERVICE_COVERAGE.monteEscalier
    : SERVICE_COVERAGE.futureServices;
  if (page.coverageStatus !== expectedCoverage) {
    errors.push(`couverture ${page.service} attendue: ${expectedCoverage}`);
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
    "localPlaces",
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
  if (page.coverageStatus === "nationwide" && page.service !== "monte-escalier") {
    errors.push("couverture nationale réservée au monte-escalier sans configuration explicite");
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
    && isNonEmptyString(source.exactTitle)
    && Array.isArray(source.supportedClaims)
    && source.supportedClaims.length > 0
    && source.dataYear !== null
    && source.dataYear !== undefined
    && Object.hasOwn(source, "publishedAt")
    && isNonEmptyString(source.checkedAt)
    && /^https:\/\/[^ ]+$/i.test(source.officialUrl || "");
}

function isStructuredPrice(price) {
  return price
    && isNonEmptyString(price.productType)
    && Number.isFinite(price.amountMin)
    && Number.isFinite(price.amountMax)
    && price.amountMin <= price.amountMax
    && isNonEmptyString(price.currency)
    && Array.isArray(price.includedItems)
    && Array.isArray(price.excludedItems)
    && Number.isInteger(price.dataYear)
    && isNonEmptyString(price.sourceTitle)
    && /^https:\/\/[^ ]+$/i.test(price.sourceUrl || "")
    && /^\d{4}-\d{2}-\d{2}$/.test(price.sourceCheckedAt || "");
}

function isStructuredResource(resource) {
  return resource
    && isNonEmptyString(resource.programName)
    && isNonEmptyString(resource.programType)
    && isNonEmptyString(resource.description)
    && isNonEmptyString(resource.eligibilitySummary)
    && isNonEmptyString(resource.officialOrganization)
    && isNonEmptyString(resource.officialTitle)
    && /^https:\/\/[^ ]+$/i.test(resource.officialUrl || "")
    && /^\d{4}-\d{2}-\d{2}$/.test(resource.sourceCheckedAt || "")
    && isNonEmptyString(resource.status);
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
  const resources = [...(page.localAssistancePrograms || []), ...(page.usefulLocalContacts || [])];
  if (resources.some((resource) => !isStructuredResource(resource))) {
    reasons.push("aide ou ressource incomplètement structurée");
  }
  if (page.service === "monte-escalier") {
    if (page.nationalPriceReference?.length !== 4) {
      reasons.push("quatre fourchettes nationales monte-escalier requises");
    } else if (page.nationalPriceReference.some((price) => !isStructuredPrice(price))) {
      reasons.push("fourchette nationale sans source ou date de vérification");
    }
  }

  const faqCount = page.faq?.length || 0;
  if (faqCount < 6 || faqCount > 10) reasons.push("FAQ requise: 6 à 10 questions");
  if (page.pageLevel === "department" && (page.faq || []).filter((item) => item.local === true).length < 5) {
    reasons.push("FAQ département requise: au moins 5 questions locales");
  }
  if (page.pageLevel === "department" && (page.localPlaces || []).length < 3) {
    reasons.push("au moins 3 lieux locaux nommés sont requis");
  }
  const editorialWordCount = normalizeEditorialText(page).length;
  if (page.pageLevel === "department" && editorialWordCount < 350) {
    reasons.push(`profondeur éditoriale insuffisante: ${editorialWordCount}/350 mots`);
  }
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
  const phraseSize = 6;
  const shingles = (page) => {
    const words = normalizeEditorialText(page);
    return new Set(words
      .slice(0, Math.max(0, words.length - phraseSize + 1))
      .map((_, index) => words.slice(index, index + phraseSize).join(" ")));
  };
  const leftTokens = shingles(left);
  const rightTokens = shingles(right);
  if (leftTokens.size < 20 || rightTokens.size < 20) return 0;
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return union ? intersection / union : 0;
}

export function similarityReport(pages, threshold = 0.65) {
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
