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
            { name: "StudHelp", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2184, lng: -1.5536, address: "En France (selon disponibilité des dons)", hours: "Selon disponibilité des dons", price: "0 €", link: "https://www.studhelp.fr/l-association-studhelp", desc: "Met en relation des étudiants en difficulté avec des donateurs afin de fournir gratuitement des paniers alimentaires et produits essentiels." },
            { name: "Cop1", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2066, lng: -1.5591, address: "10 Rue de l’Île Mabon 44200 Nantes - Selon permanences (voir site)", hours: "Selon créneaux d’accompagnement", price: "0 €", link: "https://cop1.fr/a-propos/", desc: "Propose des paniers alimentaires gratuits ainsi qu’un accompagnement étudiant : aide à l’emploi, stages, alternance et accès aux services essentiels." },
            { name: "Nous Anti-gaspi", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2246, lng: -1.5493, address: "3 Rue Pitre Chevalier, 44000 Nantes", hours: "Selon magasin", price: "2 € - 4 €", link: "https://www.nousantigaspi.com/", desc: "Produits sauvés du gaspillage alimentaire vendus à prix réduits. -10% pour les étudiants les mardis et jeudis." },
            { name: "Delivraide", category: "Nourriture", icon: "pizza", class: "pin-food", lat: 47.2012, lng: -1.5703, address: "8 Rue de St-Domingue, 44200 Nantes - Livraison à domicile", hours: "Sur demande via l'application", price: "0 €", link: "https://equipagesolidaire.fr/delivraide", desc: "Application solidaire proposant des kits alimentaires gratuits livrés à domicile pour les étudiants vulnérables." },
            { name: "Dernière main", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2154, lng: -1.5509, address: "5 Rue de Strasbourg, Nantes", hours: "Mar-Sam : 14h-19h", price: "2 € - 25 €", link: "https://dernieremain.fr/", desc: "Friperie de seconde main proposant des vêtements pour tous à petits prix en centre-ville." },
            { name: "Ding Fring", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2157, lng: -1.5583, address: "10 Rue de l'Arche Sèche, Nantes", hours: "Lun : 14h-19h / Mar-Sam : 10h-19h", price: "2 € - 25 €", link: "https://www.instagram.com/dingfring_friperie/", desc: "Vêtements et accessoires de seconde main à prix accessibles dans une démarche économique, écologique et solidaire." },
            { name: "Frip'in Shop", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2091, lng: -1.5691, address: "5 Rue Charles Brunellière", hours: "Lun-Sam : 10h30-19h", price: "1,50 € - 30 €", link: "https://fripinshop.com/", desc: "Friperie proposant des vêtements de seconde main à prix très accessibles, des basiques aux pièces de marque." },
            { name: "Frip'in Shop", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2414, lng: -1.5319, address: "15 Rue des Marsauderies", hours: "Lun-Sam : 10h30-19h", price: "1,50 € - 30 €", link: "https://fripinshop.com/", desc: "Friperie proposant des vêtements de seconde main à prix très accessibles, des basiques aux pièces de marque." },
            { name: "Frip'in Shop", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.1905, lng: -1.5695, address: "Rezé", hours: "Lun-Sam : 10h30-19h", price: "1,50 € - 30 €", link: "https://fripinshop.com/", desc: "Friperie proposant des vêtements de seconde main à prix très accessibles, des basiques aux pièces de marque." },
            { name: "KILO SHOP NANTES", category: "Vêtements", icon: "shopping-bag", class: "pin-clothes", lat: 47.2151, lng: -1.5589, address: "15-17 Rue des Vieilles Douves, 44000 Nantes", hours: "Lun-Sam : 10h30-19h", price: "20 € - 60 €/kg", link: "https://www.kilo-shop.com/shop/kawaii-nantes/", desc: "Friperie vendant les vêtements au poids (20 € à 60 €/kg), soit environ 4 à 5 pièces par kilo." },
            { name: "C'est deux euros", category: "Divers", icon: "package", class: "pin-misc", lat: 47.2162, lng: -1.5588, address: "Rue Guépin, 44000 Nantes", hours: "Lun : 14h-19h / Mar-Sam : 10h30-19h", price: "2 €", link: "https://www.cestdeuxeuros.com/concept", desc: "Magasin proposant une large gamme de produits du quotidien à prix unique et fixe de 2 €." }
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
                        this.style.backgroundColor = 'var(--primary-green)';
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
            { category: "Bar", name: "La Canaille", address: "6 allée d'Orléans, Nantes", points: 20, offer: "1 shot acheté = 1 shot gratuit", img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=150&q=80" },
            { category: "Bar", name: "Coté Plage", address: "14 Quai Turenne, Nantes", points: 40, offer: "1 verre acheté = 1 verre gratuit", img: "https://images.unsplash.com/photo-1575037614876-c38db4ce8456?auto=format&fit=crop&w=150&q=80" },
            { category: "Bar", name: "Espit Chupitos", address: "Rue de la Paix, Nantes", points: 100, offer: "50% de réduction sur la note totale", img: "https://images.unsplash.com/photo-1560508180-03f285f67ded?auto=format&fit=crop&w=150&q=80" },
            { category: "Boîte de nuit", name: "New factory", address: "2 Rue de Rieux, Nantes", points: 50, offer: "Entrée gratuite pour 1 soirée", img: "https://images.unsplash.com/photo-1574391884720-bbc3740c51d1?auto=format&fit=crop&w=150&q=80" },
            { category: "Boîte de nuit", name: "Moda", address: "32 Rue Crucy, Nantes", points: 120, offer: "1 boisson offerte", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=150&q=80" },
            { category: "Boîte de nuit", name: "WareHouse", address: "21 Quai des Antilles, Nantes", points: 200, offer: "1 entrée pour un showcase", img: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=150&q=80" },
            { category: "Restaurants", name: "Feeling Good Bakery", address: "1 Rue de la Marne, Nantes", points: 30, offer: "1 cookie acheté = 1 cookie offert", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=150&q=80" },
            { category: "Restaurants", name: "Roadside", address: "1 All. Flesselles, Nantes", points: 80, offer: "1 menu pour 2 à 20€ au lieu de 42€", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=150&q=80" },
            { category: "Restaurants", name: "Myoko", address: "8 Rue J.J. Rousseau, Nantes", points: 180, offer: "1 plat acheté = 1 plat offert", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=150&q=80" },
            { category: "Activités/Loisirs", name: "Bowlcenter", address: "151 Rue du Moulin, Saint-Herblain", points: 60, offer: "1 partie achetée = 1 partie offerte", img: "https://images.unsplash.com/photo-1553105659-f0411130d8d7?auto=format&fit=crop&w=150&q=80" },
            { category: "Activités/Loisirs", name: "John Doe Escape Game", address: "13 Rue des Olivettes, Nantes", points: 110, offer: "1 entrée pour 2 au prix de 1", img: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=150&q=80" },
            { category: "Activités/Loisirs", name: "Planet park", address: "5 rue de la Garde, Nantes", points: 170, offer: "1 entrée achetée = 1 entrée offerte", img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=150&q=80" },
            { category: "Culture", name: "Pathé Nantes", address: "12 Pl. du Commerce, Nantes", points: 70, offer: "1 place achetée = 1 place offerte", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=150&q=80" },
            { category: "Culture", name: "Musée de l'illusion", address: "3 Rue Contrescarpe, Nantes", points: 140, offer: "Billet d’entrée gratuit", img: "https://images.unsplash.com/photo-1518998053401-878c730cd534?auto=format&fit=crop&w=150&q=80" },
            { category: "Culture", name: "Théâtre Graslin", address: "Place Graslin, Nantes", points: 190, offer: "1 entrée achetée = 1 entrée gratuite", img: "https://images.unsplash.com/photo-1507676184212-e034ebc2e92c?auto=format&fit=crop&w=150&q=80" },
            { category: "Culture", name: "Le Stéréolux", address: "4 Bd Léon Bureau, Nantes", points: 200, offer: "Billet à -50%", img: "https://images.unsplash.com/photo-1470229722913-7c090be5c520?auto=format&fit=crop&w=150&q=80" },
            { category: "Sport", name: "Makadam fitness", address: "70 Bd du Massacre, Saint-Herblain", points: 130, offer: "5 séances gratuites", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80" },
            { category: "Sport", name: "Stade de la Beaujoire", address: "333 Rte de Saint-Joseph, Nantes", points: 150, offer: "3 places à 30€", img: "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=150&q=80" },
            { category: "Sport", name: "HBC Nantes", address: "Rue René Viviani, Nantes", points: 160, offer: "2 places gratuites", img: "https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=150&q=80" }
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
});