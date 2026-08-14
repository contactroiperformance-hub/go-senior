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

assert.equal(localPages.length, 1204, "202 pages départementales et 1 002 pages ville publiées");
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
  assert.equal(publication.ready, true);
  assert.equal(publication.status, "published");
  assert.equal(publication.indexStatus, "index");
  assert.equal(publication.sitemapStatus, "included");
  assert.deepEqual(publication.reasons, []);
}

for (const page of localPages.filter((item) => item.service === "douche-senior")) {
  assert.equal(page.localAssistancePrograms.length, 0, `${page.id}: aucun bloc d’aides mis en avant`);
  assert.equal(page.usefulLocalContacts.length, 0, `${page.id}: aucun bloc de financement local`);
  assert.equal(page.serviceDetails.projectAssistance.length, 0, `${page.id}: aucune aide dans les arguments service`);
  assert.equal(/\baides?\b/i.test(`${page.seoTitle} ${page.metaDescription} ${page.h1} ${page.introduction} ${page.conclusion}`), false, `${page.id}: aides absentes des zones SEO et principales`);
  assert.equal(page.nationalPriceReference.length, 5, `${page.id}: cinq fourchettes de prix structurées`);
}

const nord = localPages.find((page) => page.id === "monte-escalier-nord");
const oise = localPages.find((page) => page.id === "monte-escalier-oise");
const somme = localPages.find((page) => page.id === "monte-escalier-somme");
const lille = localPages.find((page) => page.id === "monte-escalier-nord-lille");
const bordeaux = localPages.find((page) => page.id === "douche-senior-gironde-bordeaux");
const mayotte = localPages.find((page) => page.id === "monte-escalier-mayotte");
const showerGironde = localPages.find((page) => page.id === "douche-senior-gironde");
const showerParis = localPages.find((page) => page.id === "douche-senior-paris");
const showerMayotte = localPages.find((page) => page.id === "douche-senior-mayotte");
const stairMamoudzou = localPages.find((page) => page.id === "monte-escalier-mayotte-mamoudzou");
assert.ok(nord && oise && somme && lille && bordeaux && showerGironde && showerParis && showerMayotte && stairMamoudzou);
assert.ok(mayotte);
assert.equal(new Set(localPages.map((page) => page.id)).size, localPages.length, "identifiants locaux uniques");
assert.equal(new Set(localPages.map((page) => localPageRoute(page))).size, localPages.length, "routes locales uniques");
assert.equal(localPages.filter((page) => page.service === "monte-escalier" && page.pageLevel === "city").length, 501);
assert.equal(localPages.filter((page) => page.service === "douche-senior" && page.pageLevel === "city").length, 501);
assert.equal(effectivePublication(lille).status, "published");
assert.equal(effectivePublication(lille).indexStatus, "index");
assert.equal(effectivePublication(lille).sitemapStatus, "included");
assert.equal(lille.introduction, "À Lille, le choix du rail dépend d’abord de la forme de l’escalier : droit, tournant ou avec palier. Une prise de mesures permet ensuite de vérifier le passage disponible, le pivotement du siège et les éventuelles contraintes de copropriété.");
for (const page of localPages.filter((item) => item.service === "monte-escalier" && item.pageLevel === "city")) {
  const introductionWordCount = page.introduction.split(/\s+/).length;
  assert.ok(introductionWordCount >= 25 && introductionWordCount <= 50, `${page.id}: introduction monte-escalier concise`);
  assert.ok(page.localHousingCommentary.split(/\s+/).length <= 120, `${page.id}: commentaire monte-escalier concis`);
  assert.equal(page.nationalPriceReference.length, 4, `${page.id}: quatre fourchettes monte-escalier`);
  assert.ok(page.localAssistancePrograms.length >= 2, `${page.id}: ressources nationales et départementales`);
  assert.ok(page.nearbyLocations.length >= 4, `${page.id}: maillage vers les autres villes du département`);
  assert.equal(/sans déduire une solution standard|données communales interchangeables/i.test(`${page.introduction} ${page.localHousingCommentary}`), false, `${page.id}: aucune formulation artificielle`);
}
assert.ok(stairMamoudzou.localHousingCommentary.includes("ne sont pas présentés comme des chiffres communaux"));
assert.equal(stairMamoudzou.faq.some((item) => /Ces chiffres décrivent la commune entière/.test(item.answer)), false);
assert.equal(effectivePublication(bordeaux).status, "published");
assert.equal(effectivePublication(bordeaux).indexStatus, "index");
assert.equal(effectivePublication(bordeaux).sitemapStatus, "included");
assert.ok(bordeaux.introduction.includes("L’INSEE recense 79 % d’appartements dans la commune"));
assert.equal(/sans déduire une solution standard du seul code postal|Le projet commence par les gestes qui posent problème/i.test(bordeaux.introduction), false);
for (const page of localPages.filter((item) => item.service === "douche-senior" && item.pageLevel === "city")) {
  assert.ok(page.introduction.split(/\s+/).length >= 45, `${page.id}: introduction explicative`);
  assert.ok(page.localHousingCommentary.split(/\s+/).length <= 120, `${page.id}: commentaire local concis`);
  assert.equal(/rang \d parmi les cinq communes|sans déduire une solution standard|données communales interchangeables/i.test(`${page.introduction} ${page.localHousingCommentary}`), false, `${page.id}: aucune formulation artificielle`);
}

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
  localHousingCommentary: "Le commentaire de test relie explicitement les données structurées aux vérifications techniques nécessaires pour le projet, sans produire d’affirmation publique. Il rappelle aussi que les statistiques d’une commune ne décrivent pas un escalier particulier : la largeur, les marches, les virages, les paliers, les portes et les accès doivent être relevés séparément. Le devis de test distingue enfin l’équipement, le rail, la pose, les options et les travaux complémentaires.",
  coownershipConsiderations: "Le scénario de test distingue les parties privatives, les accès partagés et les éventuelles autorisations à contrôler avant une intervention.",
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
    answer: `Réponse distincte du jeu de test numéro ${index + 1}, suffisamment explicite pour valider le rendu dynamique de la FAQ. Elle précise que la mesure, les dégagements, la fixation, l’alimentation, le passage restant et le périmètre du devis doivent être vérifiés pour le logement concerné.`,
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
  conclusion: "Cette conclusion de test confirme que les données locales, les sources et les contrôles doivent être validés avant toute publication. Elle documente également la couverture géographique, la disponibilité professionnelle, les garanties contractuelles et les responsabilités de chaque intervenant.",
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
assert.equal(publicationReadiness(completePage).ready, true, publicationReadiness(completePage).reasons.join(" | "));
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
const nonPublicLille = { ...lille, status: "draft", indexStatus: "noindex", sitemapStatus: "excluded" };
nearbyFixture.nearbyLocations = [completePage.id, nonPublicLille.id];
assert.deepEqual(
  publicNearbyLocations(nearbyFixture, [completePage, nonPublicLille, nearbyFixture]).map((page) => page.id),
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
for (const postalCode of ["33000", "75015", "97100"]) {
  const availability = projectAvailability("douche-senior", postalCode, "active");
  assert.equal(availability.validPostalCode, true);
  assert.equal(availability.coverageStatus, "configurable");
  assert.equal(availability.covered, false);
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
assert.equal((nordBuilt.match(/href="\/projet\/\?projet=monte-escalier&amp;type=/g) || []).length, 8);
assert.ok(nordBuilt.includes("Monte-escalier assis-debout"));
assert.equal(nordBuilt.includes("plateforme d’appui"), false);
assert.ok(nordBuilt.includes("2 500 – 5 500 €"));
assert.ok(nordBuilt.includes("J’Amén’Âge 59"));
assert.ok(nordBuilt.includes("03 59 73 73 73"));
assert.ok(nordBuilt.includes("Un accompagnement simple, du premier échange au devis"));
assert.ok(nordBuilt.includes("Ce que le professionnel relève ensuite"));
assert.ok(nordBuilt.includes("Rail rectiligne pour un escalier sans virage"));
assert.equal((nordBuilt.match(/class="local-project-card"/g) || []).length, 4);
assert.ok(nordBuilt.includes("/uploads/monte-escalier-droit.webp"));
assert.ok(nordBuilt.includes("/uploads/monte-escalier-tournant-interieur.webp"));
assert.ok(nordBuilt.includes("/uploads/monte-escalier-exterieur-perron.webp"));
assert.ok(nordBuilt.includes("/uploads/siege-monte-escalier-replie.webp"));
assert.ok(nordBuilt.includes("grid-column:1/-1;order:2;aspect-ratio:1340/560"));
assert.ok(nordBuilt.includes(".local-hero-visual{grid-column:auto;aspect-ratio:4/3;max-height:340px}"));
assert.equal(nordBuilt.includes("date de publication non communiquée"), false);
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
assert.ok(nordBuilt.includes("<title>Monte-escalier dans le Nord (59)\u00a0: prix et aides | Go Senior</title>"));
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
assert.ok(nordBuilt.includes("/monte-escalier/nord/lille/"), "le département est maillé vers Lille");
assert.equal((nordBuilt.match(/data-local-city-guides/g) || []).length, 1);
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

const showerGirondeBuilt = await readFile(path.join(dist, "douche-senior/gironde/index.html"), "utf8");
assert.ok(showerGirondeBuilt.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
assert.equal(showerGirondeBuilt.includes("data-local-draft-banner"), false);
assert.equal((showerGirondeBuilt.match(/data-local-insee-card/g) || []).length, 6);
assert.equal((showerGirondeBuilt.match(/<details data-local-faq/g) || []).length, 8);
assert.equal((showerGirondeBuilt.match(/class="local-project-card"/g) || []).length, 3);
assert.ok(showerGirondeBuilt.includes("Part des appartements dans le parc de logements"));
assert.ok(showerGirondeBuilt.includes("Plomberie"));
assert.ok(showerGirondeBuilt.includes("Étanchéité"));
assert.ok(showerGirondeBuilt.includes("Copropriété"));
assert.ok(showerGirondeBuilt.includes("4 000 – 9 000 €"));
assert.ok(showerGirondeBuilt.includes("Remplacement d’une baignoire"));
assert.ok(showerGirondeBuilt.includes('data-coverage="configurable"'));
assert.ok(showerGirondeBuilt.includes('data-routing="active"'));
assert.ok(showerGirondeBuilt.includes("/douche-senior/departements/"));
assert.ok(showerGirondeBuilt.includes("/uploads/douche-plain-pied-siege-rabattable.webp"));
assert.equal((showerGirondeBuilt.match(/data-local-city-guides/g) || []).length, 1);
for (const route of [
  "/douche-senior/gironde/bordeaux/",
  "/douche-senior/gironde/merignac/",
  "/douche-senior/gironde/pessac/",
  "/douche-senior/gironde/talence/",
  "/douche-senior/gironde/villenave-dornon/"
]) {
  assert.ok(showerGirondeBuilt.includes(`href="${route}"`), `maillage département vers ${route}`);
}
assert.equal(/Aides locales|Aides nationales|MaPrimeAdapt|APA —/i.test(showerGirondeBuilt), false);
assert.equal(/prix et aides|aides et professionnels/i.test(showerGirondeBuilt), false);
assert.equal(containsPublicPlaceholder(showerGirondeBuilt), false);

const showerPillarBuilt = await readFile(path.join(dist, "douche-senior/index.html"), "utf8");
assert.ok(showerPillarBuilt.includes("Douche senior\u00a0: prix, modèles, travaux et installation"));
assert.ok(showerPillarBuilt.includes('id="contraintes"'));
assert.ok(showerPillarBuilt.includes('href="/douche-senior/departements/"'));
assert.equal(showerPillarBuilt.includes('id="aides"'), false);
assert.equal(showerPillarBuilt.includes("MaPrimeAdapt"), false);

const lilleBuilt = await readFile(path.join(dist, "monte-escalier/nord/lille/index.html"), "utf8");
const bordeauxBuilt = await readFile(path.join(dist, "douche-senior/gironde/bordeaux/index.html"), "utf8");
assert.ok(lilleBuilt.includes('cp-exemple="59000"'));
assert.equal(lilleBuilt.includes('cp-exemple="33000"'), false);
assert.ok(lilleBuilt.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
assert.equal(lilleBuilt.includes("data-local-draft-banner"), false);
assert.equal((lilleBuilt.match(/data-local-insee-card/g) || []).length, 6);
assert.equal((lilleBuilt.match(/<details data-local-faq/g) || []).length, 9);
assert.ok(lilleBuilt.includes("Commune de Lille"));
assert.ok(lilleBuilt.includes("Rail rectiligne ou fabriqué sur mesure"));
assert.ok(lilleBuilt.includes("MaPrimeAdapt’"));
assert.ok(lilleBuilt.includes("forme de l’escalier\u00a0: droit, tournant ou avec palier"));
assert.equal(lilleBuilt.includes("forme de l’escalier : droit, tournant ou avec palier"), false);
assert.equal(lilleBuilt.includes("la première décision consiste à savoir si le rail peut rester rectiligne"), false);
assert.ok(lilleBuilt.includes('href="/monte-escalier/nord/lille/#budget"'));
assert.ok(lilleBuilt.includes('href="/monte-escalier/nord/lille/#faisabilite"'));
assert.ok(bordeauxBuilt.includes('cp-exemple="33000"'));
assert.equal(bordeauxBuilt.includes('cp-exemple="59000"'), false);
assert.ok(bordeauxBuilt.includes('href="/douche-senior/gironde/bordeaux/#budget"'));
assert.ok(bordeauxBuilt.includes('href="/douche-senior/gironde/bordeaux/#faisabilite"'));
assert.ok(bordeauxBuilt.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
assert.equal(bordeauxBuilt.includes("data-local-draft-banner"), false);
assert.equal((bordeauxBuilt.match(/data-local-insee-card/g) || []).length, 6);
assert.equal((bordeauxBuilt.match(/<details data-local-faq/g) || []).length, 8);
assert.ok(bordeauxBuilt.includes("Commune de Bordeaux"));
assert.equal(/Aides locales|Aides nationales|MaPrimeAdapt|APA —/i.test(bordeauxBuilt), false);

const rootSitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
assert.equal((rootSitemap.match(/<loc>/g) || []).length, 1228, "1 228 URL indexables dans le sitemap principal");
for (const page of localPages) {
  const expected = effectivePublication(page).status === "published";
  assert.equal(rootSitemap.includes(`${origin}${localPageRoute(page)}`), expected, `${page.id}: présence sitemap cohérente`);
}
assert.ok(rootSitemap.includes(`${origin}/monte-escalier/departements/`));
assert.ok(rootSitemap.includes(`${origin}/douche-senior/departements/`));
const departmentSitemap = await readFile(path.join(dist, "sitemaps/monte-escalier-departements.xml"), "utf8");
for (const page of [nord, oise, somme]) {
  assert.ok(departmentSitemap.includes(`${origin}${localPageRoute(page)}`));
}
assert.equal(
  (departmentSitemap.match(/<loc>/g) || []).length,
  101,
  "les 101 départements sont inclus dans le sitemap dédié"
);
const showerDepartmentSitemap = await readFile(path.join(dist, "sitemaps/douche-senior-departements.xml"), "utf8");
for (const page of [showerGironde, showerParis, showerMayotte]) {
  assert.ok(showerDepartmentSitemap.includes(`${origin}${localPageRoute(page)}`));
}
assert.equal(
  (showerDepartmentSitemap.match(/<loc>/g) || []).length,
  101,
  "les 101 pages douche senior sont incluses dans leur sitemap dédié"
);
const stairCitySitemap = await readFile(path.join(dist, "sitemaps/monte-escalier-villes.xml"), "utf8");
assert.equal((stairCitySitemap.match(/<loc>/g) || []).length, 501, "les 501 pages ville monte-escalier sont incluses");
assert.ok(stairCitySitemap.includes(`${origin}/monte-escalier/nord/lille/`));
const showerCitySitemap = await readFile(path.join(dist, "sitemaps/douche-senior-villes.xml"), "utf8");
assert.equal((showerCitySitemap.match(/<loc>/g) || []).length, 501, "les 501 pages ville douche sont incluses");
assert.ok(showerCitySitemap.includes(`${origin}/douche-senior/gironde/bordeaux/`));

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
const showerDirectoryBuilt = await readFile(path.join(dist, "douche-senior/departements/index.html"), "utf8");
assert.ok(showerDirectoryBuilt.includes('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'));
assert.equal((showerDirectoryBuilt.match(/<h1\b/g) || []).length, 1);
assert.equal(
  (showerDirectoryBuilt.match(/data-department-directory/g) || []).length,
  new Set(localPages.filter((page) => page.service === "douche-senior" && page.pageLevel === "department").map((page) => page.regionName)).size,
  "un annuaire douche est rendu pour chaque région"
);
for (const route of ["/douche-senior/gironde/", "/douche-senior/paris/", "/douche-senior/mayotte/"]) {
  assert.ok(showerDirectoryBuilt.includes(`href="${route}"`));
}
assert.equal(
  (showerDirectoryBuilt.match(/Prix, travaux et données logement/g) || []).length,
  101,
  "l’annuaire douche affiche 101 guides départementaux"
);
assert.equal(/Aides locales|Aides nationales|prix et aides/i.test(showerDirectoryBuilt), false);
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
  "Validated 202 indexable department pages, 501 indexable stairlift city pages, 501 indexable shower city pages, two national hubs, local schema, coverage rules, structured prices, INSEE calculations, Mayotte exceptions, dynamic modules, sitemaps, similarity, and SEO hierarchy."
);
