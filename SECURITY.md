# Politique de sécurité

Plan Malin est un **projet de cours** : un prototype front-end statique, sans serveur, sans compte et sans base de données. Cette politique est volontairement simple et sans engagement de niveau de service.

## Versions concernées

Seule la dernière version de la branche `main`, celle publiée sur <https://loanpleurmeaubonnin.github.io/plan-malin/>, est maintenue. Il n'y a pas de versions antérieures supportées.

## Signaler une vulnérabilité

Merci de **ne pas ouvrir d'issue publique** pour un problème de sécurité.

1. Va sur l'onglet [**Security** du dépôt](https://github.com/LoanPleurmeauBonnin/plan-malin/security/advisories/new) et choisis « Report a vulnerability » (signalement privé).
2. Décris le problème : page concernée, étapes pour le reproduire, impact estimé, navigateur utilisé. Évite d'inclure des données personnelles réelles.

Il s'agit d'un projet étudiant maintenu par une personne : les délais sont indicatifs. L'objectif est d'accuser réception sous quelques jours et de corriger ou répondre sous quelques semaines. Il n'y a pas de programme de récompense.

## Périmètre

**Dans le périmètre** : le code du dépôt (HTML, CSS, JavaScript), sa configuration de sécurité (politique CSP des pages, dépendances chargées depuis des CDN), la gestion des données stockées dans le navigateur.

**Hors périmètre** :
- les services tiers : GitHub Pages, unpkg, OpenStreetMap, Google Fonts ;
- les attaques par déni de service et les tests intrusifs sur l'hébergement ;
- les données de démonstration (amis, offres, points) : elles sont fictives ;
- les informations des lieux (horaires, adresses) : une erreur de contenu n'est pas une vulnérabilité, mais tu peux la signaler dans une issue publique.

## Ce que fait (et ne fait pas) l'application

- **Aucune donnée n'est envoyée à un serveur.** Points, photos, favoris, amis, bons, suggestions et profil sont enregistrés dans le `localStorage` du navigateur, **sans chiffrement** : toute personne ayant accès à ton appareil et à ton navigateur peut les lire. Ne saisis pas de données sensibles.
- **Pas d'authentification.** Il n'y a ni compte ni mot de passe ; les « amis » et les « bons » sont des démonstrations sans valeur réelle.
- **Caméra et position** : demandées uniquement quand tu utilises les boutons concernés, utilisées localement, jamais transmises. Les photos sont réduites et gardées dans le navigateur.
- **Requêtes vers des tiers** : le navigateur charge les bibliothèques (unpkg), la police (Google Fonts) et le fond de carte (OpenStreetMap) ; toutes les images de l'interface sont locales. Ces services voient donc ton adresse IP, comme pour tout site web.

## Mesures en place

- **Content Security Policy** (balise `<meta>` de chaque page) : scripts limités au site et à unpkg, pas de script inline, `object-src 'none'`, `base-uri` et `form-action` limités au site, connexions réseau réservées au site.
- **Bibliothèques CDN en version fixée avec contrôle d'intégrité (SRI)** : Leaflet 1.9.4 et Lucide 1.55.0.
- **Échappement HTML** des contenus injectés dynamiquement et utilisation de `textContent` quand c'est possible.
- Liens externes ouverts avec `noopener` ; politique de référent `strict-origin-when-cross-origin`.
- Aucun secret ni identifiant dans le dépôt ; historique Git relu et purgé de contenus à droits non documentés.
- Tests automatiques (`npm test`, exécutés par GitHub Actions) qui vérifient notamment la présence de la CSP, du SRI et l'absence de version flottante.

## Limites connues

- La CSP est définie par balise `<meta>` car GitHub Pages ne permet pas d'ajouter des en-têtes HTTP : les directives `frame-ancestors`, `report-uri` et les en-têtes comme `X-Content-Type-Options` ou HSTS (hors celui de GitHub) ne peuvent pas être posés. Le site pourrait donc être affiché dans un cadre (clickjacking) ; l'impact est faible puisqu'il n'y a ni compte ni action sensible.
- `style-src` autorise `'unsafe-inline'` car Leaflet et l'interface utilisent des styles en ligne.
- Pas d'audit de sécurité indépendant : l'absence de vulnérabilité connue ne prouve pas l'absence de vulnérabilité.

Voir aussi [docs/AUDIT.md](docs/AUDIT.md) pour l'audit technique du projet.
