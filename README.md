# SoluSport

[Site public : solusport.com](https://solusport.com/)

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

Le serveur de prévisualisation écoute sur `http://127.0.0.1:4173/` (sans exécuter PHP : le formulaire y bascule sur le brouillon d’e-mail). Régénérer et versionner le HTML après une modification des sources.

- `src/products.mjs` contient les offres et la correspondance des anciennes adresses.
- `src/home.mjs`, `src/detail.mjs` et `src/layout.mjs` définissent les pages et les éléments communs.
- `src/about.html`, `src/legal.html` et `src/privacy.html` contiennent les pages d’information.
- `assets/style.css` et `assets/site.js` gèrent la présentation, le menu et la préparation d’e-mail.

Le formulaire envoie le message à **contact@solusport.com** par `contact.php` (fonction `mail()` de l’hébergement). Si l’envoi échoue, il propose d’ouvrir la messagerie du visiteur ou de copier le message. Téléphone affiché : 07 56 82 21 12. À l’immatriculation, actualiser les mentions légales, la présentation du projet, la FAQ et le pied de page avec les références définitives de la société.

## Hébergement et déploiement

Le site est hébergé chez o2switch (Apache, PHP). Chaque push sur `main` lance `.github/workflows/deploy.yml` : génération, vérification, puis envoi FTPS des fichiers publics. `src/`, `scripts/`, les fichiers Markdown et `package.json` ne sont pas envoyés.

Secrets GitHub à créer (Settings → Secrets and variables → Actions) :

| Secret | Valeur |
| --- | --- |
| `O2SWITCH_FTP_SERVER` | `ftp.jibu4741.odns.fr` |
| `O2SWITCH_FTP_USERNAME` | Compte FTP limité au dossier du site |
| `O2SWITCH_FTP_PASSWORD` | Mot de passe de ce compte |

Les fichiers sont envoyés à la racine du compte FTP, qui doit être limité au dossier de solusport.com. Pour un autre dossier, créer la variable `O2SWITCH_FTP_DIR` (par exemple `./public_html/`). `.htaccess` force HTTPS, redirige `www` et les anciennes pages, et sert `404.html`.

Les logos officiels, la palette et les illustrations sont décrits dans la [charte visuelle](IDENTITE-VISUELLE.md).
