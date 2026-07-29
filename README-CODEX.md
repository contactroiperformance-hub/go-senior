# Go Senior — go-senior.fr · Handoff Codex

Maquette haute-fidélité complète du site. Chaque fichier .dc.html est une page HTML autonome (ouvrable dans un navigateur) ; le design de référence est à recréer en production avec le framework de votre choix.

## Démarrage
- Ouvrir Accueil.dc.html (page d'accueil, navigation fonctionnelle entre toutes les pages)
- Design-system.dc.html : couleurs, typographie, boutons, champs, espacements, notes de décision et consignes d'implémentation (images, accessibilité, SEO)

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
| Actualites.dc.html | /actualites/ | index (fixtures de démo à remplacer) |
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
| Modele-departement.dc.html | /monte-escalier/[departement]/ (modèle) | noindex |
| Modele-ville.dc.html | /monte-escalier/[departement]/[ville]/ (modèle) | noindex |

## Composants partagés
Header.dc.html (navigation + menu mobile + barre CTA fixe), Footer.dc.html, BlocProjet.dc.html (bloc projet + code postal), MiniFormulaire.dc.html (questionnaire multi-étapes des pages piliers).

## Règles produit non négociables
1. Mise en relation UN-À-UN : jamais de promesse « comparez plusieurs devis »
2. Modules de confiance (avis, presse, statistiques, conseillers) masqués tant que les données réelles ne sont pas fournies — ne jamais inventer de notes, chiffres ou témoignages
3. Prix = fourchettes indicatives avec badge « à vérifier » ; jamais présentés comme devis
4. Aides : toujours renvoyer aux sources officielles ; Go Senior ne décide pas de l'éligibilité ; ne pas commencer les travaux avant accord
5. Consentement formulaires : case jamais pré-cochée ; texte validé juridiquement
6. Pages locales : publier uniquement avec données INSEE réelles, aides locales vérifiées et couverture professionnelle effective — pas de pages minces générées en masse
7. Téléphone : retiré du site en attente de validation — réintégrer aux emplacements prévus (header, footer, encadrés latéraux) une fois validé
8. Direction éditoriale (Jérôme Rappel) : mentions légales uniquement, pas de mise en avant

## SEO / technique
- Un seul H1 par page, breadcrumbs, canonical auto-référent, sitemap
- Guides : Article structured data ; PAS de Review/AggregateRating
- Images : noms descriptifs + alt déjà en place ; ajouter width/height + loading="lazy" (hors héros), WebP/AVIF au déploiement
- Bannière cookies : blocage des traceurs avant consentement, clé gs-consent versionnée, réouverture via « Vos choix en matière de confidentialité »
- Accessibilité AA : corps 18px min, cibles 44px min, focus visible, details natifs

## À compléter avant mise en ligne
Numéro de téléphone validé, remplacement des fixtures Actualités par de vraies publications, vérification de la liste des services tiers dans les politiques (Clarity, IONOS, Cloudflare…).
