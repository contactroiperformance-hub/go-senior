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
npm run deploy:preview
```

Cette commande relance le build et tous les contrôles avant de créer une URL de
prévisualisation. Après validation visuelle et test du formulaire sur cette URL,
publier sur la branche de production :

```sh
npm run deploy:production
```

Le déploiement en ligne de commande nécessite une session Wrangler authentifiée
ou une variable d’environnement `CLOUDFLARE_API_TOKEN` disposant des droits
Cloudflare Pages. Ne jamais enregistrer ce jeton dans le dépôt.

## Source de référence

Les pages, composants, textes et interactions sont générés depuis les sources du
dépôt. Le build ajoute les URL de production, les métadonnées techniques et les
pages départementales validées nécessaires au déploiement.
