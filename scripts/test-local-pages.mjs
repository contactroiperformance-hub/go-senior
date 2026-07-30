import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { localPages } from "../local-pages/data.mjs";
import {
  COVERAGE_STATUSES,
  LOCAL_PAGE_FIELDS,
  containsPublicPlaceholder,
  effectivePublication,
  editorialSimilarity,
  localPageRoute,
  localSitemapUrls,
  publicNearbyLocations,
  publicationReadiness,
  similarityReport,
  validateLocalPage
} from "../local-pages/schema.mjs";
import { renderLocalPage } from "../local-pages/render.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const origin = "https://go-senior.fr";

assert.equal(localPages.length, 4, "exactement quatre pages locales de validation");
assert.deepEqual(
  new Set(localPages.map((page) => `${page.service}-${page.pageLevel}`)),
  new Set([
    "monte-escalier-department",
    "monte-escalier-city",
    "douche-senior-department",
    "douche-senior-city"
  ])
);

for (const page of localPages) {
  assert.deepEqual(validateLocalPage(page), [], `${page.id}: schéma valide`);
  for (const field of LOCAL_PAGE_FIELDS) {
    assert.ok(field in page, `${page.id}: ${field} présent`);
  }
  const publication = effectivePublication(page);
  if (page.id === "monte-escalier-nord") {
    assert.equal(publication.status, "published");
    assert.equal(publication.indexStatus, "index");
    assert.equal(publication.sitemapStatus, "included");
    assert.deepEqual(publication.reasons, []);
  } else {
    assert.equal(publication.status, "draft");
    assert.equal(publication.indexStatus, "noindex");
    assert.equal(publication.sitemapStatus, "excluded");
    assert.ok(publication.reasons.length > 0, `${page.id}: données manquantes documentées`);
  }
}

const nord = localPages.find((page) => page.id === "monte-escalier-nord");
const lille = localPages.find((page) => page.id === "monte-escalier-nord-lille");
const bordeaux = localPages.find((page) => page.id === "douche-senior-gironde-bordeaux");
assert.ok(nord && lille && bordeaux);

const completePage = structuredClone(lille);
Object.assign(completePage, {
  id: "monte-escalier-haute-garonne-toulouse-test",
  regionName: "Occitanie",
  regionSlug: "occitanie",
  departmentName: "Haute-Garonne",
  departmentSlug: "haute-garonne",
  departmentCode: "31",
  cityName: "Toulouse",
  citySlug: "toulouse",
  inseeCode: "31555",
  postalCodes: ["31000"],
  intercommunalityName: "Toulouse Métropole",
  seoTitle: "Page de test complète",
  metaDescription: "Jeu de données complet utilisé uniquement par les tests du moteur local.",
  h1: "Monte-escalier à Toulouse : page de test",
  introduction: "Cette introduction de test décrit un contexte éditorial local suffisamment développé pour vérifier la règle de publication sans être envoyée en production.",
  geographicScope: "Ce périmètre de test distingue la commune, son intercommunalité et la vérification séparée de la couverture professionnelle.",
  localCostFactors: [
    "La configuration de l’escalier et les accès au logement sont analysés avant tout devis.",
    "Les contraintes techniques sont décrites séparément des repères de prix nationaux."
  ],
  demographicData: [
    {
      indicator: "Population municipale",
      value: 1,
      unit: "habitant de test",
      vintage: "2021",
      geography: "Commune de test",
      inseeCode: "31555",
      source: "INSEE",
      retrievedAt: "2026-07-29"
    }
  ],
  housingData: [
    {
      indicator: "Logements du jeu de test",
      value: 1,
      unit: "logement de test",
      vintage: "2021",
      geography: "Commune de test",
      inseeCode: "31555",
      source: "INSEE",
      retrievedAt: "2026-07-29"
    }
  ],
  localHousingCommentary: "Le commentaire de test relie explicitement les données structurées aux vérifications techniques nécessaires pour le projet, sans produire d’affirmation publique.",
  localAssistancePrograms: [
    {
      title: "Ressource locale de test",
      description: "Ressource factice confinée au test automatisé.",
      organization: "Organisme de test",
      checkedAt: "2026-07-29",
      url: "https://example.test/ressource"
    }
  ],
  faq: Array.from({ length: 6 }, (_, index) => ({
    question: `Question éditoriale locale de test numéro ${index + 1} ?`,
    answer: `Réponse distincte du jeu de test numéro ${index + 1}, suffisamment explicite pour valider le rendu dynamique de la FAQ.`,
    local: index < 4
  })),
  officialSources: [
    {
      organization: "INSEE",
      title: "Dossier complet du jeu de test",
      supports: "Données démographiques et logement du test",
      dataDate: "2021",
      checkedAt: "2026-07-29",
      url: "https://www.insee.fr/fr/statistiques/",
      scope: "local"
    }
  ],
  conclusion: "Cette conclusion de test confirme que les données locales, les sources et les contrôles doivent être validés avant toute publication.",
  cta: {
    title: "Vérifiez les solutions à Toulouse",
    description: null,
    project: "monte-escalier",
    postalCodeExample: "31000"
  },
  sourceCheckedAt: "2026-07-29",
  status: "published",
  indexStatus: "index",
  sitemapStatus: "included",
  canonical: "/monte-escalier/haute-garonne/toulouse/",
  publishedAt: "2026-07-29"
});

assert.deepEqual(validateLocalPage(completePage), []);
assert.equal(publicationReadiness(completePage).ready, true);
assert.equal(effectivePublication(completePage).status, "published");
assert.deepEqual(
  localSitemapUrls([completePage], origin, "monte-escalier", "city"),
  [`${origin}/monte-escalier/haute-garonne/toulouse/`]
);

const noSources = structuredClone(completePage);
noSources.officialSources = [];
assert.equal(publicationReadiness(noSources).ready, false);
assert.ok(publicationReadiness(noSources).reasons.includes("sources officielles manquantes"));

const nearbyFixture = structuredClone(bordeaux);
nearbyFixture.nearbyLocations = [completePage.id, lille.id];
assert.deepEqual(
  publicNearbyLocations(nearbyFixture, [completePage, lille, nearbyFixture]).map((page) => page.id),
  [completePage.id],
  "seules les destinations publiées, indexables et en sitemap sont liées"
);

const identicalEditorial = structuredClone(completePage);
identicalEditorial.id = "duplicate-editorial-test";
identicalEditorial.cityName = "Ville test bis";
identicalEditorial.citySlug = "ville-test-bis";
identicalEditorial.inseeCode = "99999";
identicalEditorial.canonical = "/monte-escalier/haute-garonne/ville-test-bis/";
assert.ok(editorialSimilarity(completePage, identicalEditorial) >= 0.72);
assert.equal(similarityReport([completePage, identicalEditorial]).length, 1);

for (const status of COVERAGE_STATUSES) {
  const coveragePage = {
    ...lille,
    postalCodes: status === "coverage_partial" ? ["59000", "59160"] : ["59000"],
    coveredPostalCodes: status === "coverage_unavailable" ? [] : ["59000"],
    professionalCoverageStatus: status
  };
  assert.deepEqual(validateLocalPage(coveragePage), []);
  const rendered = renderLocalPage(coveragePage, localPages);
  assert.ok(rendered.includes(`data-coverage="${status}"`));
  if (status === "coverage_available") {
    assert.ok(rendered.includes("Des professionnels prenant en charge ce type de projet interviennent"));
  } else if (status === "coverage_partial") {
    assert.ok(rendered.includes("La disponibilité varie selon le code postal"));
  } else {
    assert.ok(rendered.includes("couverture confirmée pour ce code postal"));
  }
}

const completeRendered = renderLocalPage(completePage, [completePage]);
assert.equal((completeRendered.match(/data-local-faq/g) || []).length, 6);
assert.ok(completeRendered.includes("Périmètre de ce guide"));
assert.ok(completeRendered.includes('cp-exemple="31000"'));
assert.equal(containsPublicPlaceholder(completeRendered), false);

const stairSpecific = structuredClone(lille);
stairSpecific.serviceDetails.railType = "Rail standard ou sur mesure selon la configuration";
const stairSpecificRendered = renderLocalPage(stairSpecific, [stairSpecific]);
assert.ok(stairSpecificRendered.includes('data-local-service-details="monte-escalier"'));
assert.ok(stairSpecificRendered.includes("Type de rail"));
assert.equal(stairSpecificRendered.includes("Type de receveur"), false);

const showerSpecific = structuredClone(bordeaux);
showerSpecific.serviceDetails.plumbing = "Réseaux à vérifier avant définition du projet";
const showerSpecificRendered = renderLocalPage(showerSpecific, [showerSpecific]);
assert.ok(showerSpecificRendered.includes('data-local-service-details="douche-senior"'));
assert.ok(showerSpecificRendered.includes("Plomberie"));
assert.equal(showerSpecificRendered.includes("Type de rail"), false);

for (const page of localPages.filter((item) => item.id !== nord.id)) {
  const route = localPageRoute(page);
  const file = path.join(dist, route.replace(/^\/|\/$/g, ""), "index.html");
  const source = await readFile(file, "utf8");
  assert.ok(source.includes('<meta name="robots" content="noindex,follow">'));
  assert.ok(source.includes(`<link rel="canonical" href="${origin}${route}">`));
  assert.equal((source.match(/<h1\b/g) || []).length, 1);
  assert.ok(source.includes('aria-label="Fil d’Ariane"'));
  assert.ok(source.includes('data-local-draft-banner'));
  assert.ok(source.includes('data-local-price-block'));
  assert.ok(source.includes('data-local-project-options'));
  assert.ok(source.includes('grid-template-columns:repeat(auto-fit'));
  assert.ok(source.includes('overflow-x:hidden'));
  assert.equal(source.includes('data-local-insee-card'), false);
  assert.equal(source.includes('data-local-faq'), false);
  assert.equal(source.includes('data-local-nearby'), false);
  assert.equal(source.includes('data-local-sources'), false);
  assert.equal(containsPublicPlaceholder(source), false);
  assert.equal(/"@(type|id)"\s*:\s*"(?:LocalBusiness|Contractor|Review|AggregateRating)"/.test(source), false);
}

const nordBuilt = await readFile(path.join(dist, "monte-escalier/nord/index.html"), "utf8");
assert.ok(nordBuilt.includes('<meta name="robots" content="index,follow,max-image-preview:large'));
assert.equal(nordBuilt.includes("data-local-draft-banner"), false);
assert.equal((nordBuilt.match(/data-local-insee-card/g) || []).length, 6);
assert.equal((nordBuilt.match(/data-local-faq/g) || []).length, 8);
assert.equal((nordBuilt.match(/data-local-sources/g) || []).length, 1);
assert.equal((nordBuilt.match(/href="\/projet\/\?projet=monte-escalier&amp;type=/g) || []).length, 4);
assert.ok(nordBuilt.includes("Monte-escalier debout"));
assert.ok(nordBuilt.includes("2 500 – 5 500 €"));
assert.ok(nordBuilt.includes("J’Amén’âge 59"));
assert.ok(nordBuilt.includes("03 59 73 73 73"));
assert.ok(nordBuilt.includes("Comment fonctionne la mise en relation ?"));
assert.equal(nordBuilt.includes("data-local-nearby"), false, "Lille reste masquée tant que sa page est en brouillon");
assert.equal(containsPublicPlaceholder(nordBuilt), false);

const lilleBuilt = await readFile(path.join(dist, "monte-escalier/nord/lille/index.html"), "utf8");
const bordeauxBuilt = await readFile(path.join(dist, "douche-senior/gironde/bordeaux/index.html"), "utf8");
assert.ok(lilleBuilt.includes('cp-exemple="59000"'));
assert.equal(lilleBuilt.includes('cp-exemple="33000"'), false);
assert.ok(bordeauxBuilt.includes('cp-exemple="33000"'));
assert.equal(bordeauxBuilt.includes('cp-exemple="59000"'), false);

const rootSitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
for (const page of localPages) {
  assert.equal(
    rootSitemap.includes(`${origin}${localPageRoute(page)}`),
    page.id === nord.id,
    `${page.id}: inclusion sitemap conforme au statut`
  );
}
for (const sitemap of [
  "monte-escalier-departements.xml",
  "monte-escalier-villes.xml",
  "douche-senior-departements.xml",
  "douche-senior-villes.xml"
]) {
  const source = await readFile(path.join(dist, "sitemaps", sitemap), "utf8");
  if (sitemap === "monte-escalier-departements.xml") {
    assert.ok(source.includes(`<loc>${origin}/monte-escalier/nord/</loc>`));
    assert.equal((source.match(/<loc>/g) || []).length, 1);
  } else {
    assert.equal(source.includes("<loc>"), false, `${sitemap}: aucun draft`);
  }
}

for (const file of [
  "Modele-departement.dc.html",
  "Modele-ville.dc.html",
  "Modele-departement-douche.dc.html",
  "Modele-ville-douche.dc.html"
]) {
  await assert.rejects(access(path.join(dist, file)), `${file}: maquette à placeholders non publique`);
}

console.log(
  "Validated the published Nord department page, remaining drafts, local schema, reusable templates, publication gates, coverage states, dynamic modules, sitemaps, similarity, and SEO hierarchy."
);
