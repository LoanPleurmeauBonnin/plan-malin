document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALISATION GLOBALE
    // Si la CDN est injoignable (hors-ligne), l'app reste utilisable sans icônes ni carte.
    const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const refreshIcons = () => { if (window.lucide) window.lucide.createIcons(); };
    refreshIcons();

    // Rend un élément non-natif (div cliquable) utilisable au clavier et par les lecteurs d'écran.
    const makeActivable = (el, role = 'button') => {
        el.setAttribute('role', role);
        el.tabIndex = 0;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    };

    // Stockage local (démo sans serveur) : points, photos, suggestions. Tout reste sur l'appareil.
    const store = {
        get(key, fallback) {
            try {
                const raw = localStorage.getItem('pm_' + key);
                return raw === null ? fallback : JSON.parse(raw);
            } catch (e) { return fallback; }
        },
        set(key, value) {
            try { localStorage.setItem('pm_' + key, JSON.stringify(value)); return true; } catch (e) { return false; }
        }
    };
    const DEFAULT_POINTS = 120;
    const POINTS_PER_PHOTO = 10;
    const getPoints = () => store.get('points', DEFAULT_POINTS);

    // Comparaison de texte insensible à la casse et aux accents ("etudiant" trouve "Étudiant").
    const normalize = (str) => str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    // 2. REDIRECTION LANDING PAGE
    const downloadBtn = document.getElementById('btn-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => { window.location.href = 'app.html'; });
    }

    // 3. NAVIGATION MULTI-PAGES
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        makeActivable(item, 'link');
        if (item.classList.contains('active')) item.setAttribute('aria-current', 'page');
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
    if (mapContainer && window.L) {
        const map = L.map('map', { zoomControl: false }).setView([47.2184, -1.5536], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19
        }).addTo(map);

        const markerGroup = L.layerGroup().addTo(map);

        // Tes données
        // Données : voir data.js (const lieux)

        const bottomSheet = document.getElementById('bottom-sheet');
        const backdrop = document.getElementById('modal-backdrop');
        const closeBtn = document.getElementById('close-sheet');
        const noResults = document.getElementById('no-results');

        let categorieActuelle = 'Tout';
        let rechercheActuelle = '';

        const renderMarkers = () => {
            markerGroup.clearLayers();
            lieux.forEach(lieu => {
                const matchCategorie = (categorieActuelle === 'Tout' || lieu.category === categorieActuelle);
                const matchRecherche = normalize(`${lieu.name} ${lieu.category} ${lieu.desc}`).includes(normalize(rechercheActuelle.trim()));

                if (matchCategorie && matchRecherche) {
                    const customIcon = L.divIcon({
                        className: 'custom-pin',
                        html: `<div class="pin-marker ${lieu.class}"></div>`,
                        iconSize: [24, 24], iconAnchor: [12, 24]
                    });

                    const marker = L.marker([lieu.lat, lieu.lng], { icon: customIcon, title: lieu.name, alt: lieu.name });

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

                        document.getElementById('sheet-category').innerHTML = `<i data-lucide="${lieu.icon}"></i> <span id="sheet-category-text" style="margin-left:5px;"></span>`;
                        document.getElementById('sheet-category-text').textContent = lieu.category;
                        refreshIcons();

                        if (bottomSheet) bottomSheet.classList.add('active');
                        if (backdrop) backdrop.classList.add('active');
                    });
                    markerGroup.addLayer(marker);
                }
            });
            if (noResults) noResults.hidden = markerGroup.getLayers().length > 0;
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
                makeActivable(pill);
                pill.setAttribute('aria-pressed', pill.classList.contains('active'));
                pill.addEventListener('click', () => {
                    document.querySelectorAll('.filters-container:not(.rewards-filters) .filter-pill').forEach(p => {
                        p.classList.remove('active');
                        p.setAttribute('aria-pressed', 'false');
                    });
                    pill.classList.add('active');
                    pill.setAttribute('aria-pressed', 'true');
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
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);
    }

    // ==========================================
    // 4bis. SUGGESTION D'UN NOUVEAU LIEU (app.html, enregistrée localement)
    // ==========================================
    const suggestSheet = document.getElementById('suggest-sheet');
    const suggestBackdrop = document.getElementById('suggest-backdrop');
    const suggestForm = document.getElementById('suggest-form');
    if (suggestSheet && suggestBackdrop && suggestForm) {
        const suggestStatus = document.getElementById('suggest-status');
        const openSuggest = () => {
            suggestStatus.textContent = '';
            suggestSheet.classList.add('active');
            suggestBackdrop.classList.add('active');
            document.getElementById('suggest-name').focus();
        };
        const closeSuggest = () => {
            suggestSheet.classList.remove('active');
            suggestBackdrop.classList.remove('active');
        };
        document.getElementById('btn-open-suggest').addEventListener('click', openSuggest);
        document.getElementById('suggest-close').addEventListener('click', closeSuggest);
        suggestBackdrop.addEventListener('click', closeSuggest);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSuggest(); });

        suggestForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = new FormData(suggestForm);
            const suggestion = {
                name: String(data.get('name')).trim(),
                address: String(data.get('address')).trim(),
                category: String(data.get('category')),
                comment: String(data.get('comment')).trim(),
                date: new Date().toISOString()
            };
            if (!suggestion.name || !suggestion.address) {
                suggestStatus.textContent = "Le nom et l'adresse sont obligatoires.";
                return;
            }
            const saved = store.set('suggestions', [...store.get('suggestions', []), suggestion]);
            suggestStatus.textContent = saved
                ? "Merci ! Ta suggestion est enregistrée sur cet appareil (démo : rien n'est envoyé)."
                : "Impossible d'enregistrer la suggestion (stockage indisponible).";
            if (saved) suggestForm.reset();
        });
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
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFriendModal(); });
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
                normalize(friend.name).includes(normalize(searchQuery)) || 
                normalize(friend.sub).includes(normalize(searchQuery))
            );

            filteredFriends.forEach(friend => {
                suggestionsListContainer.insertAdjacentHTML('beforeend', `
                    <div class="suggestion-item">
                        <img src="${escapeHtml(friend.avatar)}" alt="${escapeHtml(friend.name)}" class="suggestion-avatar">
                        <div class="suggestion-info">
                            <span class="suggestion-name">${escapeHtml(friend.name)}</span>
                            <span class="suggestion-sub">${escapeHtml(friend.sub)}</span>
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
        // Données : voir data.js (const rewardsDatabase)

        let currentRewardCategory = 'Tout';
        let refreshGauge = () => {};

        const renderRewards = (categoryFilter = 'Tout') => {
            currentRewardCategory = categoryFilter;
            rewardsListContainer.innerHTML = '';
            const filteredRewards = rewardsDatabase.filter(reward => categoryFilter === 'Tout' || reward.category === categoryFilter);

            filteredRewards.forEach(reward => {
                rewardsListContainer.insertAdjacentHTML('beforeend', `
                    <div class="reward-card">
                        <img src="${escapeHtml(reward.img)}" alt="${escapeHtml(reward.name)}" loading="lazy" class="reward-img">
                        <div class="reward-info">
                            <h3>${escapeHtml(reward.name)}</h3>
                            <p class="reward-address">${escapeHtml(reward.address)}</p>
                            <p class="reward-offer">${escapeHtml(reward.offer)}</p>
                            <p class="reward-points">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-bottom:2px;"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3v19"/><path d="M2 9h20"/></svg> 
                                ${reward.points} points
                            </p>
                            <button type="button" class="btn-use" data-reward="${rewardsDatabase.indexOf(reward)}" ${getPoints() < reward.points ? 'disabled' : ''}>${getPoints() < reward.points ? 'Points insuffisants' : 'Utiliser'}</button>
                        </div>
                    </div>
                `);
            });
        };

        const rewardFilterPills = document.querySelectorAll('.rewards-filters .filter-pill');
        rewardFilterPills.forEach(pill => {
            makeActivable(pill);
            pill.setAttribute('aria-pressed', pill.classList.contains('active'));
            pill.addEventListener('click', () => {
                rewardFilterPills.forEach(p => {
                    p.classList.remove('active');
                    p.setAttribute('aria-pressed', 'false');
                });
                pill.classList.add('active');
                pill.setAttribute('aria-pressed', 'true');
                renderRewards(pill.getAttribute('data-reward-cat'));
            });
        });

        renderRewards();

        // --- BON DE DÉMONSTRATION : "Utiliser" une offre ---
        const voucherModal = document.getElementById('voucher-modal');
        const voucherBackdrop = document.getElementById('voucher-backdrop');
        const closeVoucher = () => {
            if (voucherModal) voucherModal.classList.remove('active');
            if (voucherBackdrop) voucherBackdrop.classList.remove('active');
        };
        const makeVoucherCode = () => {
            const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            const bytes = crypto.getRandomValues(new Uint8Array(6));
            return 'PM-' + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
        };

        rewardsListContainer.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn-use');
            if (!btn || btn.disabled || !voucherModal) return;
            const reward = rewardsDatabase[Number(btn.dataset.reward)];
            if (!reward || getPoints() < reward.points) return;
            if (!window.confirm(`Utiliser ${reward.points} points pour « ${reward.offer} » chez ${reward.name} ?`)) return;

            store.set('points', getPoints() - reward.points);
            document.getElementById('voucher-name').textContent = reward.name;
            document.getElementById('voucher-offer').textContent = reward.offer;
            document.getElementById('voucher-code').textContent = makeVoucherCode();
            voucherModal.classList.add('active');
            voucherBackdrop.classList.add('active');
            refreshGauge();
            renderRewards(currentRewardCategory);
        });
        const btnCloseVoucher = document.getElementById('btn-close-voucher');
        if (btnCloseVoucher) btnCloseVoucher.addEventListener('click', closeVoucher);
        if (voucherBackdrop) voucherBackdrop.addEventListener('click', closeVoucher);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeVoucher(); });

        // --- JAUGE DYNAMIQUE ET ANIMATION DES POINTS ---
        let userPoints = getPoints(); // Points enregistrés sur l'appareil (120 par défaut)
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

            // Mise à jour immédiate après l'utilisation d'une offre
            refreshGauge = () => {
                userPoints = getPoints();
                const percent = Math.min((userPoints / maxPoints) * 100, 100);
                progressFill.style.strokeDashoffset = circumference - (percent / 100) * circumference;
                pointsText.innerText = userPoints;
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

    const btnInfoRewards = document.getElementById('btn-info-rewards');
    if (btnInfoRewards) {
        makeActivable(btnInfoRewards);
        btnInfoRewards.setAttribute('aria-label', 'Comment utiliser mes points ?');
    }

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
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeInfoModal(); });
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
    let cameraRequestId = 0; // invalide les demandes de flux dépassées (fermeture / bascule rapide)
    let currentFacingMode = 'environment'; // 'environment' = arrière, 'user' = avant (selfie)

    if (btnOpenCamera && cameraOverlay && videoElement) {
        
// Fonction qui allume la caméra selon le mode choisi (Spécial iOS Safari)
        const startCamera = async () => {
            const requestId = ++cameraRequestId;
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
                    alert("Impossible d'accéder à la caméra. Vérifie l'autorisation du navigateur (la caméra exige aussi HTTPS ou localhost).");
                    cameraOverlay.classList.remove('active');
                    return; // On arrête tout si ça plante
                }
            }

            // Si l'utilisateur a fermé la caméra ou rebasculé pendant l'attente, on libère ce flux
            if (requestId !== cameraRequestId) {
                currentStream.getTracks().forEach(track => track.stop());
                currentStream = null;
                return;
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
            cameraRequestId++;
            cameraOverlay.classList.remove('active');
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
                currentStream = null;
                videoElement.srcObject = null;
            }
        };

        if (btnCloseCamera) btnCloseCamera.addEventListener('click', closeCamera);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && cameraOverlay.classList.contains('active')) closeCamera(); });

        // Capture réelle : image réduite, enregistrée sur l'appareil (aucun envoi)
        const grabFrame = () => {
            if (!videoElement.videoWidth) return null;
            const scale = Math.min(1, 480 / videoElement.videoWidth);
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(videoElement.videoWidth * scale);
            canvas.height = Math.round(videoElement.videoHeight * scale);
            const ctx = canvas.getContext('2d');
            if (currentFacingMode === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg', 0.7);
        };

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

                const photo = grabFrame();
                setTimeout(() => {
                    if (!photo) {
                        alert("La caméra n'est pas encore prête, réessaie dans un instant.");
                        return;
                    }
                    const photos = [photo, ...store.get('photos', [])].slice(0, 12);
                    const saved = store.set('photos', photos);
                    const total = getPoints() + POINTS_PER_PHOTO;
                    if (saved) store.set('points', total);
                    alert(saved
                        ? `✅ Photo enregistrée sur cet appareil ! +${POINTS_PER_PHOTO} points (total : ${total}).`
                        : "Photo prise, mais l'espace de stockage de l'appareil est plein : elle n'a pas été enregistrée.");
                    closeCamera();
                }, 400);
            });
        }
    }

    // ==========================================
    // 9. LOGIQUE DU PROFIL (Onglets Album / Favoris)
    // ==========================================
    const statPoints = document.getElementById('stat-points');
    if (statPoints) statPoints.textContent = getPoints();
    const albumGrid = document.getElementById('content-album');
    if (albumGrid) {
        store.get('photos', []).forEach((src) => {
            const item = document.createElement('div');
            item.className = 'photo-item';
            const img = document.createElement('img');
            img.src = src;
            img.alt = "Photo prise avec l'appareil";
            img.style.cssText = 'width:100%; height:100%; object-fit:cover;';
            item.appendChild(img);
            albumGrid.prepend(item);
        });
    }

    const profileTabs = document.querySelectorAll('.profile-tabs .tab');
    
    if (profileTabs.length > 0) {
        profileTabs.forEach(tab => {
            makeActivable(tab, 'tab');
            tab.setAttribute('aria-selected', tab.classList.contains('active'));
            tab.addEventListener('click', () => {
                // 1. On retire la classe 'active' de tous les onglets
                profileTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                
                // 2. On ajoute 'active' à l'onglet cliqué
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                
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
            makeActivable(item);
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
                                <img src="${escapeHtml(photoUrl)}" alt="Trouvaille de ${escapeHtml(name)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
                            </div>
                        `);
                    });
                }

                // 5. On rafraîchit les icônes et on ouvre la modale
                refreshIcons();
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
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFriendProfile(); });
    }
});