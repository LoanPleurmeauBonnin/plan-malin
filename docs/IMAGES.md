# Images : origine et droits

Inventaire initial des 32 fichiers de `assets/img/` (12 octobre 2026) ; **les 20 photos du groupe D ont ensuite été retirées** (voir la section D). Établi à partir de leur contenu visuel, de leurs métadonnées (aucune information de copyright n'est présente dans les fichiers) et de leur usage dans le code. **Les droits réels ne peuvent pas être prouvés depuis le dépôt** : le statut « à confirmer » signifie qu'aucune licence ni autorisation n'est documentée. La licence MIT du dépôt ne couvre que le code.

## A. Créations du projet (droits à confirmer par l'auteur)

| Fichier | Usage | Remarque |
|---|---|---|
| `logo.png` | Logo PoM | Création présumée de l'équipe du projet |
| `Accueil - Map.png` | Téléphone de la landing page | Maquette de conception, création présumée de l'équipe |

## B. Visages générés par IA

| Fichiers | Usage | Remarque |
|---|---|---|
| `perso1.jpg`, `perso2.jpg`, `perso3.jpg` | Avatars des amis | Filigrane visible « this-person-does-not-exist.com » : visages synthétiques, pas de personnes réelles (pas de droit à l'image). Conditions d'utilisation du site non vérifiées. |

## C. Photos de stock ou générées, origine inconnue (à confirmer)

| Fichier | Usage | Remarque |
|---|---|---|
| `profil_photo.avif` | Photo de profil par défaut | Photo de type banque d'images (étudiant avec cahier), source non documentée |
| `ticket_tenu.jpg` | Album d'un ami | Icône ✦ en bas à droite, typique d'un générateur d'images IA |
| `trouvaille1.jpg` | Album d'un ami | Photo de ticket de caisse, source non documentée |
| `trouvaille2.jpg` | Album d'un ami | Visuel d'aspect généré, source non documentée |
| `tee_shirt_noir.jpg` | Album d'un ami | Photo produit, source non documentée |
| `pull_1977.jpg`, `t_shirt2.jpg` | Non utilisées | **Supprimées** du projet et de l'historique Git |

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

## E. Images distantes (non versionnées)

| Source | Usage | Conditions |
|---|---|---|
| `images.unsplash.com` | Deux photos de l'album du profil | Licence Unsplash : utilisation libre, attribution non obligatoire |
| `i.pravatar.cc` | Avatars des suggestions d'amis | Service d'avatars de démonstration ; vérifier ses conditions pour un usage durable |
| OpenStreetMap | Fond de carte | © OpenStreetMap contributors (ODbL), attribution déjà affichée sur la carte |

## Risque et options

Le dépôt et le site sont **publics** : un ayant droit pourrait demander le retrait des images restantes du groupe C (origine inconnue), et d'éventuelles copies conservées par des tiers. Pour un projet de cours à but non commercial le risque est limité, mais il existe. Pour les images restantes (groupes A, B, C) :
1. **Documenter** la source et la licence de chacune (ou la remplacer par une image dont tu détiens les droits).
