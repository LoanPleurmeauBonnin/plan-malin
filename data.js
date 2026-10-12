// Données statiques de l'application (lieux de la carte et offres de récompenses).
// Chargé avant script.js ; exporté aussi pour les tests Node (npm test).

const lieux = [
    /* =========================
    VÊTEMENTS
    ========================= */
    { name: "Dernière main", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2154, lng: -1.5509, address: "5 Rue de Strasbourg, Nantes", hours: "Mar-Sam : 14h-19h", price: "2 € - 25 €", link: "https://dernieremain.fr/", desc: "Friperie de seconde main proposant des vêtements pour tous à petits prix en centre-ville." },
    { name: "Ding Fring", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2157, lng: -1.5583, address: "10 Rue de l'Arche Sèche, Nantes", hours: "Lun : 14h-19h / Mar-Sam : 10h-19h", price: "2 € - 25 €", link: "https://www.instagram.com/dingfring_friperie/", desc: "Vêtements et accessoires de seconde main à prix accessibles dans une démarche économique, écologique et solidaire." },
    { name: "Frip'in Shop", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2091, lng: -1.5691, address: "5 Rue Charles Brunellière", hours: "Lun-Sam : 10h30-19h", price: "1,50 € - 30 €", link: "https://fripinshop.com/", desc: "Friperie proposant des vêtements de seconde main à prix très accessibles, des basiques aux pièces de marque." },
    { name: "Frip'in Shop", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2414, lng: -1.5319, address: "15 Rue des Marsauderies", hours: "Lun-Sam : 10h30-19h", price: "1,50 € - 30 €", link: "https://fripinshop.com/", desc: "Friperie proposant des vêtements de seconde main à prix très accessibles, des basiques aux pièces de marque." },
    { name: "Frip'in Shop", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.1905, lng: -1.5695, address: "Rezé", hours: "Lun-Sam : 10h30-19h", price: "1,50 € - 30 €", link: "https://fripinshop.com/", desc: "Friperie proposant des vêtements de seconde main à prix très accessibles, des basiques aux pièces de marque." },
    { name: "KILO SHOP NANTES", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2151, lng: -1.5589, address: "15-17 Rue des Vieilles Douves, 44000 Nantes", hours: "Lun-Sam : 10h30-19h", price: "20 € - 60 €/kg", link: "https://www.kilo-shop.com/shop/kawaii-nantes/", desc: "Friperie vendant les vêtements au poids (20 € à 60 €/kg), soit environ 4 à 5 pièces par kilo." },
    { name: "TransiStore", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2624, lng: -1.5508, address: "14 Rue Kepler, 44240 La Chapelle-sur-Erdre", hours: "Non précisé", price: "Variable", link: "https://letransistore.org", desc: "Boutique solidaire : vêtements, linge, équipements maison et objets culturels." },
    { name: "La Boîte à Récup", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2262, lng: -1.5833, address: "112 Boulevard des Anglais, 44100 Nantes", hours: "Mer-Sam : 10h-13h / 14h30-18h45", price: "Variable", link: "https://metropole.nantes.fr/mes-services-mon-quotidien/espace-associations-nantaises/annuaire-des-associations-nantaises/la-boite-a-recup", desc: "Objets déco et articles solidaires, chaque achat soutient une économie sociale." },
    { name: "L’Autre Cantine – Friperies solidaires", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2148, lng: -1.5401, address: "18 Rue de Cornulier, 44000 Nantes", hours: "Free-shop : sam. 14h-16h30 ; dépôt de dons : mar-dim 13h-18h (à vérifier)", price: "Solidaire", link: "https://www.helloasso.com/associations/l-autre-cantine", desc: "Friperie solidaire proposant des vêtements à prix accessibles." },

    /* =========================
    NOURRITURE
    ========================= */
    { name: "StudHelp", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2184, lng: -1.5536, address: "En France (selon disponibilité des dons)", hours: "Selon disponibilité des dons", price: "0 €", link: "https://www.studhelp.fr/l-association-studhelp", desc: "Met en relation des étudiants en difficulté avec des donateurs afin de fournir gratuitement des paniers alimentaires et produits essentiels. Service national : position indicative sur la carte." },
    { name: "Cop1", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2066, lng: -1.5591, address: "10 Rue de l’Île Mabon 44200 Nantes - Selon permanences (voir site)", hours: "Selon créneaux d’accompagnement", price: "0 €", link: "https://cop1.fr/a-propos/", desc: "Propose des paniers alimentaires gratuits ainsi qu’un accompagnement étudiant : aide à l’emploi, stages, alternance et accès aux services essentiels." },
    { name: "Nous Anti-gaspi", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2246, lng: -1.5493, address: "3 Rue Pitre Chevalier, 44000 Nantes", hours: "Selon magasin", price: "2 € - 4 €", link: "https://www.nousantigaspi.com/", desc: "Produits sauvés du gaspillage alimentaire vendus à prix réduits. -10% pour les étudiants les mardis et jeudis." },
    { name: "Delivraide", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2012, lng: -1.5703, address: "8 Rue de St-Domingue, 44200 Nantes - Livraison à domicile", hours: "Sur demande via l'application", price: "0 €", link: "https://equipagesolidaire.fr/delivraide", desc: "Application solidaire proposant des kits alimentaires gratuits livrés à domicile pour les étudiants vulnérables." },
    { name: "La SurpreNantes Épicerie", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2457, lng: -1.5518, address: "Chemin de la Censive du Tertre, 44300 Nantes", hours: "Lundi (hors vacances universitaires) : 16h45-18h45, sur inscription", price: "Solidaire", link: "https://metropole.nantes.fr/actualites/la-surprenantes-epicerie-toujours-mobilisee-sur-le-front-de-la-precarite-etudiante", desc: "Épicerie solidaire étudiante : distribution gratuite de produits alimentaires aux étudiants en situation de précarité, sur inscription. Le local peut changer, vérifier avant de venir." },
    { name: "Linkee", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2185, lng: -1.5553, address: "37 Rue Saint Léonard, 44000 Nantes", hours: "Lundi : 18h-19h15 (à vérifier)", price: "Gratuit", link: "https://linkee.co", desc: "Organise des distributions alimentaires ouvertes à tous.tes les étudiant.e.s. Distribution signalée à La Cocotte Solidaire (Île de Versailles) : vérifier le lieu sur le site." },
    { name: "CampuSolidaire", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2165, lng: -1.5835, address: "5 Avenue Pajot, 44100 Nantes", hours: "Mensuel", price: "Gratuit", link: "https://metropole.nantes.fr/mes-services-mon-quotidien/espace-associations-nantaises/annuaire-des-associations-nantaises/campussolidaire", desc: "Soutient les étudiants en difficulté en fournissant des ressources essentielles." },

    /* =========================
    HYGIÈNE
    ========================= */
    { name: "Distributeurs gratuits (Ville de Nantes)", category: "Hygiène", icon: "droplets", class: "pin-hygiene", lat: 47.2184, lng: -1.5536, address: "Équipements publics de Nantes (carte sur le site de la Ville)", hours: "Selon les équipements", price: "Gratuit", link: "https://metropole.nantes.fr/zerotabou", desc: "Distributeurs 'Nouvelles Règles' : tampons et serviettes gratuits, accessibles à tous, dans des gymnases, piscines, bibliothèques et maisons de quartier. Position indicative sur la carte." },
    { name: "InterAsso Nantes", category: "Hygiène", icon: "droplets", class: "pin-hygiene", lat: 47.2450, lng: -1.5521, address: "Chemin de la Censive du Tertre, 44300 Nantes", hours: "Non précisé", price: "Gratuit", link: "", desc: "Fédération associative étudiante nantaise." },

    /* =========================
    LOGEMENT / HÉBERGEMENT
    ========================= */
    { name: "100 pour 1", category: "Logement", icon: "home", class: "pin-logement", lat: 47.1866, lng: -1.5298, address: "23 Rue de la Bouquinière, 44300 Nantes", hours: "Non précisé", price: "Solidaire", link: "https://metropole.nantes.fr/mes-services-mon-quotidien/espace-associations-nantaises/annuaire-des-associations-nantaises/100-pour-1-nantes-agglo", desc: "Apporte des solutions d’hébergement aux personnes en difficulté." },
    { name: "DAL 44 (Droit au Logement)", category: "Logement", icon: "home", class: "pin-logement", lat: 47.2124, lng: -1.5467, address: "28 Rue Fouré, 44000 Nantes", hours: "Non précisé", price: "Gratuit", link: "https://metropole.nantes.fr/mes-services-mon-quotidien/espace-associations-nantaises/annuaire-des-associations-nantaises/droit-au-logement-de-loire-atlantique", desc: "Association défendant le droit au logement." },
    { name: "Association Lazare", category: "Logement", icon: "home", class: "pin-logement", lat: 47.2189, lng: -1.5523, address: "3 Rue du Refuge, 44000 Nantes", hours: "Non précisé", price: "Solidaire", link: "https://lazare.eu", desc: "Colocations solidaires entre sans-abri et jeunes actifs." },
    { name: "Nantes’Renoue", category: "Logement", icon: "home", class: "pin-logement", lat: 47.2244, lng: -1.5653, address: "1 Cours des Francs Tireurs, 44000 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Accompagnement social et solidaire. Informations non confirmées (structure introuvable dans les sources consultées) : à vérifier avant de s'y rendre." },
    { name: "AISL (Insertion Solidarité Logement)", category: "Logement", icon: "home", class:"pin-logement" , lat : 47.2567 , lng : -1.5203 , address :"4 Rue François Hennebique, 44300 Nantes" , hours :"Non précisé" , price :"Solidaire" , link :"https://www.aisl.fr/" , desc :"Favorise l’insertion par le logement et l’hébergement. L'annuaire de la Métropole mentionne aussi de nouveaux locaux au 10 chemin de la Roche : vérifier l'adresse avant de s'y rendre." },
    { name:"La R'source" , category:"Logement" , icon:"home" , class:"pin-logement" , lat : 47.2113 , lng : -1.5650 , address :"5 Rue de Bréa, 44000 Nantes" , hours :"Lun : 10h-12h30 / 14h-16h30 ; Mar-Ven : 10h-12h30 (sans rendez-vous)" , price :"Gratuit" , link :"https://www.larsource.fr/" , desc :"Lieu d'accueil de jour dédié aux 16-25 ans sans hébergement stable : douche, repas, espace numérique, vestiaire solidaire et accompagnement social." },

    /* =========================
    NUMÉRIQUE
    ========================= */
    { name: "ALIS 44", category: "Numerique", icon: "laptop", class: "pin-numerique", lat: 47.2391, lng: -1.5199, address: "60 Rue de la Bottière, 44300 Nantes", hours: "Lun-Ven : 9h-12h30 / 14h-17h30 (sauf mercredi après-midi)", price: "Solidaire", link: "https://alis44.org", desc: "Association favorisant l’accès au numérique solidaire." },
    { name: "Ping", category: "Numerique", icon: "laptop", class: "pin-numerique", lat: 47.2064, lng: -1.5596, address: "5 Allée Frida Kahlo, 44200 Nantes", hours: "Non précisé", price: "Variable", link: "https://metropole.nantes.fr/mes-services-mon-quotidien/espace-associations-nantaises/annuaire-des-associations-nantaises/ping", desc: "Association nantaise autour des cultures numériques." },
    { name: "Les Nantais Solidaires", category: "Numerique", icon: "laptop", class: "pin-numerique", lat: 47.2401, lng: -1.5591, address: "82 Boulevard Gabriel Lauriol, 44300 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Initiative solidaire locale. Informations non confirmées (structure introuvable dans les sources consultées) : à vérifier avant de s'y rendre." },
    { name: "Repair-Café Numérique (Maison du Libre)", category: "Numerique", icon: "laptop", class:"pin-numerique" , lat : 47.2298 , lng : -1.5865 , address :"52 Rue du Breil, 44100 Nantes" , hours :"Selon événements" , price :"Gratuit" , link :"https://www.maisondulibre.fr/" , desc :"Ateliers de réparation numérique collaboratifs." },

    /* =========================
    ETUDE / ACCOMPAGNEMENT
    ========================= */
    { name: "CEMÉA – Pépinière Jeunesse Centre Sud", category: "Etude", icon: "book-open", class: "pin-etude", lat: 47.2034, lng: -1.5415, address: "12 Rue Anatole de Monzie, 44200 Nantes", hours: "Mar-Ven : 14h-19h (à vérifier)", price: "Gratuit", link: "https://cemea-pdll.org", desc: "Lieu ressource d'information et d’accompagnement pour les 16-25 ans." },
    { name: "Info Jeunes Pays de la Loire", category: "Etude", icon: "book-open", class: "pin-etude", lat: 47.2185, lng: -1.5553, address: "37 Rue Saint Léonard, 44000 Nantes", hours: "Mar-Ven : 14h-17h (à vérifier)", price: "Gratuit", link: "https://www.infos-jeunes.fr", desc: "Information, orientation et accompagnement des jeunes." },            
    
    /* =========================
    VIE SOCIALE & ENGAGÉE
    ========================= */
    { name: "Ecossolies", category: "VieSociale", icon: "users", class: "pin-sociale", lat: 47.2012, lng: -1.5701, address: "8 Rue Saint-Domingue, 44200 Nantes", hours: "Non précisé", price: "Variable", link: "https://metropole.nantes.fr/mes-services-mon-quotidien/espace-associations-nantaises/annuaire-des-associations-nantaises/les-ecossolies", desc: "Réseau de l’économie sociale et solidaire à Nantes." },
    { name: "CSC Laetitia", category: "VieSociale", icon: "users", class: "pin-sociale", lat: 47.2316, lng: -1.5786, address: "49 Rue Chanoine Larose, 44100 Nantes", hours: "Non précisé", price: "Variable", link: "https://metropole.nantes.fr/mes-services-mon-quotidien/espace-associations-nantaises/annuaire-des-associations-nantaises/centre-sportif-et-culturel-laetitia", desc: "Centre socioculturel proposant des activités et accompagnements." },

    /* =========================
    MULTISERVICE & DIVERS
    ========================= */
    { name: "La Frat’", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2125, lng: -1.5835, address: "3 Rue Amiral du Chaffault, 44100 Nantes", hours: "Mar-Ven : 14h-17h30 (à vérifier)", price: "Solidaire", link: "https://metropole.nantes.fr/mes-services-mon-quotidien/espace-associations-nantaises/annuaire-des-associations-nantaises/les-oeuvres-sociales-de-la-fraternite", desc: "Lieu solidaire multi-services." },
    { name: "Les Eaux Vives Emmaüs – Village solidaire 5 Ponts", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2034, lng: -1.5535, address: "12 Allée Nicole Girard Mangin, 44200 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Village solidaire et accompagnement social." },
    { name: "Boutique Solidaire / Ressourcerie des Dervallières", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2225, lng: -1.5977, address: "40 Boulevard Jean Ingres, 44100 Nantes", hours: "1 samedi par mois : 10h-16h (dates sur le site)", price: "Solidaire", link: "https://metropole.nantes.fr/que-faire-a-nantes/agenda/ouverture-de-la-ressourcerie-des-dervallieres", desc: "Ressourcerie et boutique solidaire." },
    { name: "Récup’Halveque", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2572, lng: -1.5201, address: "6 Rue François Hennebique, 44300 Nantes", hours: "Non précisé", price: "Solidaire", link: "https://metropole.nantes.fr/mes-services-mon-quotidien/espace-associations-nantaises/annuaire-des-associations-nantaises/recup-halveque", desc: "Structure de réemploi et économie circulaire." },
    { name: "Coup de Pouce", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2419, lng: -1.5391, address: "80 Rue du Port Boyer, 44300 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Association d’accompagnement solidaire. Informations non confirmées : l'adresse correspond au Pôle associatif de Port-Boyer, à vérifier avant de s'y rendre." },
    { name: "CROUS Nantes (Service Social)", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2445, lng: -1.5561, address: "2 Boulevard Guy Mollet, 44300 Nantes", hours: "Lun-Ven : 9h-12h / 13h-17h (à vérifier)", price: "Gratuit", link: "https://www.crous-nantes.fr", desc: "Service social accompagnant les étudiants dans leurs démarches." },
    { name: "C'est deux euros", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2162, lng: -1.5588, address: "Rue Guépin, 44000 Nantes", hours: "Lun : 14h-19h / Mar-Sam : 10h30-19h", price: "2 €", link: "https://www.cestdeuxeuros.com/concept", desc: "Magasin proposant une large gamme de produits du quotidien à prix unique et fixe de 2 €." }
];

const rewardsDatabase = [
    { category: "Bar", name: "La Canaille", address: "6 allée d'Orléans, Nantes", points: 20, offer: "1 shot acheté = 1 shot gratuit" },
    { category: "Bar", name: "Coté Plage", address: "14 Quai Turenne, Nantes", points: 40, offer: "1 verre acheté = 1 verre gratuit" },
    { category: "Bar", name: "Espit Chupitos", address: "Rue de la Paix, Nantes", points: 100, offer: "50% de réduction sur la note totale" },
    { category: "Boîte de nuit", name: "New factory", address: "2 Rue de Rieux, Nantes", points: 50, offer: "Entrée gratuite pour 1 soirée" },
    { category: "Boîte de nuit", name: "Moda", address: "32 Rue Crucy, Nantes", points: 120, offer: "1 boisson offerte" },
    { category: "Boîte de nuit", name: "WareHouse", address: "21 Quai des Antilles, Nantes", points: 200, offer: "1 entrée pour un showcase" },
    { category: "Restaurants", name: "Feeling Good Bakery", address: "1 Rue de la Marne, Nantes", points: 30, offer: "1 cookie acheté = 1 cookie offert" },
    { category: "Restaurants", name: "Roadside", address: "1 All. Flesselles, Nantes", points: 80, offer: "1 menu pour 2 à 20€ au lieu de 42€" },
    { category: "Restaurants", name: "Myoko", address: "8 Rue J.J. Rousseau, Nantes", points: 180, offer: "1 plat acheté = 1 plat offert" },
    { category: "Activités/Loisirs", name: "Bowlcenter", address: "151 Rue du Moulin, Saint-Herblain", points: 60, offer: "1 partie achetée = 1 partie offerte" },
    { category: "Activités/Loisirs", name: "John Doe Escape Game", address:"13 Rue des Olivettes, Nantes", points : 110 , offer : 'Entrée pour deux au prix d\'une' },
    { category:"Activités/Loisirs" , name:"Planet park" , address:"5 rue de la Garde, Nantes" , points : 170 , offer : 'Entrée achetée = Entrée offerte' },
    { category:"Culture" , name:"Pathé Nantes" , address:"12 Pl. du Commerce, Nantes" , points : 70 , offer : 'Place achetée = Place offerte' },
    { category: "Culture", name: "Musée de l'Illusion", address: "3 Rue Contrescarpe, Nantes", points: 140, offer: "Billet d’entrée gratuit" },
    { category: "Culture", name: "Théâtre Graslin", address: "Place Graslin, Nantes", points: 190, offer: "1 entrée achetée = 1 entrée gratuite" },
    { category: "Culture", name: "Le Stéréolux", address: "4 Bd Léon Bureau, Nantes", points: 200, offer: "Billet à -50%" },
    { category: "Sport", name: "Makadam fitness", address: "70 Bd du Massacre, Saint-Herblain", points: 130, offer: "5 séances gratuites" },
    { category: "Sport", name: "Stade de la Beaujoire", address: "333 Rte de Saint-Joseph, Nantes", points: 150, offer: "3 places à 30€" },
    { category: "Sport", name: "HBC Nantes", address: "Rue René Viviani, Nantes", points: 160, offer: "2 places gratuites" }
];

if (typeof module !== 'undefined') module.exports = { lieux, rewardsDatabase };
