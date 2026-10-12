# Audit du projet Plan Malin

Audit réalisé sur le dépôt `LoanPleurmeauBonnin/plan-malin` (branche par défaut, dernier commit `c6cb3f5`). Les modifications sont **non commitées** dans le répertoire de travail.

## 1. Périmètre et méthode

- **Périmètre** : les 5 pages HTML, `script.js`, `style.css`, les images et le README d'origine. Pas de backend, pas de base de données, pas de CI, pas de `package.json` à l'origine.
- **Méthode** : lecture complète du code, vérification des ressources référencées, exécution locale (serveur HTTP statique + navigateur) des parcours principaux, tests automatisés ajoutés.
- **Hors périmètre** : aucun test intrusif ; pas d'audit de dépendances par scanner (aucune dépendance npm) ; pas de test sur appareil mobile réel (caméra) ni sur Safari/iOS ; pas de mesure Lighthouse.

## 2. État initial

**Points forts** : projet cohérent et fonctionnel, identité visuelle soignée, mobile first, code commenté, aucun secret dans le dépôt, aucune entrée utilisateur envoyée à un serveur, toutes les images référencées présentes.

**Faiblesses** : aucun test, bibliothèques CDN en `@latest` sans contrôle d'intégrité, accessibilité clavier absente, images de 13 Mo, un script de 658 lignes mélangeant données et logique, README qui reprenait le cahier des charges et non le projet (il précisait même qu'aucun code n'était attendu).

## 3. Constats

Statut : **C** confirmé, **S** suspecté. Effort : F / M / E (faible, moyen, élevé). Le détail des corrections est dans [IMPROVEMENTS.md](IMPROVEMENTS.md).

| ID | Cat. | Prio | Localisation | Constat | Conséquence | Statut | Effort | Suite |
|---|---|---|---|---|---|---|---|---|
| A-01 | Sécurité | P1 | `*.html` : `unpkg.com/lucide@latest` | Script tiers en version flottante, sans SRI | Une version publiée cassée ou compromise s'exécute chez tous les utilisateurs (supply chain) | C | F | Corrigé : versions fixées + SRI |
| A-02 | Accessibilité | P1 | `<meta viewport>` des 5 pages | `user-scalable=no`, `maximum-scale=1.0` | Zoom impossible pour les malvoyants (WCAG 1.4.4) | C | F | Corrigé |
| A-03 | Accessibilité | P1 | `script.js` (nav, filtres, onglets, amis) ; HTML | Éléments cliquables en `<div>` : ni focus clavier ni rôle ; pas de nom accessible pour caméra/recherche ; fiches sans `role="dialog"` ; aucun style de focus | Parcours inutilisables au clavier et au lecteur d'écran | C | M | Corrigé en grande partie (reste A-12) |
| A-04 | Fiabilité | P1 | `script.js`, démarrage | Si une CDN est injoignable, `lucide` / `L` sont indéfinis : `lucide.createIcons()` lève une erreur et interrompt tout le script, navigation comprise | Hors-ligne, la navigation entre pages cesse de fonctionner | C (lecture du code) | F | Corrigé |
| A-05 | Fiabilité | P2 | `script.js`, `startCamera` | Si on ferme la caméra pendant la demande d'accès, le flux obtenu ensuite n'est jamais arrêté ; message d'erreur « changer de caméra » trompeur | Caméra qui reste allumée, message incompréhensible | C (lecture du code) | F | Corrigé |
| A-06 | Qualité | P2 | `script.js` (HTML par gabarits) | Données injectées via `innerHTML` / `insertAdjacentHTML` sans échappement | **Pas exploitable aujourd'hui** (données statiques, aucune saisie réinjectée). Risque XSS si les données viennent un jour d'utilisateurs (crowdsourcing prévu) | S | F | Corrigé par précaution |
| A-07 | Données | P2 | `data.js` : « La Ressourcerie Culturelle » | Adresse à Montaigu-Vendée (85), à environ 50 km, sur une carte de Nantes | Marqueur hors zone | C | F | Corrigé : lieu retiré (39 lieux restants), exception supprimée des tests |
| A-08 | Données | P2 | `data.js` | StudHelp et les distributeurs « Nouvelles Règles » partageaient les coordonnées du centre-ville (47.2184, -1.5536) sans lieu fixe ; Frip'in Shop Rezé : adresse « Rezé » seule ; 23 lieux sur 40 sans horaires ; 26 sans site | Marqueur trompeur, fiches peu utiles | C | M | Partiellement corrigé : recherche web sur 21 lieux (horaires, sites, adresse de Ping 44200, description « position indicative » pour les services sans lieu fixe). Reste 15 lieux sans horaires, 5 sans site, 6 horaires « à vérifier ». Non résolu : « Nantes'Renoue » introuvable dans les sources consultées ; CampuSolidaire : l'annuaire de la Métropole indique la rue Docteur Yvonne Pouzin-Malègue (44100) et non « 5 Avenue Pajot » ; Linkee : distribution signalée à La Cocotte Solidaire (Île de Versailles) et non rue Saint-Léonard ; Frip'in Shop Rezé : adresse non trouvée. Coordonnées inchangées faute de numéro de rue fiable |
| A-09 | Performance | P2 | `assets/img/` | 13 Mo d'images dont 4 > 1,5 Mo (jusqu'à 4412 px) affichées en vignettes | Chargement lent en mobilité | C | F | Corrigé : 11,6 Mo → 1,5 Mo sur 16 fichiers (mesure sur disque) |
| A-10 | Fonctionnel | P2 | `script.js` (caméra), `recompenses.html`, `app.html` | Capture de photo simulée ; la modale d'aide promettait un bouton « Utiliser » et un bon absents ; crowdsourcing du cahier des charges absent | Écart entre documentation et fonctionnement réel | C | E | Corrigé en démo locale : vraie capture (canvas → JPEG 480 px, `localStorage`), « Utiliser » avec déduction de points et bon fictif, formulaire de suggestion enregistré localement. Reste hors périmètre : toute persistance serveur, modération, preuve de visite |
| A-11 | Tests | P2 | dépôt | Aucun test ni script | Régressions non détectées | C | M | Corrigé : 10 tests d'intégrité |
| A-12 | Accessibilité | P2 | `style.css` | `--text-grey` `#9ca3af` sur blanc : contraste ≈ 2,5:1 (< 4,5:1) ; focus supprimé sur la recherche | Textes secondaires peu lisibles | C (calcul) | F | Corrigé pour le gris (`#6b7280`, ≈ 4,8:1). Reste à auditer : autres contrastes, piège de focus dans les feuilles modales |
| A-13 | Fiabilité | **P0** | `script.js`, `L.tileLayer(...)` | Le serveur de tuiles CARTO (`basemaps.cartocdn.com/light_all`) renvoie désormais, pour tout lieu, une même tuile de 2 049 octets marquée « API KEY REQUIRED » : constaté sur capture et par téléchargement direct d'une tuile centrée sur Nantes. Attribution CARTO en outre absente | La carte, cœur de l'application, s'affichait sans fond de carte | C | F | Corrigé : tuiles OpenStreetMap (tuile de 34 Ko valide) avec attribution. Les tuiles publiques OSM sont réservées à un usage léger : pour une vraie mise en ligne, prendre un fournisseur dédié |
| A-14 | Maintenabilité | P3 | `script.js`, `style.css` | 658 lignes mêlant données et logique ; CSS de 1 100 lignes | Ajout de lieux plus risqué | C | M | Partiel : données extraites dans `data.js`. Autre découpage jugé disproportionné |
| A-15 | Confidentialité | P3 | `script.js`, `profil.html` | Avatars `i.pravatar.cc` et photos `images.unsplash.com` chargés depuis des tiers ; polices Google | Requêtes tierces, dépendance réseau | C | F | Conservé à la demande de l'auteur (démo) ; documenté dans le README |
| A-16 | UX | P3 | `index.html` | « Découvrir en vidéo » était un `div` sans action ; « #1 » et « boutiques partenaires » non étayés | Élément non fonctionnel, promesses invérifiables | C | F | Bouton vidéo retiré. Formulations marketing conservées (choix éditorial), documentées |
| A-17 | Qualité | P3 | `script.js`, section 10 | Statistiques d'ami aléatoires à chaque ouverture ; albums choisis par noms codés en dur | Fiche différente à chaque ouverture (démo) | C | F | Non corrigé, documenté |
| A-18 | Hygiène | P3 | dépôt | `.DS_Store` versionnés, pas de `.gitignore` | Bruit dans le dépôt | C | F | Corrigé |

**Sécurité** : aucun secret, jeton ni fichier sensible trouvé. Le dépôt ne contient ni authentification, ni formulaire envoyé, ni API : les risques CSRF, SSRF, injection SQL, upload et CORS **ne s'appliquent pas**. Le lien « Y aller » ne transmet que les coordonnées publiques d'un lieu. L'absence de vulnérabilité détectée ne prouve pas que l'application est sûre en cas d'évolution vers un backend.

## 4. Vérifications effectuées

| Commande / action | Résultat |
|---|---|
| `node --check script.js` | OK |
| `npm test` | 10 tests passés, 0 échec (deux erreurs du test lui-même corrigées en cours de route : glob de dossier refusé par Node 24, faux positif sur les gabarits JS) |
| Serveur `python -m http.server`, navigateur intégré, `app.html` | 40 marqueurs (avant retrait d'un lieu, 39 ensuite) ; recherche « etudiant » : 9 résultats ; « zzzz » : 0 marqueur ; filtre Nourriture : 7 marqueurs ; fiche StudHelp ouverte puis fermée par Échap ; Leaflet et Lucide acceptés avec SRI ; aucune erreur console |
| Test de bout en bout Chromium (caméra simulée, `localhost`) : suggestion enregistrée (1), photo JPEG capturée et enregistrée, points 120 → 130 ; « Utiliser » (La Canaille, 20 pts) : confirmation, bon généré, points 130 → 110, jauge et profil à jour, album du profil avec la photo ; aucune erreur console | Réussi |
| Chromium headless (Playwright), viewport mobile 390 × 844, 7 pages / états | Captures dans `docs/images/` ; aucune erreur console ; fond de carte OSM visible avec les marqueurs ; vignettes de récompenses compressées bien rendues (page relue). Première capture : fond « API KEY REQUIRED », origine de A-13 |
| Même méthode sur `amis.html`, `recompenses.html`, `profil.html`, `index.html` | Icônes rendues ; 6 suggestions, fiche ami (3 photos) ; 19 offres, 3 pour « Bar », 0 image cassée, jauge à 120 pts ; onglet Favoris et `aria-selected` OK |

**Non vérifié** : la caméra sur un vrai appareil (testée uniquement avec la caméra simulée de Chromium) ; Safari/iOS ; le fonctionnement hors-ligne (A-04, lecture du code seulement) ; le rendu visuel après compression des images ; la navigation clavier de bout en bout et au lecteur d'écran .

## 5. Recommandations restantes

1. Confirmer sur le terrain ou auprès des structures les horaires « à vérifier », compléter les 15 lieux sans horaires et vérifier les adresses signalées en A-08.
2. Si le projet évolue : un backend pour les suggestions, les points, les bons et les amis (aujourd'hui tout est local à l'appareil).
3. Éventuellement remplacer avatars et photos tierces par des images locales (A-15).
4. Poursuivre l'accessibilité : piège de focus dans les feuilles modales, contrastes restants, test au lecteur d'écran (A-12).
5. Choisir une licence.
6. Si un backend est ajouté : revoir l'échappement, l'authentification, CORS et la validation côté serveur.
