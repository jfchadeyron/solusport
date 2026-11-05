# SoluSport

Site vitrine de lancement de SoluSport, projet d’entreprise destiné aux associations sportives.

**Site : https://jfchadeyron.github.io/solusport/**

## Contenu

- Accueil : positionnement, exploration des cinq solutions, approche, WearSport, étapes, FAQ et contact.
- Pages PresenSport, NotaSport, CommSport, WearSport et ManageSport.
- Présentation du projet, mentions légales adaptées à une entreprise en cours de création et confidentialité.
- Page 404, favicon, métadonnées de partage, sitemap et robots.txt.

PresenSport et NotaSport sont les nouveaux noms des produits PresenCheer et NotaCheer. Les aperçus d’interfaces sont illustratifs et comportent des données fictives. Les photographies sont des créations IA, pas des clients ou des références.

## Modifier le site

Le site publié est statique et ne nécessite aucune dépendance d’exécution. Node.js 22 ou supérieur suffit pour les outils de développement.

```sh
npm run build
npm test
npm run dev
```

Prévisualisation : `http://127.0.0.1:4173/solusport/`.

- `src/products.mjs` : contenu des cinq produits.
- `scripts/build.mjs` : gabarits et contenus des autres pages.
- `assets/style.css` : identité graphique et responsive.
- `assets/site.js` : navigation mobile, onglets accessibles et préparation des e-mails.
- `assets/` : images, favicon et police auto-hébergée.

Après modification des sources, exécuter `npm run build` puis `npm test` et versionner aussi les fichiers HTML générés. GitHub Pages publie la racine de `main`. Le fichier `.nojekyll` évite une transformation par Jekyll.

## Contact

Le formulaire prépare un e-mail destiné à **contact@solusport.fr**. L’utilisateur ouvre ensuite sa messagerie ou copie le message ; aucun envoi automatique, stockage serveur ou prestataire de formulaire n’est ajouté. La disponibilité de la boîte e-mail et la réception réelle sont à gérer par le propriétaire du domaine.

## Identité et illustrations

Voir [IDENTITE-VISUELLE.md](IDENTITE-VISUELLE.md) pour la palette, la typographie, la direction photographique et les prompts des visuels créés avec le générateur d’images intégré.

Le logo source fourni est conservé dans `assets/solusport-original.png` et cadré à l’affichage en CSS, sans retouche du fichier d’origine. Manrope est distribuée sous licence SIL Open Font License, incluse dans `assets/manrope-LICENSE.txt`.

## À l’immatriculation

Mettre à jour le statut dans les mentions légales, le pied de page, la FAQ et la page de présentation. Compléter les références SIREN/RCS, TVA le cas échéant et les coordonnées légales définitives. Réviser les modalités de confidentialité si des comptes, mesures d’audience, formulaires serveur ou services payants sont ajoutés. Aucun paiement ni engagement contractuel n’est proposé dans cette version de lancement.

Références de rédaction : [Service Public — mentions légales](https://entreprendre.service-public.gouv.fr/vosdroits/F37351?lang=fr), [CNIL — conservation des données](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees), [GitHub — confidentialité](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
