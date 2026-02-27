document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALISATION GLOBALE
    lucide.createIcons();

    // 2. REDIRECTION LANDING PAGE
    const downloadBtn = document.getElementById('btn-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => { window.location.href = 'app.html'; });
    }

    // 3. NAVIGATION MULTI-PAGES
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-target');
            if (targetPage) {
                window.location.href = targetPage;
            } else {
                const pageName = this.querySelector('span').innerText;
                alert(`La page ${pageName} sera bientôt disponible !`);
            }
        });
    });

    // ==========================================
    // 4. LOGIQUE DE LA CARTE (app.html)
    // ==========================================
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        const map = L.map('map', { zoomControl: false }).setView([47.2184, -1.5536], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap', maxZoom: 19
        }).addTo(map);

        const markerGroup = L.layerGroup().addTo(map);

        // Tes données
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
            { name: "TransiStore", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2624, lng: -1.5508, address: "14 Rue Kepler, 44240 La Chapelle-sur-Erdre", hours: "Non précisé", price: "Variable", link: "", desc: "Boutique solidaire : vêtements, linge, équipements maison et objets culturels." },
            { name: "La Boîte à Récup", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2262, lng: -1.5833, address: "112 Boulevard des Anglais, 44100 Nantes", hours: "Non précisé", price: "Variable", link: "", desc: "Objets déco et articles solidaires, chaque achat soutient une économie sociale." },
            { name: "L’Autre Cantine – Friperies solidaires", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2148, lng: -1.5401, address: "18 Rue de Cornulier, 44000 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Friperie solidaire proposant des vêtements à prix accessibles." },

            /* =========================
            NOURRITURE
            ========================= */
            { name: "StudHelp", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2184, lng: -1.5536, address: "En France (selon disponibilité des dons)", hours: "Selon disponibilité des dons", price: "0 €", link: "https://www.studhelp.fr/l-association-studhelp", desc: "Met en relation des étudiants en difficulté avec des donateurs afin de fournir gratuitement des paniers alimentaires et produits essentiels." },
            { name: "Cop1", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2066, lng: -1.5591, address: "10 Rue de l’Île Mabon 44200 Nantes - Selon permanences (voir site)", hours: "Selon créneaux d’accompagnement", price: "0 €", link: "https://cop1.fr/a-propos/", desc: "Propose des paniers alimentaires gratuits ainsi qu’un accompagnement étudiant : aide à l’emploi, stages, alternance et accès aux services essentiels." },
            { name: "Nous Anti-gaspi", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2246, lng: -1.5493, address: "3 Rue Pitre Chevalier, 44000 Nantes", hours: "Selon magasin", price: "2 € - 4 €", link: "https://www.nousantigaspi.com/", desc: "Produits sauvés du gaspillage alimentaire vendus à prix réduits. -10% pour les étudiants les mardis et jeudis." },
            { name: "Delivraide", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2012, lng: -1.5703, address: "8 Rue de St-Domingue, 44200 Nantes - Livraison à domicile", hours: "Sur demande via l'application", price: "0 €", link: "https://equipagesolidaire.fr/delivraide", desc: "Application solidaire proposant des kits alimentaires gratuits livrés à domicile pour les étudiants vulnérables." },
            { name: "La SurpreNantes Épicerie", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2457, lng: -1.5518, address: "Chemin de la Censive du Tertre, 44300 Nantes", hours: "Lundi : 17h00 - 18h45", price: "Solidaire", link: "", desc: "Épicerie solidaire étudiante proposant des produits alimentaires." },
            { name: "Linkee", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2185, lng: -1.5553, address: "37 Rue Saint Léonard, 44000 Nantes", hours: "Selon distributions", price: "Gratuit", link: "", desc: "Organise des distributions alimentaires ouvertes à tous.tes les étudiant.e.s." },
            { name: "CampuSolidaire", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2165, lng: -1.5835, address: "5 Avenue Pajot, 44100 Nantes", hours: "Mensuel", price: "Gratuit", link: "", desc: "Soutient les étudiants en difficulté en fournissant des ressources essentielles." },

            /* =========================
            HYGIÈNE
            ========================= */
            { name: "Distributeurs gratuits (Ville de Nantes)", category: "Hygiène", icon: "droplets", class: "pin-hygiene", lat: 47.2184, lng: -1.5536, address: "Lieux publics à Nantes", hours: "Selon lieux", price: "Gratuit", link: "", desc: "Distributeurs 'Nouvelles Règles' proposant gratuitement tampons et serviettes." },
            { name: "InterAsso Nantes", category: "Hygiène", icon: "droplets", class: "pin-hygiene", lat: 47.2450, lng: -1.5521, address: "Chemin de la Censive du Tertre, 44300 Nantes", hours: "Non précisé", price: "Gratuit", link: "", desc: "Fédération associative étudiante nantaise." },

            /* =========================
            LOGEMENT / HÉBERGEMENT
            ========================= */
            { name: "100 pour 1", category: "Logement", icon: "home", class: "pin-logement", lat: 47.1866, lng: -1.5298, address: "23 Rue de la Bouquinière, 44300 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Apporte des solutions d’hébergement aux personnes en difficulté." },
            { name: "DAL 44 (Droit au Logement)", category: "Logement", icon: "home", class: "pin-logement", lat: 47.2124, lng: -1.5467, address: "28 Rue Fouré, 44000 Nantes", hours: "Non précisé", price: "Gratuit", link: "", desc: "Association défendant le droit au logement." },
            { name: "Association Lazare", category: "Logement", icon: "home", class: "pin-logement", lat: 47.2189, lng: -1.5523, address: "3 Rue du Refuge, 44000 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Colocations solidaires entre sans-abri et jeunes actifs." },
            { name: "Nantes’Renoue", category: "Logement", icon: "home", class: "pin-logement", lat: 47.2244, lng: -1.5653, address: "1 Cours des Francs Tireurs, 44000 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Accompagnement social et solidaire." },
            { name: "AISL (Insertion Solidarité Logement)", category: "Logement", icon: "home", class:"pin-logement" , lat : 47.2567 , lng : -1.5203 , address :"4 Rue François Hennebique, 44300 Nantes" , hours :"Non précisé" , price :"Solidaire" , link :"https://www.aisl.fr/" , desc :"Favorise l’insertion par le logement et l’hébergement." },
            { name:"La R'source" , category:"Logement" , icon:"home" , class:"pin-logement" , lat : 47.2113 , lng : -1.5650 , address :"5 Rue de Bréa, 44000 Nantes" , hours :"Non précisé" , price :"Gratuit" , link :"https://www.larsource.fr/" , desc :"Lieu dédié aux 16-25 ans sans hébergement stable." },

            /* =========================
            NUMÉRIQUE
            ========================= */
            { name: "ALIS 44", category: "Numerique", icon: "laptop", class: "pin-numerique", lat: 47.2391, lng: -1.5199, address: "60 Rue de la Bottière, 44300 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Association favorisant l’accès au numérique solidaire." },
            { name: "Ping", category: "Numerique", icon: "laptop", class: "pin-numerique", lat: 47.2064, lng: -1.5596, address: "5 Allée Frida Kahlo, 44100 Nantes", hours: "Non précisé", price: "Variable", link: "", desc: "Association nantaise autour des cultures numériques." },
            { name: "Les Nantais Solidaires", category: "Numerique", icon: "laptop", class: "pin-numerique", lat: 47.2401, lng: -1.5591, address: "82 Boulevard Gabriel Lauriol, 44300 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Initiative solidaire locale." },
            { name: "Repair-Café Numérique (Maison du Libre)", category: "Numerique", icon: "laptop", class:"pin-numerique" , lat : 47.2298 , lng : -1.5865 , address :"52 Rue du Breil, 44100 Nantes" , hours :"Selon événements" , price :"Gratuit" , link :"https://www.maisondulibre.fr/" , desc :"Ateliers de réparation numérique collaboratifs." },

            /* =========================
            ETUDE / ACCOMPAGNEMENT
            ========================= */
            { name: "La Ressourcerie Culturelle", category: "Etude", icon: "book-open", class: "pin-etude", lat: 46.9832, lng: -1.3213, address: "184 Rue Joseph Gaillard, 85600 Montaigu-Vendée", hours: "Non précisé", price: "Solidaire", link: "", desc: "Structure culturelle solidaire." },
            { name: "CEMÉA – Pépinière Jeunesse Centre Sud", category: "Etude", icon: "book-open", class: "pin-etude", lat: 47.2034, lng: -1.5415, address: "12 Rue Anatole de Monzie, 44200 Nantes", hours: "Non précisé", price: "Gratuit", link: "", desc: "Lieu ressource d'information et d’accompagnement pour les 16-25 ans." },
            { name: "Info Jeunes Pays de la Loire", category: "Etude", icon: "book-open", class: "pin-etude", lat: 47.2185, lng: -1.5553, address: "37 Rue Saint Léonard, 44000 Nantes", hours: "Non précisé", price: "Gratuit", link: "", desc: "Information, orientation et accompagnement des jeunes." },            
            
            /* =========================
            VIE SOCIALE & ENGAGÉE
            ========================= */
            { name: "Ecossolies", category: "VieSociale", icon: "users", class: "pin-sociale", lat: 47.2012, lng: -1.5701, address: "8 Rue Saint-Domingue, 44200 Nantes", hours: "Non précisé", price: "Variable", link: "", desc: "Réseau de l’économie sociale et solidaire à Nantes." },
            { name: "CSC Laetitia", category: "VieSociale", icon: "users", class: "pin-sociale", lat: 47.2316, lng: -1.5786, address: "49 Rue Chanoine Larose, 44100 Nantes", hours: "Non précisé", price: "Variable", link: "", desc: "Centre socioculturel proposant des activités et accompagnements." },

            /* =========================
            MULTISERVICE & DIVERS
            ========================= */
            { name: "La Frat’", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2125, lng: -1.5835, address: "3 Rue Amiral du Chaffault, 44100 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Lieu solidaire multi-services." },
            { name: "Les Eaux Vives Emmaüs – Village solidaire 5 Ponts", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2034, lng: -1.5535, address: "12 Allée Nicole Girard Mangin, 44200 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Village solidaire et accompagnement social." },
            { name: "Boutique Solidaire / Ressourcerie des Dervallières", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2225, lng: -1.5977, address: "40 Boulevard Jean Ingres, 44100 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Ressourcerie et boutique solidaire." },
            { name: "Récup’Halveque", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2572, lng: -1.5201, address: "6 Rue François Hennebique, 44300 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Structure de réemploi et économie circulaire." },
            { name: "Coup de Pouce", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2419, lng: -1.5391, address: "80 Rue du Port Boyer, 44300 Nantes", hours: "Non précisé", price: "Solidaire", link: "", desc: "Association d’accompagnement solidaire." },
            { name: "CROUS Nantes (Service Social)", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2445, lng: -1.5561, address: "2 Boulevard Guy Mollet, 44300 Nantes", hours: "Horaires administratifs", price: "Gratuit", link: "", desc: "Service social accompagnant les étudiants dans leurs démarches." },
            { name: "C'est deux euros", category: "Multiservice", icon: "layers", class: "pin-multiservice", lat: 47.2162, lng: -1.5588, address: "Rue Guépin, 44000 Nantes", hours: "Lun : 14h-19h / Mar-Sam : 10h30-19h", price: "2 €", link: "https://www.cestdeuxeuros.com/concept", desc: "Magasin proposant une large gamme de produits du quotidien à prix unique et fixe de 2 €." }
        ];

        const bottomSheet = document.getElementById('bottom-sheet');
        const backdrop = document.getElementById('modal-backdrop');
        const closeBtn = document.getElementById('close-sheet');

        let categorieActuelle = 'Tout';
        let rechercheActuelle = '';

        const renderMarkers = () => {
            markerGroup.clearLayers();
            lieux.forEach(lieu => {
                const matchCategorie = (categorieActuelle === 'Tout' || lieu.category === categorieActuelle);
                const matchRecherche = lieu.name.toLowerCase().includes(rechercheActuelle.toLowerCase()) || lieu.desc.toLowerCase().includes(rechercheActuelle.toLowerCase());

                if (matchCategorie && matchRecherche) {
                    const customIcon = L.divIcon({
                        className: 'custom-pin',
                        html: `<div class="pin-marker ${lieu.class}"></div>`,
                        iconSize: [24, 24], iconAnchor: [12, 24]
                    });

                    const marker = L.marker([lieu.lat, lieu.lng], { icon: customIcon });

                    marker.on('click', () => {
                        document.getElementById('sheet-title').textContent = lieu.name;
                        document.getElementById('sheet-category-text').textContent = lieu.category;
                        document.getElementById('sheet-address').textContent = lieu.address;
                        document.getElementById('sheet-hours').textContent = lieu.hours;
                        document.getElementById('sheet-price').textContent = lieu.price;
                        document.getElementById('sheet-desc').textContent = lieu.desc;

                        const btnWebsite = document.getElementById('btn-website');
                        if (lieu.link) {
                            btnWebsite.href = lieu.link;
                            btnWebsite.style.display = 'flex';
                        } else {
                            btnWebsite.style.display = 'none';
                        }

                        // ==========================================
                        // NOUVEAU : GESTION DU BOUTON "Y ALLER"
                        // ==========================================
                        const btnItinerary = document.getElementById('btn-itinerary');
                        if (btnItinerary) {
                            // On remplace l'action du clic par l'ouverture du lien Google Maps
                            btnItinerary.onclick = () => {
                                // Ouvre un nouvel onglet vers l'itinéraire GPS précis
                                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lieu.lat},${lieu.lng}`;
                                window.open(mapsUrl, '_blank');
                            };
                        }

                        document.getElementById('sheet-category').innerHTML = `<i data-lucide="${lieu.icon}"></i> <span id="sheet-category-text" style="margin-left:5px;">${lieu.category}</span>`;
                        lucide.createIcons();

                        if (bottomSheet) bottomSheet.classList.add('active');
                        if (backdrop) backdrop.classList.add('active');
                    });
                    markerGroup.addLayer(marker);
                }
            });
        };

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                rechercheActuelle = event.target.value;
                renderMarkers();
            });
        }

        const filterPills = document.querySelectorAll('.filter-pill');
        filterPills.forEach(pill => {
            // Empêche les filtres de la page récompense d'interférer avec la carte
            if(!pill.closest('.rewards-filters')) {
                pill.addEventListener('click', () => {
                    document.querySelectorAll('.filters-container:not(.rewards-filters) .filter-pill').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    categorieActuelle = pill.getAttribute('data-filter');
                    renderMarkers();
                });
            }
        });

        renderMarkers();

        const closeModal = () => {
            if (bottomSheet) bottomSheet.classList.remove('active');
            if (backdrop) backdrop.classList.remove('active');
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);
    }

    // ==========================================
    // 5. LOGIQUE DES AMIS (amis.html)
    // ==========================================
    const btnAddFriend = document.getElementById('btn-add-friend');
    const addFriendSheet = document.getElementById('add-friend-sheet');
    const addFriendBackdrop = document.getElementById('add-friend-backdrop');
    const addFriendClose = document.getElementById('add-friend-close');

    if (btnAddFriend && addFriendSheet && addFriendBackdrop) {
        btnAddFriend.addEventListener('click', () => {
            addFriendSheet.classList.add('active');
            addFriendBackdrop.classList.add('active');
        });

        const closeFriendModal = () => {
            addFriendSheet.classList.remove('active');
            addFriendBackdrop.classList.remove('active');
        };

        addFriendBackdrop.addEventListener('click', closeFriendModal);
        if (addFriendClose) addFriendClose.addEventListener('click', closeFriendModal);

        const mockFriends = [
            { id: 1, name: "Emma Dubois", sub: "Étudiante en design", avatar: "https://i.pravatar.cc/150?img=1" },
            { id: 2, name: "Hugo Martin", sub: "Campus Tertre", avatar: "https://i.pravatar.cc/150?img=13" },
            { id: 3, name: "Chloé Leroy", sub: "Adore les friperies", avatar: "https://i.pravatar.cc/150?img=5" },
            { id: 4, name: "Nathan Roux", sub: "Nantes Centre", avatar: "https://i.pravatar.cc/150?img=11" },
            { id: 5, name: "Manon Peeters", sub: "Fan de bons plans", avatar: "https://i.pravatar.cc/150?img=9" },
            { id: 6, name: "Thomas Morel", sub: "Polytech Nantes", avatar: "https://i.pravatar.cc/150?img=8" }
        ];

        const searchFriendInput = document.getElementById('search-friend-input');
        const suggestionsListContainer = document.getElementById('suggestions-list-container');

        const renderFriends = (searchQuery = '') => {
            if (!suggestionsListContainer) return;
            suggestionsListContainer.innerHTML = '';

            const filteredFriends = mockFriends.filter(friend => 
                friend.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                friend.sub.toLowerCase().includes(searchQuery.toLowerCase())
            );

            filteredFriends.forEach(friend => {
                suggestionsListContainer.insertAdjacentHTML('beforeend', `
                    <div class="suggestion-item">
                        <img src="${friend.avatar}" alt="${friend.name}" class="suggestion-avatar">
                        <div class="suggestion-info">
                            <span class="suggestion-name">${friend.name}</span>
                            <span class="suggestion-sub">${friend.sub}</span>
                        </div>
                        <button class="btn-add-small">Ajouter</button>
                    </div>
                `);
            });

            suggestionsListContainer.querySelectorAll('.btn-add-small').forEach(btn => {
                btn.addEventListener('click', function() {
                    if(this.innerText === 'Ajouter') {
                        this.innerText = 'Ajouté';
                        this.style.backgroundColor = '#d1d5db';
                        this.style.color = '#fff';
                    } else {
                        this.innerText = 'Ajouter';
                        this.style.backgroundColor = 'var(--primary-color)';
                    }
                });
            });
        };

        if (searchFriendInput) {
            searchFriendInput.addEventListener('input', (event) => renderFriends(event.target.value));
        }
        renderFriends();
    }

    // ==========================================
    // 6. LOGIQUE DES RÉCOMPENSES (recompenses.html)
    // ==========================================
    const rewardsListContainer = document.getElementById('rewards-dynamic-list');
    
    if (rewardsListContainer) {
        const rewardsDatabase = [
            { category: "Bar", name: "La Canaille", address: "6 allée d'Orléans, Nantes", points: 20, offer: "1 shot acheté = 1 shot gratuit", img: "assets/img/la_canaille.webp" },
            { category: "Bar", name: "Coté Plage", address: "14 Quai Turenne, Nantes", points: 40, offer: "1 verre acheté = 1 verre gratuit", img: "assets/img/cote-plage.webp" },
            { category: "Bar", name: "Espit Chupitos", address: "Rue de la Paix, Nantes", points: 100, offer: "50% de réduction sur la note totale", img: "assets/img/espit_chupitos_nantes.webp" },
            { category: "Boîte de nuit", name: "New factory", address: "2 Rue de Rieux, Nantes", points: 50, offer: "Entrée gratuite pour 1 soirée", img: "assets/img/new_factory.png" },
            { category: "Boîte de nuit", name: "Moda", address: "32 Rue Crucy, Nantes", points: 120, offer: "1 boisson offerte", img: "assets/img/moda.webp" },
            { category: "Boîte de nuit", name: "WareHouse", address: "21 Quai des Antilles, Nantes", points: 200, offer: "1 entrée pour un showcase", img: "assets/img/warehouse.webp" },
            { category: "Restaurants", name: "Feeling Good Bakery", address: "1 Rue de la Marne, Nantes", points: 30, offer: "1 cookie acheté = 1 cookie offert", img: "assets/img/feeling_good_bakery.jpg" },
            { category: "Restaurants", name: "Roadside", address: "1 All. Flesselles, Nantes", points: 80, offer: "1 menu pour 2 à 20€ au lieu de 42€", img: "assets/img/roadside.jpg" },
            { category: "Restaurants", name: "Myoko", address: "8 Rue J.J. Rousseau, Nantes", points: 180, offer: "1 plat acheté = 1 plat offert", img: "assets/img/myoko.jpg" },
            { category: "Activités/Loisirs", name: "Bowlcenter", address: "151 Rue du Moulin, Saint-Herblain", points: 60, offer: "1 partie achetée = 1 partie offerte", img: "assets/img/bowling_center.jpg" },
            { category: "Activités/Loisirs", name: "John Doe Escape Game", address:"13 Rue des Olivettes, Nantes", points : 110 , offer : 'Entrée pour deux au prix d\'une', img : 'assets/img/accueil-john-doe-escape.jpg'},
            { category:"Activités/Loisirs" , name:"Planet park" , address:"5 rue de la Garde, Nantes" , points : 170 , offer : 'Entrée achetée = Entrée offerte' , img : 'assets/img/planet_park_nantes.jpg'},
            { category:"Culture" , name:"Pathé Nantes" , address:"12 Pl. du Commerce, Nantes" , points : 70 , offer : 'Place achetée = Place offerte' , img : 'assets/img/cinema_pathe.png'},
            { category: "Culture", name: "Musée de l'Illusion", address: "3 Rue Contrescarpe, Nantes", points: 140, offer: "Billet d’entrée gratuit", img: "assets/img/musee_illusion.jpg" },
            { category: "Culture", name: "Théâtre Graslin", address: "Place Graslin, Nantes", points: 190, offer: "1 entrée achetée = 1 entrée gratuite", img: "assets/img/theatre_place_graslin.jpg" },
            { category: "Culture", name: "Le Stéréolux", address: "4 Bd Léon Bureau, Nantes", points: 200, offer: "Billet à -50%", img: "assets/img/stereolux.webp" },
            { category: "Sport", name: "Makadam fitness", address: "70 Bd du Massacre, Saint-Herblain", points: 130, offer: "5 séances gratuites", img: "assets/img/makadam_fitness.jpg" },
            { category: "Sport", name: "Stade de la Beaujoire", address: "333 Rte de Saint-Joseph, Nantes", points: 150, offer: "3 places à 30€", img: "assets/img/stade_de_la_beaujoire.jpg" },
            { category: "Sport", name: "HBC Nantes", address: "Rue René Viviani, Nantes", points: 160, offer: "2 places gratuites", img: "assets/img/hbc_nantes.png" }
        ];

        const renderRewards = (categoryFilter = 'Tout') => {
            rewardsListContainer.innerHTML = '';
            const filteredRewards = rewardsDatabase.filter(reward => categoryFilter === 'Tout' || reward.category === categoryFilter);

            filteredRewards.forEach(reward => {
                rewardsListContainer.insertAdjacentHTML('beforeend', `
                    <div class="reward-card">
                        <img src="${reward.img}" alt="${reward.name}" class="reward-img">
                        <div class="reward-info">
                            <h3>${reward.name}</h3>
                            <p class="reward-address">${reward.address}</p>
                            <p class="reward-offer">${reward.offer}</p>
                            <p class="reward-points">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-bottom:2px;"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3v19"/><path d="M2 9h20"/></svg> 
                                ${reward.points} points
                            </p>
                        </div>
                    </div>
                `);
            });
        };

        const rewardFilterPills = document.querySelectorAll('.rewards-filters .filter-pill');
        rewardFilterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                rewardFilterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                renderRewards(pill.getAttribute('data-reward-cat'));
            });
        });

        renderRewards();

        // --- JAUGE DYNAMIQUE ET ANIMATION DES POINTS ---
        const userPoints = 120; // Tes points actuels
        const maxPoints = 200;  // Le palier pour une jauge à 100%
        
        const progressFill = document.getElementById('dynamic-progress-fill');
        const pointsText = document.getElementById('current-points-text');

        if (progressFill && pointsText) {
            
            // 1. Calcul mathématique du périmètre du cercle (2 * PI * Rayon)
            const radius = progressFill.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            
            // On prépare le SVG (totalement vide au départ)
            progressFill.style.strokeDasharray = `${circumference} ${circumference}`;
            progressFill.style.strokeDashoffset = circumference;

            // Fonction pour lancer l'animation (appelée quand on clique sur l'onglet)
            const animateJaugeAndPoints = () => {
                // Animation de la jauge (Remplissage fluide)
                setTimeout(() => {
                    const percent = Math.min((userPoints / maxPoints) * 100, 100);
                    const offset = circumference - (percent / 100) * circumference;
                    progressFill.style.strokeDashoffset = offset;
                }, 100);

                // Animation du texte (Compteur qui défile)
                let currentDisplay = 0;
                const duration = 1000; // 1 seconde d'animation
                const interval = 20; // Mise à jour toutes les 20ms
                const step = (userPoints / (duration / interval));

                const counter = setInterval(() => {
                    currentDisplay += step;
                    if (currentDisplay >= userPoints) {
                        currentDisplay = userPoints;
                        clearInterval(counter);
                    }
                    pointsText.innerText = Math.round(currentDisplay);
                }, interval);
            };

            // On lance l'animation au démarrage de l'appli (si on est déjà sur l'onglet)
            animateJaugeAndPoints();

            // BONUS : Sécurisé pour éviter de faire planter le script si l'onglet n'est pas trouvé
            const tabRecompenses = document.querySelector('[data-target-view="view-recompenses"]');
            if (tabRecompenses) {
                tabRecompenses.addEventListener('click', () => {
                    // Remise à zéro
                    progressFill.style.strokeDashoffset = circumference;
                    pointsText.innerText = '0';
                    // On relance
                    animateJaugeAndPoints();
                });
            }
        }
    }

// ==========================================
    // 7. MODALE INFO RÉCOMPENSES (Centrée)
    // ==========================================
    const infoRewardsModal = document.getElementById('info-rewards-modal');
    const infoRewardsBackdrop = document.getElementById('info-rewards-backdrop');
    const btnCloseInfo = document.getElementById('btn-close-info');

    // DÉLÉGATION D'ÉVÉNEMENT : On écoute les clics sur tout le document
    document.addEventListener('click', (event) => {
        // On vérifie si l'élément cliqué (ou son parent) possède l'ID 'btn-info-rewards'
        if (event.target.closest('#btn-info-rewards')) {
            if (infoRewardsModal && infoRewardsBackdrop) {
                infoRewardsModal.classList.add('active');
                infoRewardsBackdrop.classList.add('active');
            }
        }
    });

    // Fonction pour fermer la modale
    const closeInfoModal = () => {
        if (infoRewardsModal) infoRewardsModal.classList.remove('active');
        if (infoRewardsBackdrop) infoRewardsBackdrop.classList.remove('active');
    };

    // On garde les écouteurs classiques pour fermer (car ces éléments ne sont pas écrasés par Lucide)
    if (infoRewardsBackdrop) infoRewardsBackdrop.addEventListener('click', closeInfoModal);
    if (btnCloseInfo) btnCloseInfo.addEventListener('click', closeInfoModal);
    // ==========================================
    // 8. LOGIQUE DE LA CAMÉRA (Preuve de visite)
    // ==========================================
    const btnOpenCamera = document.getElementById('btn-open-camera');
    const cameraOverlay = document.getElementById('camera-overlay');
    const btnCloseCamera = document.getElementById('btn-close-camera');
    const btnSwitchCamera = document.getElementById('btn-switch-camera'); // Le nouveau bouton
    const btnCapturePhoto = document.getElementById('btn-capture-photo');
    const videoElement = document.getElementById('camera-stream');
    
    let currentStream = null;
    let currentFacingMode = 'environment'; // 'environment' = arrière, 'user' = avant (selfie)

    if (btnOpenCamera && cameraOverlay && videoElement) {
        
// Fonction qui allume la caméra selon le mode choisi (Spécial iOS Safari)
        const startCamera = async () => {
            // 1. Éteindre la caméra actuelle
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
                // Astuce iOS : attendre 100ms pour que le téléphone libère vraiment la caméra
                await new Promise(resolve => setTimeout(resolve, 100)); 
            }

            try {
                // 2. Tenter l'accès avec la contrainte STRICTE (Requis pour l'iPhone)
                currentStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: { exact: currentFacingMode } },
                    audio: false
                });
            } catch (err) {
                // 3. Fallback (Plan B) : Si 'exact' échoue (ex: test sur ordinateur portable où 'environment' n'existe pas)
                try {
                    currentStream = await navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: currentFacingMode },
                        audio: false
                    });
                } catch (errFallback) {
                    console.error("Erreur de caméra : ", errFallback);
                    alert("Impossible de changer de caméra.");
                    cameraOverlay.classList.remove('active');
                    return; // On arrête tout si ça plante
                }
            }

            // 4. Connecter le flux vidéo à l'écran
            videoElement.srcObject = currentStream;
            
            // 5. Effet miroir automatique pour les selfies
            if (currentFacingMode === 'user') {
                videoElement.style.transform = 'scaleX(-1)';
            } else {
                videoElement.style.transform = 'scaleX(1)';
            }
        };

        // Ouvrir l'overlay
        btnOpenCamera.addEventListener('click', () => {
            cameraOverlay.classList.add('active');
            currentFacingMode = 'environment'; // On remet toujours l'arrière par défaut à l'ouverture
            startCamera();
        });

        // ACTION DU BOUTON SWITCH (Retourner la caméra)
        if (btnSwitchCamera) {
            btnSwitchCamera.addEventListener('click', () => {
                // On inverse le mode actuel
                currentFacingMode = (currentFacingMode === 'environment') ? 'user' : 'environment';
                // On relance la caméra avec le nouveau mode
                startCamera();
            });
        }

        // Fermer proprement
        const closeCamera = () => {
            cameraOverlay.classList.remove('active');
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
                currentStream = null;
                videoElement.srcObject = null;
            }
        };

        if (btnCloseCamera) btnCloseCamera.addEventListener('click', closeCamera);

        // Simulation de la capture
        if (btnCapturePhoto) {
            btnCapturePhoto.addEventListener('click', () => {
                const flash = document.createElement('div');
                flash.style.position = 'absolute';
                flash.style.inset = '0';
                flash.style.backgroundColor = 'white';
                flash.style.zIndex = '2005';
                flash.style.transition = 'opacity 0.2s ease-out';
                cameraOverlay.appendChild(flash);
                
                setTimeout(() => { flash.style.opacity = '0'; }, 50);
                setTimeout(() => { flash.remove(); }, 250);

                setTimeout(() => {
                    alert("✅ Photo validée ! Tu viens de gagner des points !");
                    closeCamera();
                }, 400);
            });
        }
    }

    // ==========================================
    // 9. LOGIQUE DU PROFIL (Onglets Album / Favoris)
    // ==========================================
    const profileTabs = document.querySelectorAll('.profile-tabs .tab');
    
    if (profileTabs.length > 0) {
        profileTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 1. On retire la classe 'active' de tous les onglets
                profileTabs.forEach(t => t.classList.remove('active'));
                
                // 2. On ajoute 'active' à l'onglet cliqué
                tab.classList.add('active');
                
                // 3. On récupère la cible (content-album ou content-favoris)
                const targetId = tab.getAttribute('data-target');
                
                // 4. On cache les deux contenus
                document.getElementById('content-album').style.display = 'none';
                document.getElementById('content-favoris').style.display = 'none';
                
                // 5. On affiche uniquement le bon contenu
                const targetContent = document.getElementById(targetId);
                if (targetId === 'content-album') {
                    targetContent.style.display = 'grid'; // L'album utilise CSS Grid
                } else {
                    targetContent.style.display = 'flex'; // La liste favoris utilise Flex
                }
            });
        });
    }

    // ==========================================
    // 10. MODALE PROFIL AMI (Au clic sur un ami)
    // ==========================================
    const friendItems = document.querySelectorAll('.friends-list-container .friend-item');
    const friendProfileSheet = document.getElementById('friend-profile-sheet');
    const friendProfileBackdrop = document.getElementById('friend-profile-backdrop');
    const friendProfileClose = document.getElementById('friend-profile-close');

    // Les éléments texte et image à mettre à jour dans la modale
    const fpName = document.getElementById('fp-name');
    const fpAvatar = document.getElementById('fp-avatar');
    const fpVisites = document.getElementById('fp-visites');
    const fpTrouvailles = document.getElementById('fp-trouvailles');
    const fpPoints = document.getElementById('fp-points');

    if (friendItems.length > 0 && friendProfileSheet) {
        
        // On écoute le clic sur chaque ami de la liste
        friendItems.forEach(item => {
            // S'assure de ne pas écouter les clics sur d'éventuels boutons (ex: supprimer)
            item.addEventListener('click', (e) => {
                
                // 1. On récupère les infos depuis le HTML de l'ami cliqué
                const name = item.querySelector('.friend-name').innerText;
                const imgSrc = item.querySelector('img').src;

                // 2. On met à jour l'interface de la modale
                fpName.innerText = name;
                fpAvatar.src = imgSrc;
                
                // 3. On génère des statistiques aléatoires pour la démo
                fpVisites.innerText = Math.floor(Math.random() * 15) + 1;    // Entre 1 et 15
                fpTrouvailles.innerText = Math.floor(Math.random() * 30) + 5; // Entre 5 et 35
                fpPoints.innerText = Math.floor(Math.random() * 150) + 20;   // Entre 20 et 170

                // ==========================================
                // 4. NOUVEAU : ALBUM DYNAMIQUE SELON L'AMI
                // ==========================================
                const fpAlbumGrid = document.getElementById('fp-album-grid');
                if (fpAlbumGrid) {
                    fpAlbumGrid.innerHTML = ''; // On vide l'album précédent

                    let photos = [];

                    // On définit les photos selon le nom de l'ami
                    if (name === "Lucas Martel") {
                        photos = [
                            "assets/img/trouvaille1.jpg",
                            "assets/img/tee_shirt_noir.jpg",
                            "assets/img/la_canaille.webp"
                        ];
                    } else if (name === "Inès Carvalho") {
                        photos = [
                            "assets/img/ticket_tenu.jpg"
                        ];
                    } else {
                        // Photos par défaut pour les autres amis (ex: Théo Bianchi)
                        photos = [
                            "assets/img/trouvaille2.jpg",
                            "assets/img/stade.jpg"
                        ];
                    }

                    // On injecte chaque photo dans la grille HTML
                    photos.forEach(photoUrl => {
                        fpAlbumGrid.insertAdjacentHTML('beforeend', `
                            <div class="photo-item">
                                <img src="${photoUrl}" alt="Trouvaille de ${name}" style="width:100%; height:100%; object-fit:cover;">
                            </div>
                        `);
                    });
                }

                // 5. On rafraîchit les icônes et on ouvre la modale
                lucide.createIcons();
                friendProfileSheet.classList.add('active');
                friendProfileBackdrop.classList.add('active');
            });
        });

        // Fonction pour fermer la modale (glissement vers le bas)
        const closeFriendProfile = () => {
            friendProfileSheet.classList.remove('active');
            friendProfileBackdrop.classList.remove('active');
        };

        // Fermeture au clic sur le fond noir ou la petite poignée grise
        if(friendProfileBackdrop) friendProfileBackdrop.addEventListener('click', closeFriendProfile);
        if(friendProfileClose) friendProfileClose.addEventListener('click', closeFriendProfile);
    }
});