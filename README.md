# SoluSport

[Site public sur GitHub Pages](https://jfchadeyron.github.io/solusport/)

Site de présentation de SoluSport, projet d’entreprise en cours de création à Varetz pour les associations sportives.

| Offre | Périmètre |
| --- | --- |
| PresenSport | Appel en ligne ou hors ligne, motifs d’absence, statistiques et uniformes |
| GestionSport | Adhésions, cotisations, inscriptions, démarches fédérales, agenda, sondages et relances |
| NotaSport | Juges, notation, programme en direct, affichages, votes et résultats |
| EquipSport | Tenues personnalisées et équipements sportifs sur mesure |

L’accueil compare les quatre offres. Chaque page détaille les usages, présente un exemple et prépare une prise de contact avec la solution présélectionnée. Les anciennes pages de CommSport et de ManageSport redirigent vers GestionSport. L’ancienne page de WearSport redirige vers EquipSport.

## Maintenance

Node.js 22 ou supérieur suffit pour générer et vérifier le site.

```sh
npm run build
npm test
npm run dev
```

Le serveur de prévisualisation écoute sur `http://127.0.0.1:4173/solusport/`. GitHub Pages publie les fichiers statiques à la racine de la branche `main`. Régénérer et versionner le HTML après une modification des sources.

- `src/products.mjs` contient les offres et la correspondance des anciennes adresses.
- `src/home.mjs`, `src/detail.mjs` et `src/layout.mjs` définissent les pages et les éléments communs.
- `src/about.html`, `src/legal.html` et `src/privacy.html` contiennent les pages d’information.
- `assets/style.css` et `assets/site.js` gèrent la présentation, le menu et la préparation d’e-mail.

Le formulaire prépare un brouillon à destination de **contact@solusport.fr**. L’envoi se fait depuis la messagerie du visiteur. À l’immatriculation, actualiser les mentions légales, la présentation du projet, la FAQ et le pied de page avec les références définitives de la société.

Les logos officiels, la palette et les illustrations sont décrits dans la [charte visuelle](IDENTITE-VISUELLE.md).
