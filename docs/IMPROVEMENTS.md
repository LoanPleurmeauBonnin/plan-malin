# Améliorations apportées

Récapitulatif des changements (identifiants et détails dans [AUDIT.md](AUDIT.md)). Aucun commit n'a été fait : les changements sont dans le répertoire de travail.

| Changement | Fichiers | Bénéfice | Vérification |
|---|---|---|---|
| Lucide (1.55.0) et Leaflet (1.9.4) en version fixée avec SRI (A-01) | `*.html` | Plus de code tiers flottant exécuté | `npm test` ; chargement sans erreur dans le navigateur |
| Zoom autorisé (A-02) | `*.html` | Accessibilité (WCAG 1.4.4) | `npm test` |
| Clavier, rôles et états ARIA, noms accessibles, Échap ferme les fenêtres, focus visible (A-03) | `script.js`, `app.html`, `amis.html`, `recompenses.html`, `style.css` | Utilisable au clavier et au lecteur d'écran | Contrôlé par script dans le navigateur (`aria-pressed`, `aria-selected`, `tabIndex`, Échap) ; pas de test au lecteur d'écran |
| Navigation conservée si une CDN est injoignable (A-04) | `script.js` | Navigation utilisable hors-ligne (sans carte ni icônes) | Lecture du code, non testé hors-ligne |
| Caméra : flux libéré si fermeture pendant la demande, message d'erreur clair (A-05) | `script.js` | Caméra bien éteinte, message compréhensible | Lecture du code, non testé |
| Échappement HTML des gabarits, `textContent` pour la catégorie (A-06) | `script.js` | Prêt pour des données non maîtrisées | Parcours des pages sans régression |
| Recherche insensible aux accents et incluant la catégorie ; message « aucun résultat » ; titre et alt des marqueurs | `script.js`, `app.html`, `style.css` | Recherche plus tolérante, meilleur retour utilisateur | « etudiant » : 9 résultats ; « zzzz » : 0 et message |
| Images compressées (≤ 1000 px, qualité 80) et `loading="lazy"` (A-09) | `assets/img/` (16 fichiers), `script.js` | 11,6 Mo → 1,5 Mo sur ces fichiers (mesuré sur disque) | 0 image cassée sur la page Récompenses ; rendu non relu image par image. Les originaux restent dans l'historique Git |
| Gris secondaire plus contrasté (A-12) | `style.css` | Texte plus lisible (≈ 4,8:1) | Calcul du ratio, pas de revue visuelle |
| **Fond de carte réparé** : CARTO exige désormais une clé API, passage aux tuiles OpenStreetMap avec attribution (A-13) ; icône de profil `circle-user` homogène | `script.js`, `profil.html`, `recompenses.html` | La carte s'affiche de nouveau ; cohérence visuelle | Capture avant (« API KEY REQUIRED ») et après (carte lisible) ; téléchargement direct d'une tuile |
| Lieu hors zone retiré ; horaires, sites et adresse complétés après recherche web sur 21 lieux ; mention « à vérifier » quand les sources divergent (A-07, A-08) | `data.js`, `tests/` | Fiches plus utiles et honnêtes | `npm test` ; reste 15 lieux sans horaires, voir AUDIT |
| Démos locales : bon d'offre avec déduction de points, suggestion de lieu, vraie capture photo + points, points partagés avec le profil ; bouton vidéo sans action retiré (A-10, A-16) | `script.js`, `app.html`, `recompenses.html`, `profil.html`, `index.html`, `style.css` | Les fonctionnalités annoncées existent (en local) ; l'aide de la page Récompenses est enfin exacte | Test de bout en bout Chromium avec caméra simulée : voir AUDIT §4 |
| Données extraites dans `data.js` (A-14) | `data.js`, `script.js`, `app.html`, `recompenses.html` | Données modifiables et testables séparément | `npm test`, parcours des pages |
| 10 tests d'intégrité sans dépendance, `package.json` (A-11) | `tests/`, `package.json` | Détecte image manquante, catégorie sans filtre, CDN flottante… | `npm test` : 10/10 |
| `.gitignore`, suppression des `.DS_Store` (A-18) | `.gitignore` | Dépôt plus propre | — |
| Nouveau README avec 5 captures réelles ; énoncé d'origine déplacé | `README.md`, `docs/CAHIER-DES-CHARGES.md`, `docs/images/` | Présentation fidèle du projet réel | Chiffres et commandes du README vérifiés ; captures relues |

Les éléments non corrigés (données restant à vérifier, persistance serveur, ressources tierces conservées, licence) sont listés dans la section 5 de [AUDIT.md](AUDIT.md).
