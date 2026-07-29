# Go Senior

Site éditorial de [go-senior.fr](https://go-senior.fr), consacré à
l’adaptation du logement et à l’autonomie à domicile.

## Développement

Prérequis : Node.js 20 ou plus récent.

```sh
npm install
npm run build
npm run check
npm run dev
```

Le build transforme les maquettes `.dc.html` fournies en pages statiques
accessibles aux URL de production documentées dans `README-CODEX.md`.

## Déploiement

Le contenu de `dist/` est déployé sur le projet Cloudflare Pages `go-senior`.
La branche de production est `main`.

```sh
npm run deploy
```

## Source de référence

Les pages, composants, textes et interactions sont publiés sans modification
visible depuis l’archive `Go Senior competitive analysis.zip`. Le build ajoute
uniquement les URL de production et les métadonnées techniques nécessaires au
déploiement.
