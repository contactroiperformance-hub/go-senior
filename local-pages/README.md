# Moteur de pages locales Go Senior

Ce dossier transforme les quatre maquettes Claude Design en templates de
production réutilisables, sans créer de variante visuelle. Le rendu réutilise
les composants existants `Header`, `Footer` et `BlocProjet`.

Le moteur publie les 101 guides départementaux monte-escalier. Le snapshot
`department-records.mjs` est construit depuis l’API Géo et les dossiers INSEE
avec `npm run data:departments`. Mayotte conserve des millésimes 2017/2026
explicites, car les tableaux RP 2023 homogènes n’y sont pas encore disponibles.

## Fichiers

- `data.mjs` : données structurées des pages locales publiées et des brouillons de validation.
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
`departmentSlug`, `departmentCode`, `locationPhrase`, `cityName`, `citySlug`, `inseeCode`,
`postalCodes`, `intercommunalityName`, `seoTitle`, `metaDescription`, `h1`,
`introduction`, `geographicScope`, `nationalPriceReference`,
`localCostFactors`, `demographicData`, `housingData`,
`localHousingCommentary`, `projectOptions`, `coownershipConsiderations`,
`localAssistancePrograms`, `usefulLocalContacts`,
`coverageStatus`, `routingStatus`, `leadDistributionMode`, `coveredPostalCodes`, `nearbyLocations`, `faq`,
`officialSources`, `conclusion`, `cta`, `sourceCheckedAt`, `status`,
`indexStatus`, `sitemapStatus`, `publishedAt` et `updatedAt`.

Le moteur ajoute aussi `canonical` et `serviceDetails`. Les données INSEE et
les sources officielles ont leurs propres sous-schémas structurés.

## Règles de publication

Une page demandée comme `published` est automatiquement ramenée à `draft` si
une condition manque : introduction, périmètre, données INSEE complètes,
millésime, sources officielles dont une locale, aide ou ressource vérifiée,
FAQ dynamique, conclusion, CTA, canonical ou contrôle des placeholders.

Un département publié exige au moins 350 mots éditoriaux, 5 FAQ locales et 3
lieux nommés. Une ville publiée exige 6 à 10 FAQ, dont au moins 3 locales. Les
séquences de six mots sont comparées entre toutes les pages, avec blocage dès
65 % de similarité. Une destination voisine n’est liée
que si elle est `published`, `index`, `included` et réellement générée.

La couverture et le routing sont séparés. Le monte-escalier utilise
`coverageStatus = nationwide` pour tous les codes postaux français valides ;
le code postal reste utilisé pour localiser et orienter la demande. Le routing
utilise `active`, `capped`, `paused` ou `technical_error`, sans jamais transformer
un cap, une pause ou une erreur technique en absence de couverture. Les autres
services restent `configurable`.

Un draft reçoit `noindex, follow`, un en-tête `X-Robots-Tag`, reste absent de
tous les sitemaps et n’est lié depuis aucun répertoire public.

## Architecture publique

- `/monte-escalier/departements/` : hub national généré, indexable, qui ne liste que les départements publiés.
- `/monte-escalier/{departement}/` : 101 guides `published`, `index` et
  `included`, alimentés par les données INSEE, des ressources officielles CNSA,
  cinq communes ou secteurs repères et un maillage régional.

Le hub et la page nationale `/monte-escalier/` forment le chemin national →
annuaire régionalisé → département.

## Brouillons de validation

- `/monte-escalier/nord/lille/`
- `/douche-senior/gironde/`
- `/douche-senior/gironde/bordeaux/`

Ces trois pages restent volontairement en draft, en `noindex, follow` et hors
sitemap. Elles masquent les modules dont les données vérifiées ne sont pas intégrées.

## Premier lot publiable

Avant de passer une page à `published`, compléter `data.mjs`, documenter les
sources officielles et dates de consultation, rédiger un commentaire logement,
des facteurs de coût et une FAQ réellement locaux, puis exécuter `npm run build`,
`npm run check` et `npm test`. Le build ajoute automatiquement la page au hub et
aux sitemaps appropriés uniquement si toutes les règles sont satisfaites.
