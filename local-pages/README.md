# Moteur de pages locales Go Senior

Ce dossier transforme les quatre maquettes Claude Design en templates de
production réutilisables, sans créer de variante visuelle. Le rendu réutilise
les composants existants `Header`, `Footer` et `BlocProjet`.

Le moteur publie 202 guides départementaux : 101 pour le monte-escalier et
101 pour la douche senior. Il publie aussi 1 002 guides communaux : 501 pour
le monte-escalier et 501 pour la douche senior, soit les cinq communes les
plus peuplées de chaque département (Paris étant à la fois commune et
département). Le snapshot
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
millésime, sources officielles dont une locale, FAQ dynamique, conclusion,
CTA, canonical ou contrôle des placeholders. Une aide ou ressource locale
vérifiée reste requise pour le monte-escalier, pas pour la douche senior :
les pages douche privilégient les travaux, les contraintes techniques et le devis.

Un département publié exige au moins 350 mots éditoriaux, 5 FAQ locales et 3
lieux nommés. Une ville publiée exige 6 à 10 FAQ, dont au moins 3 locales. Les
séquences de six mots propres au contenu local sont comparées entre les pages
du même service et du même niveau, avec blocage dès 65 % de similarité. Les
séquences de gabarit présentes sur plus de 5 % du groupe comparable sont
écartées afin de mesurer la ressemblance du contenu local plutôt que les
explications communes au service. Une destination voisine n’est liée
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
  cinq communes ou secteurs repères, un maillage régional et des liens vers
  les guides communaux.
- `/monte-escalier/{departement}/{ville}/` : 501 guides `published`, `index` et
  `included`, avec statistiques communales, configuration d’escalier à relever,
  facteurs de coût, aides vérifiées, FAQ et sources locales.
- `/douche-senior/departements/` : hub national généré et indexable, sans mise
  en avant des aides.
- `/douche-senior/{departement}/` : 101 guides `published`, `index` et
  `included`, avec données séparées maisons/appartements, contraintes de sol,
  plomberie, étanchéité, copropriété, prix, maillage régional et liens vers
  les cinq principaux guides communaux.
- `/douche-senior/{departement}/{ville}/` : 501 guides `published`, `index` et
  `included`, avec statistiques communales INSEE, contexte logement, facteurs
  de chantier, FAQ et sources propres à la ville. Pour les cinq communes de
  Mayotte, la population communale de l’API Géo est complétée par un contexte
  logement départemental 2017 explicitement signalé, sans inventer de chiffre
  communal indisponible.

Pour chaque service, la page nationale et le hub forment le chemin national →
annuaire régionalisé → département.

## Brouillons de validation

Aucun brouillon local n’est actuellement exposé. Une future page incomplète
sera automatiquement ramenée à `draft`, en `noindex, follow` et hors sitemap.

## Premier lot publiable

Avant de passer une page à `published`, compléter `data.mjs`, documenter les
sources officielles et dates de consultation, rédiger un commentaire logement,
des facteurs de coût et une FAQ réellement locaux, puis exécuter `npm run build`,
`npm run check` et `npm test`. Le build ajoute automatiquement la page au hub et
aux sitemaps appropriés uniquement si toutes les règles sont satisfaites.
