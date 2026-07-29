# Audit SEO / GEO — Go Senior

Date de l’audit : 29 juillet 2026

## Périmètre

- 39 pages/composants sources contrôlés.
- 28 routes publiques construites, dont 23 routes indexables.
- Tests mobile à 390 px et desktop à 1 280 px.
- Contrôle du rendu, des ancres, du débordement horizontal, des métadonnées, du sitemap, des données structurées et des performances.

## Résultat après optimisation

- Lighthouse SEO mobile : **100/100** (92/100 avant correction).
- Lighthouse navigation agentique : **100/100** (98/100 avant correction).
- LCP observé en laboratoire : **215 ms**.
- CLS observé en laboratoire : **0,00**.
- 23 titres uniques et 23 meta descriptions uniques sur les 23 pages indexables.
- Un seul H1 sur chaque page indexable.
- Aucun attribut `alt` manquant sur les images des pages indexables.
- Aucun lien `href="#"` restant dans les contenus indexables.
- `robots.txt`, sitemap XML, URL canoniques et directives d’indexation validés.

## Correctifs appliqués

- Les titres, meta descriptions, URL canoniques et directives robots sont désormais présents directement dans le vrai `<head>` initial, sans dépendre de JavaScript.
- Ajout des métadonnées Open Graph et Twitter avec une image propre à la page lorsque disponible.
- Ajout de JSON-LD Schema.org : `Organization`, `WebSite`, `WebPage` et `BreadcrumbList`.
- Autorisation des grands aperçus d’images et des extraits complets pour les pages indexables.
- Liens de sources MaPrimeAdapt’ reliés aux pages officielles France Rénov’, Anah et Service-Public.fr.
- Ancres testées avec compensation du header fixe, notamment `/maprimeadapt/#simulateur`.
- Débordement horizontal mobile bloqué ; mini-questionnaire et navigation contenus à 390 px.
- Les ressources de police partagées ne sont plus injectées par les composants réutilisés.
- Contrôles automatiques renforcés pour vérifier à chaque build les métadonnées, JSON-LD, H1, viewport, débordement horizontal, liens internes et intégrations Analytics/Clarity.

## GEO

Google indique que les fondamentaux SEO restent les fondations de la visibilité dans les réponses génératives : contenu utile, structure claire, pages indexables, HTML accessible, bonnes performances et sources fiables. Google précise aussi qu’aucun balisage « GEO » spécial ni fichier `llms.txt` n’est requis pour ses fonctions génératives.

Le site dispose désormais des éléments techniques qui facilitent cette compréhension : contenu textuel accessible dans le HTML initial, identité éditoriale et légale explicite, méthodologie, sources officielles, entités Schema.org cohérentes, fil d’Ariane et métadonnées uniques.

Sources :

- [Google — Optimizing your website for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google — Search technical requirements](https://developers.google.com/search/docs/essentials/technical)
- [Google — Structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

## Points à suivre hors code

- Vérifier la propriété du domaine dans Google Search Console, soumettre `https://go-senior.fr/sitemap.xml` et contrôler l’indexation des 23 URL.
- Suivre le rapport de performance générative dans Search Console lorsqu’il est disponible pour la propriété.
- Lighthouse signale encore quelques contrastes très proches du seuil WCAG et les cookies tiers d’Analytics/Clarity. Ils n’empêchent pas le score SEO de 100 ; les couleurs n’ont pas été modifiées afin de préserver le design.
- Certains titres éditoriaux sont longs et peuvent être tronqués dans les résultats. Ils ont été conservés à l’identique pour respecter le wording fourni.
