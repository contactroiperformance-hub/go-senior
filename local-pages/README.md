# Moteur de pages locales Go Senior

Ce dossier transforme les quatre maquettes Claude Design en templates de
production réutilisables, sans créer de variante visuelle. Le rendu réutilise
les composants existants `Header`, `Footer` et `BlocProjet`.

## Fichiers

- `data.mjs` : données structurées des quatre pages de validation.
- `schema.mjs` : schéma, validation, règles de publication, couverture,
  filtrage du maillage, sitemaps et contrôle de similarité.
- `render.mjs` : quatre templates (`monte-escalier`/`douche-senior` ×
  `department`/`city`) et leurs sections communes.

Les fichiers `Modele-departement*.dc.html` et `Modele-ville*.dc.html` restent
les références visuelles validées. Ils ne sont plus copiés dans le répertoire
public, afin qu’aucun placeholder de maquette ne puisse être servi.

## Modèle commun

Chaque entrée contient au minimum :

`id`, `service`, `pageLevel`, `regionName`, `regionSlug`, `departmentName`,
`departmentSlug`, `departmentCode`, `cityName`, `citySlug`, `inseeCode`,
`postalCodes`, `intercommunalityName`, `seoTitle`, `metaDescription`, `h1`,
`introduction`, `geographicScope`, `nationalPriceReference`,
`localCostFactors`, `demographicData`, `housingData`,
`localHousingCommentary`, `projectOptions`, `coownershipConsiderations`,
`localAssistancePrograms`, `usefulLocalContacts`,
`professionalCoverageStatus`, `coveredPostalCodes`, `nearbyLocations`, `faq`,
`officialSources`, `conclusion`, `cta`, `sourceCheckedAt`, `status`,
`indexStatus`, `sitemapStatus`, `publishedAt` et `updatedAt`.

Le moteur ajoute aussi `canonical` et `serviceDetails`. Les données INSEE et
les sources officielles ont leurs propres sous-schémas structurés.

## Règles de publication

Une page demandée comme `published` est automatiquement ramenée à `draft` si
une condition manque : introduction, périmètre, données INSEE complètes,
millésime, sources officielles dont une locale, aide ou ressource vérifiée,
FAQ dynamique, conclusion, CTA, canonical ou contrôle des placeholders.

Une ville publiée exige 6 à 10 FAQ, dont au moins 3 locales. Les pages trop
similaires sont signalées avant le build. Une destination voisine n’est liée
que si elle est `published`, `index`, `included` et réellement générée.

Les trois états de couverture sont `coverage_available`,
`coverage_partial` et `coverage_unavailable`. Les deux premiers exigent de
véritables codes postaux actifs. Pour une ville, `coverage_available` exige
que tous les codes postaux déclarés soient couverts ; sinon l’état attendu est
`coverage_partial`.

Un draft reçoit `noindex, follow`, un en-tête `X-Robots-Tag`, reste absent de
tous les sitemaps et n’est lié depuis aucun répertoire public.

## Pages de validation

- `/monte-escalier/nord/`
- `/monte-escalier/nord/lille/`
- `/douche-senior/gironde/`
- `/douche-senior/gironde/bordeaux/`

Ces quatre pages restent volontairement en draft. Les modules démographiques,
habitat, aides, contacts, FAQ, sources, villes voisines et conclusion sont
masqués tant que leurs données vérifiées ne sont pas intégrées.

## Premier lot publiable

Avant de passer une page à `published`, compléter `data.mjs`, documenter les
sources officielles et dates de consultation, fournir les codes postaux actifs
issus du système partenaires, puis exécuter `npm run build`, `npm run check` et
`npm test`. Le build ajoute automatiquement la page aux sitemaps appropriés
uniquement si toutes les règles sont satisfaites.
