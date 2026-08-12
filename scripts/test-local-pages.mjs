import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { localPages } from "../local-pages/data.mjs";
import {
  LOCAL_PAGE_FIELDS,
  ROUTING_STATUSES,
  containsPublicPlaceholder,
  effectivePublication,
  editorialSimilarity,
  isValidFrenchPostalCode,
  localPageRoute,
  localSitemapUrls,
  projectAvailability,
  publicNearbyLocations,
  publicationReadiness,
  similarityReport,
  validateLocalPage
} from "../local-pages/schema.mjs";
import { renderLocalPage } from "../local-pages/render.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const origin = "https://go-senior.fr";

assert.equal(localPages.length, 104, "101 départements publiés et trois pages de validation en brouillon");
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
  if (page.service === "monte-escalier" && page.pageLevel === "department") {
    assert.equal(publication.ready, true);
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
const oise = localPages.find((page) => page.id === "monte-escalier-oise");
const somme = localPages.find((page) => page.id === "monte-escalier-somme");
const lille = localPages.find((page) => page.id === "monte-escalier-nord-lille");
const bordeaux = localPages.find((page) => page.id === "douche-senior-gironde-bordeaux");
const mayotte = localPages.find((page) => page.id === "monte-escalier-mayotte");
assert.ok(nord && oise && somme && lille && bordeaux);
assert.ok(mayotte);

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
  introduction: "Cette introduction de test décrit un contexte éditorial local suffisamment développé pour vérifier la règle de publication sans être diffusée au public.",
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
      programName: "Ressource locale de test",
      programType: "dispositif_departemental",
      description: "Ressource factice confinée au test automatisé.",
      eligibilitySummary: "Conditions factices confinées au test automatisé.",
      officialOrganization: "Organisme de test",
      officialTitle: "Ressource officielle de test",
      officialUrl: "https://example.test/ressource",
      sourceCheckedAt: "2026-08-12",
      status: "verified"
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
      exactTitle: "Dossier complet du jeu de test",
      supportedClaims: ["Données démographiques", "Logement du test"],
      dataYear: "2021",
      publishedAt: null,
      checkedAt: "2026-08-12",
      officialUrl: "https://www.insee.fr/fr/statistiques/",
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

const placeholderPage = structuredClone(completePage);
placeholderPage.conclusion = "Contenu rédigé";
assert.equal(publicationReadiness(placeholderPage).ready, false);
assert.ok(publicationReadiness(placeholderPage).reasons.includes("placeholder public détecté"));

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
assert.ok(editorialSimilarity(completePage, identicalEditorial) >= 0.65);
assert.equal(similarityReport([completePage, identicalEditorial]).length, 1);

for (const status of ROUTING_STATUSES) {
  const coveragePage = { ...lille, routingStatus: status };
  assert.deepEqual(validateLocalPage(coveragePage), []);
  const rendered = renderLocalPage(coveragePage, localPages);
  assert.ok(rendered.includes('data-coverage="nationwide"'));
  assert.ok(rendered.includes(`data-routing="${status}"`));
  assert.ok(rendered.includes("couvre l’ensemble des codes postaux"));
  assert.equal(/zone non couverte|couverture non confirmée|aucun professionnel disponible/i.test(rendered), false);
}

for (const postalCode of ["59000", "75015", "97100", "98000"]) {
  const availability = projectAvailability("monte-escalier", postalCode, "active");
  assert.equal(availability.validPostalCode, true);
  assert.equal(availability.coverageStatus, "nationwide");
  assert.equal(availability.covered, true);
}
for (const postalCode of ["", "5900", "00000", "99000", "ABCDE"]) {
  assert.equal(isValidFrenchPostalCode(postalCode), false);
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

for (const page of localPages.filter((item) => effectivePublication(item).status === "draft")) {
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
assert.ok(nordBuilt.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
assert.equal(nordBuilt.includes("data-local-draft-banner"), false);
assert.equal((nordBuilt.match(/data-local-insee-card/g) || []).length, 6);
assert.equal((nordBuilt.match(/data-local-faq/g) || []).length, 10);
assert.equal((nordBuilt.match(/data-local-sources/g) || []).length, 1);
assert.equal((nordBuilt.match(/href="\/projet\/\?projet=monte-escalier&amp;type=/g) || []).length, 4);
assert.ok(nordBuilt.includes("Monte-escalier assis-debout"));
assert.equal(nordBuilt.includes("plateforme d’appui"), false);
assert.ok(nordBuilt.includes("2 500 – 5 500 €"));
assert.ok(nordBuilt.includes("J’Amén’Âge 59"));
assert.ok(nordBuilt.includes("03 59 73 73 73"));
assert.ok(nordBuilt.includes("Un accompagnement simple, du premier échange au devis"));
assert.equal((nordBuilt.match(/data-local-essentials/g) || []).length, 1);
assert.equal((nordBuilt.match(/data-local-daily-life/g) || []).length, 1);
assert.equal((nordBuilt.match(/data-local-editorial/g) || []).length, 1);
assert.equal((nordBuilt.match(/data-local-process/g) || []).length, 1);
assert.ok(nordBuilt.includes("/uploads/monte-escalier-en-situation.webp"));
assert.ok(nordBuilt.includes("/uploads/visite-conseil-domicile-autonomie.webp"));
assert.equal((nordBuilt.match(/Périmètre de ce guide/g) || []).length, 1);
assert.ok(nordBuilt.includes("2 615 635 habitants"));
assert.ok(nordBuilt.includes("18,2 %"));
assert.ok(nordBuilt.includes("49,8 %"));
assert.ok(nordBuilt.includes("13,4 % de 65 à 79 ans plus 4,8 %"));
assert.ok(nordBuilt.includes("576 460 ÷ 1 157 844"));
assert.ok(nordBuilt.includes("consulté le 12 août 2026"));
assert.ok(nordBuilt.includes("Démarrer mon projet"));
assert.ok(nordBuilt.includes("Tous les codes postaux du Nord sont couverts"));
assert.equal((nordBuilt.match(/<h1\b/g) || []).length, 1);
assert.ok(nordBuilt.includes("<title>Monte-escalier dans le Nord (59) : prix et aides | Go Senior</title>"));
assert.ok(nordBuilt.includes('content="Découvrez les prix d’un monte-escalier dans le Nord, les modèles droits ou tournants, les aides disponibles et les professionnels intervenant dans votre secteur."'));
assert.ok(nordBuilt.includes('<link rel="canonical" href="https://go-senior.fr/monte-escalier/nord/">'));
assert.ok(nordBuilt.includes('href="/monte-escalier/nord/" aria-current="page"'));
assert.ok(nordBuilt.includes('@media(max-width:1060px)'));
assert.ok(nordBuilt.includes(':focus-visible{outline:3px solid #C05A2E'));
assert.equal((nordBuilt.match(/<details data-local-faq/g) || []).length, 10, "FAQ accessible au clavier avec details natifs");
for (const officialUrl of [
  "https://www.insee.fr/fr/statistiques/2011101?geo=DEP-59",
  "https://info.lenord.fr/adaptez-votre-logement-avec-j-amen-age-59",
  "https://lenord.fr/nos-politiques/autonomie-des-seniors",
  "https://mdph.lenord.fr/pch",
  "https://mdph.lenord.fr/nous-trouver",
  "https://france-renov.gouv.fr/aides/maprimeadapt"
]) {
  assert.ok(nordBuilt.includes(officialUrl), `lien officiel rendu: ${officialUrl}`);
}
assert.ok(nordBuilt.includes("data-local-nearby"), "les départements publiés sont maillés entre eux");
assert.equal(nordBuilt.includes("/monte-escalier/nord/lille/"), false, "Lille reste masquée tant que sa page est en brouillon");
assert.equal(containsPublicPlaceholder(nordBuilt), false);

const oiseBuilt = await readFile(path.join(dist, "monte-escalier/oise/index.html"), "utf8");
assert.ok(oiseBuilt.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
assert.ok(oiseBuilt.includes("829 899 habitants"));
assert.ok(oiseBuilt.includes("18,3 %"));
assert.ok(oiseBuilt.includes("42,2 %"));
assert.ok(oiseBuilt.includes("Maison Départementale de l’Autonomie"));
assert.equal(oiseBuilt.includes("data-local-draft-banner"), false);

const sommeBuilt = await readFile(path.join(dist, "monte-escalier/somme/index.html"), "utf8");
assert.ok(sommeBuilt.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
assert.ok(sommeBuilt.includes("565 413 habitants"));
assert.ok(sommeBuilt.includes("21,5 %"));
assert.ok(sommeBuilt.includes("49,0 %"));
assert.ok(sommeBuilt.includes("Aide départementale à l’adaptation du logement"));
assert.equal(sommeBuilt.includes("data-local-draft-banner"), false);

const lilleBuilt = await readFile(path.join(dist, "monte-escalier/nord/lille/index.html"), "utf8");
const bordeauxBuilt = await readFile(path.join(dist, "douche-senior/gironde/bordeaux/index.html"), "utf8");
assert.ok(lilleBuilt.includes('cp-exemple="59000"'));
assert.equal(lilleBuilt.includes('cp-exemple="33000"'), false);
assert.ok(bordeauxBuilt.includes('cp-exemple="33000"'));
assert.equal(bordeauxBuilt.includes('cp-exemple="59000"'), false);

const rootSitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
for (const page of localPages) {
  const expected = effectivePublication(page).status === "published";
  assert.equal(rootSitemap.includes(`${origin}${localPageRoute(page)}`), expected, `${page.id}: présence sitemap cohérente`);
}
assert.ok(rootSitemap.includes(`${origin}/monte-escalier/departements/`));
const departmentSitemap = await readFile(path.join(dist, "sitemaps/monte-escalier-departements.xml"), "utf8");
for (const page of [nord, oise, somme]) {
  assert.ok(departmentSitemap.includes(`${origin}${localPageRoute(page)}`));
}
assert.equal(
  (departmentSitemap.match(/<loc>/g) || []).length,
  101,
  "les 101 départements sont inclus dans le sitemap dédié"
);
for (const sitemap of [
  "monte-escalier-villes.xml",
  "douche-senior-departements.xml",
  "douche-senior-villes.xml"
]) {
  const source = await readFile(path.join(dist, "sitemaps", sitemap), "utf8");
  assert.equal(source.includes("<loc>"), false, `${sitemap}: aucun draft`);
}

const directoryBuilt = await readFile(path.join(dist, "monte-escalier/departements/index.html"), "utf8");
assert.ok(directoryBuilt.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
assert.equal((directoryBuilt.match(/<h1\b/g) || []).length, 1);
assert.equal(
  (directoryBuilt.match(/data-department-directory/g) || []).length,
  new Set(localPages.filter((page) => page.service === "monte-escalier" && page.pageLevel === "department").map((page) => page.regionName)).size,
  "un annuaire est rendu pour chaque région"
);
for (const route of ["/monte-escalier/nord/", "/monte-escalier/oise/", "/monte-escalier/somme/"]) {
  assert.ok(directoryBuilt.includes(`href="${route}"`));
}
assert.equal(
  (directoryBuilt.match(/Prix, aides et données locales/g) || []).length,
  101,
  "l’annuaire national affiche 101 guides départementaux"
);
const mayotteBuilt = await readFile(path.join(dist, "monte-escalier/mayotte/index.html"), "utf8");
assert.ok(mayotteBuilt.includes("323 153 habitants"));
assert.ok(mayotteBuilt.includes("millésime 2017"));
assert.ok(mayotteBuilt.includes("mêmes tableaux RP 2023"));
assert.equal(mayotteBuilt.includes("Population âgée de 80 ans ou plus"), false);
assert.equal(directoryBuilt.includes("/monte-escalier/nord/lille/"), false);

for (const file of [
  "Modele-departement.dc.html",
  "Modele-ville.dc.html",
  "Modele-departement-douche.dc.html",
  "Modele-ville-douche.dc.html"
]) {
  await assert.rejects(access(path.join(dist, file)), `${file}: maquette à placeholders non publique`);
}

console.log(
  "Validated 101 indexable department pages, the national hub, remaining drafts, local schema, nationwide coverage, structured prices, INSEE calculations, Mayotte exception, dynamic modules, sitemaps, similarity, and SEO hierarchy."
);
