# Images : origine et droits

Inventaire des 32 fichiers de `assets/img/`, établi le 12 octobre 2026 à partir de leur contenu visuel, de leurs métadonnées (aucune information de copyright n'est présente dans les fichiers) et de leur usage dans le code. **Les droits réels ne peuvent pas être prouvés depuis le dépôt** : le statut « à confirmer » signifie qu'aucune licence ni autorisation n'est documentée. La licence MIT du dépôt ne couvre que le code.

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
| `pull_1977.jpg`, `t_shirt2.jpg` | **Non utilisées** | Peuvent être supprimées sans effet |

## D. Photos de lieux et de partenaires (risque principal : droits d'auteur de tiers)

Utilisées sur la page Récompenses (et `stade.jpg` dans l'album d'un ami). Aucune autorisation ni mention de source n'est présente dans le dépôt : elles proviennent vraisemblablement des sites des établissements ou de moteurs de recherche, donc protégées par le droit d'auteur du photographe ou de l'établissement.

`accueil-john-doe-escape.jpg`, `bowling_center.jpg`, `cinema_pathe.png`, `cote-plage.webp`, `espit_chupitos_nantes.webp`, `feeling_good_bakery.jpg`, `hbc_nantes.png`, `la_canaille.webp`, `makadam_fitness.jpg`, `moda.webp`, `musee_illusion.jpg`, `myoko.jpg`, `new_factory.png`, `planet_park_nantes.jpg`, `roadside.jpg`, `stade_de_la_beaujoire.jpg`, `stereolux.webp`, `theatre_place_graslin.jpg`, `warehouse.webp`, `stade.jpg`

Points d'attention :
- `moda.webp` porte un logo en surimpression, signe d'une image reprise d'un site tiers.
- `hbc_nantes.png` et `new_factory.png` sont des miniatures de 103 × 76 px, typiques d'une capture de résultats de recherche d'images.
- `warehouse.webp` ressemble à une capture de vue cartographique ; les conditions de Google interdisent la réutilisation de ce type de capture hors de leurs services.
- `stade.jpg` et `theatre_place_graslin.jpg` pourraient venir de Wikimedia Commons : si c'est le cas, la licence Creative Commons exige une attribution (auteur, licence). Non vérifié.

## E. Images distantes (non versionnées)

| Source | Usage | Conditions |
|---|---|---|
| `images.unsplash.com` | Deux photos de l'album du profil | Licence Unsplash : utilisation libre, attribution non obligatoire |
| `i.pravatar.cc` | Avatars des suggestions d'amis | Service d'avatars de démonstration ; vérifier ses conditions pour un usage durable |
| OpenStreetMap | Fond de carte | © OpenStreetMap contributors (ODbL), attribution déjà affichée sur la carte |

## Risque et options

Le dépôt et le site sont **publics** : un ayant droit pourrait demander le retrait des images du groupe D, voire de C. Pour un projet de cours à but non commercial le risque est limité, mais il existe. Par ordre de prudence :

1. **Documenter ou obtenir l'accord** : retrouver la source de chaque image, conserver la licence ou l'autorisation, ajouter les attributions exigées (Creative Commons).
2. **Remplacer** les photos du groupe D par des images dont tu détiens les droits (photos prises sur place) ou libres de droits (Wikimedia Commons, Unsplash, Pexels) avec leur attribution.
3. **Neutraliser** : remplacer les photos de partenaires par des pictogrammes ou dégradés aux couleurs de la catégorie, sans photo tierce.
4. **Supprimer** les deux images inutilisées (groupe C).

Les images retirées du dossier restent présentes dans l'historique Git ; pour les effacer complètement, il faudrait réécrire l'historique, ce qui n'a pas été fait.
