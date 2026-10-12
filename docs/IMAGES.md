# Images : origine et droits

Inventaire initial des 32 fichiers de `assets/img/` (12 octobre 2026) ; **les 20 photos du groupe D ont ensuite été retirées** (voir la section D). Établi à partir de leur contenu visuel, de leurs métadonnées (aucune information de copyright n'est présente dans les fichiers) et de leur usage dans le code. **Les droits réels ne peuvent pas être prouvés depuis le dépôt** : le statut « à confirmer » signifie qu'aucune licence ni autorisation n'est documentée. La licence MIT du dépôt ne couvre que le code.

## A. Créations du projet (droits à confirmer par l'auteur)

| Fichier | Usage | Remarque |
|---|---|---|
| `logo.png` | Logo PoM | Création présumée de l'équipe du projet |
| `Accueil - Map.png` | Téléphone de la landing page | Maquette de conception, création présumée de l'équipe |

## B. Visages générés par IA : remplacés

| Fichiers retirés | Usage | Remarque |
|---|---|---|
| `perso1.jpg`, `perso2.jpg`, `perso3.jpg` | Avatars des trois amis de la liste | Filigrane visible « this-person-does-not-exist.com » : visages synthétiques dont les conditions d'utilisation n'avaient pas pu être vérifiées. **Remplacés** par `avatar-lucas.svg`, `avatar-ines.svg` et `avatar-theo.svg` (initiales sur dégradé de couleur, créées pour le projet). |

## C. Cinq images d'origine non documentée : toutes remplacées (analyse du 12 octobre 2026)

Aucune ne contenait de métadonnée de copyright ou de provenance (pas d'EXIF, de XMP ni de marqueur C2PA). L'analyse reposait sur leur contenu visuel, **sans preuve**. Les cinq ont été **remplacées par des illustrations vectorielles** créées pour le projet, sans image tierce.

| Fichier retiré | Constat | Remplacé par |
|---|---|---|
| `trouvaille1.jpg` | Vraie photographie d'un ticket de caisse réel (téléphone et SIRET lisibles) | `trouvaille-ticket.svg` |
| `tee_shirt_noir.jpg` | Photo produit de catalogue sur fond blanc | `trouvaille-vetement.svg` |
| `profil_photo.avif` | Photo de banque d'images | `avatar-defaut.svg` |
| `ticket_tenu.jpg` | Générée par IA (icône ✦ typique de Google Gemini, texte incohérent) | `trouvaille-sac.svg` |
| `trouvaille2.jpg` | Générée par IA (texte illisible, décor de synthèse) | `trouvaille-livre.svg` |

Un test vérifie que les fichiers retirés ne reviennent pas.

**Historique Git purgé** : les cinq fichiers retirés (`trouvaille1.jpg`, `tee_shirt_noir.jpg`, `profil_photo.avif`, `ticket_tenu.jpg`, `trouvaille2.jpg`) ont été effacés de tout l'historique (réécritures successives + `push --force`, 12 octobre 2026), avec les mêmes limites que pour les photos de partenaires (section D). Aucune sauvegarde locale n'a été conservée.

## D. Photos de lieux et de partenaires : RETIRÉES

20 photos (`accueil-john-doe-escape.jpg`, `bowling_center.jpg`, `cinema_pathe.png`, `cote-plage.webp`, `espit_chupitos_nantes.webp`, `feeling_good_bakery.jpg`, `hbc_nantes.png`, `la_canaille.webp`, `makadam_fitness.jpg`, `moda.webp`, `musee_illusion.jpg`, `myoko.jpg`, `new_factory.png`, `planet_park_nantes.jpg`, `roadside.jpg`, `stade_de_la_beaujoire.jpg`, `stereolux.webp`, `theatre_place_graslin.jpg`, `warehouse.webp`, `stade.jpg`) provenaient vraisemblablement de sites tiers, sans autorisation ni source documentée (logo en surimpression, miniatures de recherche d'images, possible capture de vue cartographique). Elles ont été **supprimées du projet** :
- Page Récompenses : un pictogramme sur dégradé de couleur par catégorie (bar, boîte de nuit, restaurant, loisirs, culture, sport) remplace chaque photo ; le champ `img` a disparu de `data.js`.
- Albums des amis : les photos de lieux ont été retirées de leurs albums.
- Un test vérifie qu'aucune offre ne référence de photo.

**Historique Git purgé** : ces 20 photos, ainsi que `pull_1977.jpg`, `t_shirt2.jpg` et les anciennes versions de deux captures d'écran qui en montraient des vignettes, ont été effacées de tout l'historique du dépôt (réécriture + `push --force`, 12 octobre 2026). Limites :
- Les identifiants de tous les commits ont changé ; les clones existants doivent être refaits.
- GitHub peut conserver quelques jours des copies en cache ou des objets accessibles par leur ancien identifiant de commit ; un ayant droit exigeant leur suppression immédiate peut demander un nettoyage au support GitHub.
- Une copie faite par un tiers pendant la période où le dépôt était public (quelques heures) ne peut pas être rappelée.
- Une sauvegarde de l'ancien historique existe en local uniquement (hors dépôt), à supprimer si tu ne veux plus aucune copie.

## Bilan : ce qui reste dans `assets/img/`

| Fichier | Statut |
|---|---|
| `logo.png`, `Accueil - Map.png` | Créations présumées de l'équipe : **droits à confirmer par l'auteur** |
| `avatar-*.svg`, `trouvaille-*.svg` (9 fichiers) | Illustrations vectorielles créées pour le projet, sans image tierce |

Les trois avatars `perso*.jpg` ont été retirés du projet et **purgés de l'historique Git** (troisième réécriture + `push --force`, 12 octobre 2026), ainsi que les anciennes versions de la capture `amis.png` qui les montraient. Aucune sauvegarde locale n'a été conservée.

## E. Images distantes (non versionnées)

| Source | Usage | Conditions |
|---|---|---|
| `images.unsplash.com` | Deux photos de l'album du profil | Licence Unsplash : utilisation libre, attribution non obligatoire |
| `i.pravatar.cc` | Avatars des 6 suggestions d'amis | Service d'avatars de démonstration (photos de personnes réelles) ; ses conditions d'utilisation n'ont pas été vérifiées, à remplacer par des avatars locaux pour un usage durable |
| OpenStreetMap | Fond de carte | © OpenStreetMap contributors (ODbL), attribution déjà affichée sur la carte |

## Risque et options

Le dépôt et le site sont **publics** : un ayant droit pourrait demander le retrait des images restantes du groupe C (origine inconnue), et d'éventuelles copies conservées par des tiers. Pour un projet de cours à but non commercial le risque est limité, mais il existe. Pour les images restantes (groupes A, B, C) : documenter la source et la licence de chacune, ou la remplacer.
