# Améliorations apportées

Récapitulatif, par thème, de ce qui a été changé depuis le projet d'origine. Les identifiants (A-01…) renvoient aux constats de [AUDIT.md](AUDIT.md), qui détaille les vérifications. Tout est sur la branche `main`.

## Sécurité

| Changement | Vérification |
|---|---|
| Lucide (1.55.0) et Leaflet (1.9.4) en version fixée avec contrôle d'intégrité SRI, au lieu de `@latest` (A-01) | `npm test` ; chargement sans erreur dans le navigateur |
| Content Security Policy sur chaque page, politique de référent, `rel="noopener"` sur le lien externe, favicon (A-22) | Un script étranger et un script inline sont bloqués par Chromium ; `npm test` |
| Échappement HTML des contenus injectés, `textContent` quand c'est possible (A-06) | Parcours des pages sans régression |
| `SECURITY.md` et signalement privé de vulnérabilités activé sur GitHub | Page « Security » du dépôt |

## Fiabilité

| Changement | Vérification |
|---|---|
| **Fond de carte réparé** : CARTO exige désormais une clé API (tuiles « API KEY REQUIRED »), passage aux tuiles OpenStreetMap avec attribution (A-13) | Captures avant/après ; carte lisible en ligne |
| La navigation reste utilisable si une CDN est injoignable (A-04) | Lecture du code ; non testé hors-ligne |
| Caméra : flux libéré si on ferme pendant la demande d'accès, message d'erreur clair (A-05) | Lecture du code ; non testé sur un vrai appareil |

## Accessibilité

| Changement | Vérification |
|---|---|
| Zoom autorisé, contrastes AA (gris, badge, navigation, statuts, icônes), rôles `tablist` / `dialog`, ordre des titres, zone `main` (A-02, A-12, A-23) | Audit axe-core : 0 violation sur 17 états (5 pages et leurs fenêtres ouvertes) |
| Clavier : Échap ferme les fenêtres, focus visible, rôles et états ARIA (A-03) | Script Chromium (`aria-pressed`, `aria-selected`, `tabIndex`) |
| **Lecteurs d'écran et clavier** (A-24) : fenêtres fermées masquées, focus géré (entrée, piège, retour à l'ouvreur), repères de la carte ouverts à Entrée/Espace (Entrée ne marchait pas), noms de boutons explicites, avatars décoratifs, ordre de lecture, focus visible sur la recherche | Arbre d'accessibilité et parcours clavier (Chromium). **Pas de test avec synthèse vocale** |

## Fonctionnalités et affichage

| Changement | Vérification |
|---|---|
| Fonctionnalités annoncées mais absentes, maintenant réelles en local : « Utiliser » une offre (points déduits, bon fictif, historique « Mes bons »), suggestion de lieu, vraie capture photo (+10 points) (A-10, A-16) | Test de bout en bout Chromium (caméra simulée) |
| **Tous les boutons font quelque chose** (A-19) : menu de la landing page, filtres avancés, favoris (cœur, onglet du profil, lien direct), géolocalisation, partage et invitation par lien, ajout d'amis persistant, édition du pseudo et de la photo, réglages. Messages non bloquants à la place des `alert()` | Test de bout en bout Chromium |
| Recherche insensible aux accents et à la casse, message « aucun résultat » | « etudiant » trouve les lieux accentués |
| **Application en colonne de la taille d'un mobile** sur PC et tablette ; landing page responsive (deux colonnes sur ordinateur, menu déroulant sur mobile) (A-20) | Mesures de géométrie et captures aux trois tailles |

## Données

| Changement | Vérification |
|---|---|
| Lieu hors zone (Vendée) retiré ; trois structures introuvables ou à l'adresse inexacte retirées (Nantes'Renoue, Les Nantais Solidaires, Coup de Pouce) : **36 lieux** restants (A-07, A-08) | `npm test` (zone nantaise, nombre annoncé sur la landing page) |
| Horaires, sites et contacts complétés par recherche web et pages officielles. Là où aucun horaire n'est publié, la fiche donne le contact officiel ; les horaires douteux portent la mention « à vérifier » (A-08) | Plus aucun lieu « Non précisé » ; 9 structures avec contact seul, 8 horaires à vérifier, 1 lieu sans site |
| Données séparées de la logique dans `data.js` (A-14) | `npm test` |

## Images et droits

| Changement | Vérification |
|---|---|
| Photos de partenaires (20), images de stock ou générées par IA d'origine non documentée (5), avatars générés par IA (3), avatars `pravatar` (6) et photos Unsplash (2) **remplacés** par des illustrations vectorielles locales et des pictogrammes (A-15, A-21) | Plus aucune image distante (test) ; poids total de `assets/` : 170 Ko |
| Fichiers retirés **purgés de l'historique Git** (réécritures successives, `push --force`) | Clone neuf du dépôt distant : aucun résidu |
| Droits de `logo.png` et `Accueil - Map.png` | **À confirmer par l'auteur** ([IMAGES.md](IMAGES.md)) |

## Outillage et documentation

| Changement | Vérification |
|---|---|
| 19 tests d'intégrité sans dépendance (`npm test`) et GitHub Actions à chaque envoi sur `main` ; métadonnées `package.json` (A-11) | CI verte |
| `.gitignore`, suppression des `.DS_Store` (A-18) | Dépôt sans fichier parasite |
| Licence MIT | `LICENSE`, reconnue par GitHub |
| README (captures réelles, installation, limites), énoncé d'origine conservé dans `docs/CAHIER-DES-CHARGES.md`, [IMAGES.md](IMAGES.md), [SECURITY.md](../SECURITY.md) | Commandes et chiffres vérifiés |

## Ce qui reste

Voir la section 5 de [AUDIT.md](AUDIT.md) : horaires à confirmer auprès des structures, test avec un vrai lecteur d'écran, caméra et géolocalisation sur un vrai téléphone, droits du logo et de la maquette, persistance côté serveur (hors périmètre d'un prototype statique).
