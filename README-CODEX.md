# Go Senior — go-senior.fr · Handoff Codex

Maquette haute-fidélité complète du site. Chaque fichier .dc.html est une page HTML autonome (ouvrable dans un navigateur) ; le design de référence est à recréer en production avec le framework de votre choix.

## Démarrage
- Ouvrir Accueil.dc.html (page d'accueil, navigation fonctionnelle entre toutes les pages)
- Design-system.dc.html : couleurs, typographie, boutons, champs, espacements, notes de décision et consignes d'implémentation (images, accessibilité, SEO)

## Pages locales programmatiques — spécification (handoff)

Quatre modèles, un par combinaison service × échelon. Les fichiers `Modele-*.dc.html` servent uniquement à valider le design ; les routes publiques sont produites à partir des données contrôlées dans `local-pages/data.mjs`.

### Composants communs aux 4 modèles (à implémenter une fois)
- Header.dc.html / Footer.dc.html
- BlocProjet.dc.html — formulaire code postal (props `projet`, `title`) ; présent 2× par page : hero + CTA final
- Breadcrumb (nav aria-label="Fil d’Ariane") — national → annuaire des départements → département (→ ville)
- Cartes statistiques INSEE (fond blanc, bordure #E5DFD2, chiffre Source Serif 28px #2E5B4C, millésime gris)
- Lignes de prix nationaux (libellé + fourchette, jamais présentées comme devis)
- Bandeau « Comment fonctionne la mise en relation ? » (3 étapes, mention un-à-un)
- Cartes lien officiel (titre + URL + « vérifié/consulté le [date] »)
- Accordéons FAQ `<details>` natifs
- Puces villes (pills) — uniquement des pages réellement publiées, jamais « bientôt disponible »
- Bandeau brouillon + encarts d’état de couverture (verts / ambre)

### Spécifique Monte-escalier (département + ville)
- Types de monte-escalier : droit / tournant / extérieur
- Prix nationaux : droit 2 500–5 500 € · tournant 6 000–12 000 €
- Ville : section « Logements et escaliers rencontrés à [ville] » (configurations dominantes)

### Spécifique Douche senior (département + ville)
- Transformations : remplacement baignoire→douche / plain-pied ou extra-plate / salle de bain adaptée (AUCUN module rail, palier ou nombre de niveaux)
- Prix nationaux : remplacement 4 000–9 000 € · plain-pied 5 000–10 000 € · SDB complète 8 000–15 000 €
- Département : cartes INSEE part maisons ET part appartements
- Ville : section « Votre installation actuelle et votre projet » + encart copropriété (jamais d’affirmation juridique générique)

### Champs de données par page (chaque champ : valeur + source + millésime/date de vérification)
Département : intro rédigée unique · interprétation locale des données · INSEE (65+, 75+, part maisons, part appartements [douche], propriétaires occupants, logements avant [année] [monte-escalier]) · facteurs locaux de prix rédigés · aides départementales vérifiées (CD, MDPH/MDA : nom + URL + date) · liste des villes publiées · 2–4 FAQ locales · sources.
Ville : intro rédigée unique · périmètre (ville + intercommunalité) · INSEE communal (population, 65+, logements avant [année] ou part d’appartements) · commentaire habitat rédigé · configurations locales · aides ville/métropole/département vérifiées · CCAS · 2–4 FAQ locales · villes voisines publiées · conclusion rédigée · photo locale OPTIONNELLE (1560×560 — la page fonctionne sans ; le module photo est simplement masqué) · sources.
Interdit : générer une page par simple substitution du nom de ville/département.

### États (props des 4 modèles, panneau Tweaks)
- `couverture` : `disponible` / `partielle` / `non-confirmee` (≡ coverage_available / coverage_partial / coverage_unavailable). Liée aux véritables codes postaux actifs, pas au nom de la ville — ne jamais prétendre que toute la ville est couverte parce que quelques codes postaux le sont. Les noms techniques des états ne sont JAMAIS affichés au public (copys publiques déjà rédigées dans les maquettes).
- `statut` : `publie` / `brouillon` (bandeau ambre ; page noindex, hors sitemap et hors listes — jamais rendue publique)

### Règles de masquage
Toute donnée absente masque son module EN ENTIER (carte INSEE, aide, FAQ, ville, photo) — jamais de champ vide ni de crochet à l’écran. Si les modules essentiels manquent (intro, INSEE, aides), la page reste en `brouillon`.

### Responsive (les modèles sont déjà fluides)
- Tout est en cartes (grid auto-fit) — aucun tableau à convertir
- BlocProjet reste dans le hero en mobile (formulaire immédiatement accessible) + barre CTA fixe du Header (≤ 1060px)
- Villes en puces qui passent à la ligne — au-delà de ~12 villes, prévoir un « Voir toutes les villes » replié, pas une longue grille
- FAQ et sources : pleine largeur, accordéons natifs, cibles ≥ 44px

### Accessibilité
Un seul H1 par page · hiérarchie H2/H3 stricte · corps ≥ 18px · breadcrumb en `nav aria-label` · `details` natifs (clavier) · focus visible global · alt descriptifs sur les photos locales · contrastes AA respectés (texte sur ivoire/vert foncé).

### Addendum d'implémentation (règles Codex)
1. Transformer tous les textes entre crochets en champs de données structurés — aucun crochet ni placeholder ne peut apparaître en production.
2. Masquer automatiquement toute section dont les données nécessaires sont absentes ; sources locales manquantes = publication bloquée, jamais de carte vide.
3. Maintenir une page en `brouillon` + noindex tant que son contenu local est incomplet.
4. Placeholder de code postal dynamique selon la localité (prop `cp-exemple` de BlocProjet : Bordeaux 33000, Lille 59000…).
5. Bloc de prix visible haut de page quand le H1 cible une intention tarifaire — fourchettes nationales vérifiées uniquement, jamais de faux prix moyens locaux.
6. Données INSEE : valeur + source + année + date de récupération. Aides et contacts : uniquement des sources officielles vérifiées (organisme, titre exact, donnée soutenue, dates, lien cliquable).
7. FAQ : liste dynamique de 6 à 10 questions, dont ≥ 3–4 réellement locales, jamais dupliquées.
8. Villes voisines / principales villes : uniquement des pages publiées, complètes, indexables et dans le sitemap ; liste vide = section masquée.
9. Couverture liée aux codes postaux actifs ; trois états (available / partial / unavailable) ; noms techniques jamais affichés.
10. Introduction, interprétation des données, FAQ et conclusion propres à chaque localité — le remplacement du nom de ville n'est pas acceptable.
11. Ne jamais inventer un prix local, un professionnel, un bureau, une aide, une couverture ou une statistique.
12. Canonical auto-référent + breadcrumbs national → département → ville ; ne publier / ne mettre en sitemap que des pages complètes, HTTP 200, indexables.
13. Pas de LocalBusiness, Review ni AggregateRating.
14. Ne pas redessiner les pages : les 4 modèles de la maquette sont la source visuelle de référence.

## Pages → URLs de production
| Fichier | URL cible | Statut SEO |
|---|---|---|
| Accueil.dc.html | / | index |
| Monte-escalier.dc.html | /monte-escalier/ | index |
| Douche-senior.dc.html | /douche-senior/ | index |
| MaPrimeAdapt.dc.html | /maprimeadapt/ | index |
| Guides.dc.html | /guides/ | index |
| Guide-prix-monte-escalier.dc.html | /guides/prix-monte-escalier/ | index |
| Guide-droit-tournant.dc.html | /guides/monte-escalier-droit-ou-tournant/ | index |
| Guide-aides-monte-escalier.dc.html | /guides/aides-monte-escalier/ | index |
| Guide-monte-escalier-exterieur.dc.html | /guides/monte-escalier-exterieur/ | index |
| Guide-occasion-location.dc.html | /guides/monte-escalier-occasion-location/ | index |
| Guide-delai-installation.dc.html | /guides/delai-installation-monte-escalier/ | index |
| Guide-prix-douche-senior.dc.html | /guides/prix-douche-senior/ | index |
| Guide-remplacer-baignoire-douche.dc.html | /guides/remplacer-baignoire-par-douche/ | index |
| Guide-douche-senior-pmr.dc.html | /guides/douche-senior-ou-pmr/ | index |
| Guide-baignoire-porte-douche.dc.html | /guides/baignoire-a-porte-ou-douche/ | index |
| Guide-equipements-douche.dc.html | /guides/equipements-securiser-douche/ | index |
| Guide-prix-salle-de-bain.dc.html | /guides/prix-salle-de-bain-adaptee/ | index |
| Guide-plafonds-ressources.dc.html | /guides/plafonds-ressources/ | index |
| Guide-apa-pch.dc.html | /guides/apa-pch/ | index |
| Formulaire.dc.html | /projet/ | noindex |
| Actualites.dc.html | /actualites/ | noindex, follow tant que les fixtures de démo ne sont pas remplacées |
| Actualite-modele.dc.html | /actualites/[slug]/ | modèle |
| A-propos.dc.html | /a-propos/ | index |
| Methodologie.dc.html | /methodologie-editoriale/ | index |
| Contact.dc.html | /contact/ | index |
| Mentions-legales.dc.html | /mentions-legales/ | index |
| Conditions-generales.dc.html | /conditions-generales/ | index |
| Politique-confidentialite.dc.html | /politique-de-confidentialite/ | index |
| Politique-cookies.dc.html | /politique-cookies/ | index |
| Banniere-cookies.dc.html | composant global (bannière consentement) | — |
| Modele-article.dc.html | modèle de guide (réutilisable) | noindex |
| Modele-departement.dc.html | /monte-escalier/[departement]/ (modèle, ex. Nord) | noindex |
| Modele-ville.dc.html | /monte-escalier/[departement]/[ville]/ (modèle, ex. Lille) | noindex |
| Modele-departement-douche.dc.html | /douche-senior/[departement]/ (modèle, ex. Gironde) | noindex |
| Modele-ville-douche.dc.html | /douche-senior/[departement]/[ville]/ (modèle, ex. Bordeaux) | noindex |

## Composants partagés
Header.dc.html (navigation + menu mobile + barre CTA fixe), Footer.dc.html, BlocProjet.dc.html (bloc projet + code postal), MiniFormulaire.dc.html (questionnaire multi-étapes des pages piliers).

## Changelog 29/07 (soir) — à implémenter côté code

### Formulaire intelligent (BlocProjet → MiniFormulaire)
- **BlocProjet** a 2 nouveaux props : `cp-exemple` (placeholder du code postal, ex. 33000 à Bordeaux, 59000 à Lille — à alimenter dynamiquement par localité) et `ville` (nom transmis au formulaire). À la soumission il redirige vers `/projet/?projet=…&cp=…&ville=…`.
- **MiniFormulaire** lit `projet`, `cp`, `ville` (+ réponses `type/niveaux/installation/souhait/delai/proprio`) dans l'URL :
  - questions déjà répondues → sautées ;
  - `cp` à 5 chiffres → **l'étape code postal est sautée** (ne jamais redemander une info déjà donnée) ;
  - `ville` → titre d'en-tête dynamique « Étudiez votre projet à {Ville} en 2 minutes » (générique sinon) ;
  - étape « Vos coordonnées » : encart « **Ce que vous nous avez indiqué :** » — récapitulatif en lignes étiquetées (Votre projet / Installation actuelle / Transformation souhaitée / Délai envisagé / Propriétaire / Secteur avec lien « modifier » qui rouvre l'étape code postal) + phrase d'aide vers le bouton « ‹ Précédent ». Public senior : pas de pastilles sans contexte, libellés complets, texte ≥ 17px.

### Pages locales (4 modèles)
- Cartes projet cliquables (9 cartes : transformations douche, types de monte-escalier, configurations ville) → `/projet/?projet=…` avec lien « Décrire ce projet › » et survol vert.
- Bandeaux « Modèle réutilisable… » retirés (notes internes, pas du contenu public). Le bandeau `brouillon` conditionnel reste.
- Couverture : 3 états (`disponible` / `partielle` / `non-confirmee`), copys publiques sans noms techniques.
- Bloc budget haut de page sur les pages ville (H1 à intention tarifaire) ; « Périmètre de ce guide » ; sources enrichies ; FAQ dynamiques 6–10 ; villes voisines masquées si liste vide.

## Moteur de pages locales — implémenté

Le moteur programmatique se trouve dans `local-pages/` :
- `data.mjs` orchestre 202 départements et 1 002 pages communales publiées pour les verticales monte-escalier et douche senior ;
- `schema.mjs` applique le modèle commun, les champs propres à chaque service, les règles de publication, les codes postaux de couverture et le contrôle de similarité ;
- `render.mjs` fournit les quatre templates réutilisables en conservant le design validé et en réutilisant Header, Footer et BlocProjet.

Le build génère les deux hubs indexables, 202 départements et 1 002 pages communales sans placeholder public. Toutes ces pages sont en `published`, `index` et `included`. Les maquettes `Modele-*.dc.html` restent les références visuelles dans le dépôt mais ne sont plus copiées dans le site public.

### Déploiement départemental préparé le 12/08/2026
- Hub `/monte-escalier/departements/` inspiré de la hiérarchie de Cadastre France : page nationale → annuaire régional → pages départementales.
- Couverture d’intention inspirée de Bonjour Senior sans reprise de texte : prix, types d’appareil, aides, critères techniques, FAQ et formulaire projet.
- Les 101 départements disposent de données officielles avec millésime explicite, d’un commentaire habitat original, de ressources locales, de FAQ propres et d’un maillage entre pages publiées.
- Hero départemental avec exemple de code postal local et réponse tarifaire immédiate.
- Quatre familles : droit, tournant, extérieur et assis-debout, avec fourchettes nationales 2026 structurées et parcours projet fonctionnel.
- Données INSEE RP 2023 et sources officielles structurées ; Mayotte conserve des millésimes 2017/2026 explicitement documentés.
- FAQ, conclusion et facteurs de coût locaux validés par le schéma et le contrôle de similarité.
- Couverture nationale de la verticale monte-escalier séparée des états de routing `active`, `capped`, `paused` et `technical_error`.
- Les hubs, les départements et les liens de proximité ne peuvent afficher que des pages publiées, indexables et présentes dans les sitemaps.

Sitemaps locaux préparés :
- `/sitemaps/monte-escalier-departements.xml`
- `/sitemaps/monte-escalier-villes.xml`
- `/sitemaps/douche-senior-departements.xml`
- `/sitemaps/douche-senior-villes.xml`

## Règles produit non négociables
1. Mise en relation UN-À-UN : jamais de promesse « comparez plusieurs devis »
2. Modules de confiance (avis, presse, statistiques, conseillers) masqués tant que les données réelles ne sont pas fournies — ne jamais inventer de notes, chiffres ou témoignages
3. Prix = fourchettes indicatives avec badge « à vérifier » ; jamais présentés comme devis
4. Aides : toujours renvoyer aux sources officielles ; Go Senior ne décide pas de l'éligibilité ; ne pas commencer les travaux avant accord
5. Consentement formulaires : case jamais pré-cochée ; texte validé juridiquement
6. Pages locales : publier uniquement avec données INSEE réelles, sources locales vérifiées et couverture professionnelle effective ; les ressources d’aide restent requises pour le monte-escalier mais ne sont pas mises en avant sur la douche — pas de pages minces générées en masse
7. Téléphone : retiré du site en attente de validation — réintégrer aux emplacements prévus (header, footer, encadrés latéraux) une fois validé
8. Direction éditoriale (Jérôme Rappel) : mentions légales uniquement, pas de mise en avant

## SEO / technique
- Un seul H1 par page, breadcrumbs, canonical auto-référent, sitemap
- Guides : Article structured data ; PAS de Review/AggregateRating
- Images : noms descriptifs + alt déjà en place ; ajouter width/height + loading="lazy" (hors héros), WebP/AVIF au déploiement
- Bannière cookies : blocage des traceurs avant consentement, clé gs-consent versionnée, réouverture via « Vos choix en matière de confidentialité »
- Accessibilité AA : corps 18px min, cibles 44px min, focus visible, details natifs

## Contrôles de mise en ligne
- Hébergeur et identité de l’éditeur : renseignés dans les mentions légales.
- Téléphone commercial : volontairement absent tant qu’il n’est pas validé.
- Actualités : route conservée en `noindex, follow` et exclue du sitemap tant que les fixtures ne sont pas remplacées par de vraies publications.
- Services tiers : Cloudflare, IONOS, Google Analytics et Microsoft Clarity sont documentés. Revalider les politiques avant d’activer tout nouveau prestataire ou traceur.
- Avant production : exécuter `npm run deploy:preview`, contrôler les pages représentatives et tester une vraie demande LeadByte, puis lancer `npm run deploy:production`.

Cloudflare : le build protège automatiquement les adresses visibles avec `email_off`, afin que `support@go-senior.fr` reste lisible même lorsque le script « Email Address Obfuscation » est bloqué. Le contrôle de build refuse toute nouvelle adresse visible non protégée.
