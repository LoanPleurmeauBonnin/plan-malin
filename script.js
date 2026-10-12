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
    const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    // Message bref et non bloquant (remplace alert)
    let toastTimer = null;
    const toast = (message) => {
        let el = document.getElementById('toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'toast';
            el.className = 'toast';
            el.setAttribute('role', 'status');
            el.setAttribute('aria-live', 'polite');
            document.body.appendChild(el);
        }
        el.textContent = message;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
    };

    // Fenêtre (feuille du bas ou modale centrée) : ouverture, fermeture par fond, poignée ou Échap.
    const setupSheet = (sheetId, backdropId) => {
        const sheet = document.getElementById(sheetId);
        const backdrop = document.getElementById(backdropId);
        if (!sheet || !backdrop) return null;
        const close = () => {
            sheet.classList.remove('active');
            backdrop.classList.remove('active');
        };
        const open = () => {
            sheet.classList.add('active');
            backdrop.classList.add('active');
            sheet.tabIndex = -1;
            sheet.focus({ preventScroll: true });
        };
        backdrop.addEventListener('click', close);
        const handle = sheet.querySelector('.sheet-handle');
        if (handle) handle.addEventListener('click', close);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
        return { sheet, backdrop, open, close };
    };

    // Partage du lien de l'appli : menu natif du téléphone si disponible, sinon copie dans le presse-papiers.
    const shareLink = async (title, text) => {
        const url = new URL('index.html', window.location.href).href;
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
                return;
            } catch (e) {
                if (e.name === 'AbortError') return;
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            toast('Lien copié dans le presse-papiers !');
        } catch (e) {
            toast('Copie ce lien : ' + url);
        }
    };

    // Valeur stable dérivée d'un texte (statistiques de démonstration identiques à chaque ouverture)
    const seeded = (str, modulo) => {
        let h = 0;
        for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
        return h % modulo;
    };

    // Menu de la landing page (mobile)
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        const setMenu = (open) => {
            navLinks.classList.toggle('open', open);
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        };
        menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
        navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    }

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
                toast(`La page ${this.querySelector('span').innerText} sera bientôt disponible !`);
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

        const lieuKey = (l) => `${l.name}|${l.address}`;
        const isFree = (l) => /^(0\s?€|gratuit)/i.test(l.price.trim());
        const getFavorites = () => store.get('favorites', []);

        const bottomSheet = document.getElementById('bottom-sheet');
        const backdrop = document.getElementById('modal-backdrop');
        const closeBtn = document.getElementById('close-sheet');
        const noResults = document.getElementById('no-results');
        const favBtn = document.getElementById('btn-favorite');

        let categorieActuelle = 'Tout';
        let rechercheActuelle = '';
        const filtres = { gratuit: false, site: false, favoris: false };
        let lieuOuvert = null;

        const updateFavBtn = () => {
            if (!favBtn || !lieuOuvert) return;
            const on = getFavorites().includes(lieuKey(lieuOuvert));
            favBtn.classList.toggle('active', on);
            favBtn.setAttribute('aria-pressed', String(on));
            favBtn.setAttribute('aria-label', on ? 'Retirer des favoris' : 'Ajouter aux favoris');
        };

        const openLieu = (lieu) => {
            lieuOuvert = lieu;
            document.getElementById('sheet-title').textContent = lieu.name;
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

            // Bouton "Y aller" : itinéraire GPS vers le lieu dans un nouvel onglet
            const btnItinerary = document.getElementById('btn-itinerary');
            if (btnItinerary) {
                btnItinerary.onclick = () => {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lieu.lat},${lieu.lng}`, '_blank', 'noopener');
                };
            }

            document.getElementById('sheet-category').innerHTML = `<i data-lucide="${lieu.icon}"></i> <span id="sheet-category-text" style="margin-left:5px;"></span>`;
            document.getElementById('sheet-category-text').textContent = lieu.category;
            refreshIcons();
            updateFavBtn();

            if (bottomSheet) bottomSheet.classList.add('active');
            if (backdrop) backdrop.classList.add('active');
        };

        // Filtres avancés (icône à droite de la recherche)
        const filtersBtn = document.getElementById('btn-open-filters');
        const filterFree = document.getElementById('filter-free');
        const filterSite = document.getElementById('filter-site');
        const filterFav = document.getElementById('filter-fav');
        const filtersApply = document.getElementById('filters-apply');

        const renderMarkers = () => {
            markerGroup.clearLayers();
            const favoris = getFavorites();
            lieux.forEach(lieu => {
                const matchCategorie = (categorieActuelle === 'Tout' || lieu.category === categorieActuelle);
                const matchRecherche = normalize(`${lieu.name} ${lieu.category} ${lieu.desc}`).includes(normalize(rechercheActuelle.trim()));
                const matchFiltres = (!filtres.gratuit || isFree(lieu))
                    && (!filtres.site || Boolean(lieu.link))
                    && (!filtres.favoris || favoris.includes(lieuKey(lieu)));

                if (matchCategorie && matchRecherche && matchFiltres) {
                    const customIcon = L.divIcon({
                        className: 'custom-pin',
                        html: `<div class="pin-marker ${lieu.class}"></div>`,
                        iconSize: [24, 24], iconAnchor: [12, 24]
                    });

                    const marker = L.marker([lieu.lat, lieu.lng], { icon: customIcon, title: lieu.name, alt: lieu.name });
                    marker.on('click', () => openLieu(lieu));
                    markerGroup.addLayer(marker);
                }
            });
            const count = markerGroup.getLayers().length;
            if (noResults) noResults.hidden = count > 0;
            if (filtersBtn) filtersBtn.classList.toggle('has-filters', Object.values(filtres).some(Boolean));
            if (filtersApply) filtersApply.textContent = `Voir ${count} lieu${count > 1 ? 'x' : ''}`;
        };

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                rechercheActuelle = event.target.value;
                renderMarkers();
            });
        }

        const filtersSheet = setupSheet('filters-sheet', 'filters-backdrop');
        if (filtersBtn && filtersSheet) {
            filtersBtn.addEventListener('click', filtersSheet.open);
            const syncFilters = () => {
                filtres.gratuit = filterFree.checked;
                filtres.site = filterSite.checked;
                filtres.favoris = filterFav.checked;
                renderMarkers();
            };
            [filterFree, filterSite, filterFav].forEach((box) => box.addEventListener('change', syncFilters));
            document.getElementById('filters-reset').addEventListener('click', () => {
                [filterFree, filterSite, filterFav].forEach((box) => { box.checked = false; });
                syncFilters();
            });
            filtersApply.addEventListener('click', filtersSheet.close);
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

        // Favoris : cœur de la fiche d'un lieu
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                if (!lieuOuvert) return;
                const key = lieuKey(lieuOuvert);
                const favoris = getFavorites();
                const on = favoris.includes(key);
                store.set('favorites', on ? favoris.filter((k) => k !== key) : [...favoris, key]);
                updateFavBtn();
                renderMarkers();
                toast(on ? 'Retiré de tes favoris' : 'Ajouté à tes favoris');
            });
        }

        // Géolocalisation : centre la carte sur la position de l'utilisateur
        const btnLocate = document.getElementById('btn-locate');
        let youMarker = null;
        if (btnLocate) {
            btnLocate.addEventListener('click', () => {
                if (!navigator.geolocation) {
                    toast("La géolocalisation n'est pas disponible sur cet appareil.");
                    return;
                }
                toast('Recherche de ta position…');
                navigator.geolocation.getCurrentPosition((pos) => {
                    const latlng = [pos.coords.latitude, pos.coords.longitude];
                    if (youMarker) youMarker.remove();
                    youMarker = L.marker(latlng, {
                        icon: L.divIcon({ className: '', html: '<div class="you-are-here"></div>', iconSize: [16, 16], iconAnchor: [8, 8] }),
                        interactive: false, keyboard: false
                    }).addTo(map);
                    map.setView(latlng, 15);
                }, () => toast('Position indisponible : autorise la localisation (HTTPS ou localhost requis).'),
                { enableHighAccuracy: true, timeout: 10000 });
            });
        }

        renderMarkers();

        // Lien direct vers un lieu (depuis les favoris du profil) : app.html?lieu=...
        const wanted = new URLSearchParams(window.location.search).get('lieu');
        if (wanted) {
            const cible = lieux.find((l) => lieuKey(l) === wanted);
            if (cible) {
                map.setView([cible.lat, cible.lng], 16);
                openLieu(cible);
            }
        }

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
        const friendsContainer = document.querySelector('.friends-list-container');
        const getAddedFriends = () => store.get('friends', []);

        // Amis ajoutés depuis les suggestions : affichés à la suite de la liste
        const renderAddedFriends = () => {
            if (!friendsContainer) return;
            friendsContainer.querySelectorAll('.friend-item[data-added]').forEach((el) => el.remove());
            getAddedFriends().forEach((id) => {
                const friend = mockFriends.find((m) => m.id === id);
                if (!friend) return;
                const item = document.createElement('div');
                item.className = 'friend-item';
                item.dataset.added = '1';
                item.innerHTML = `
                    <div class="avatar-wrapper">
                        <img src="${escapeHtml(friend.avatar)}" alt="${escapeHtml(friend.name)}">
                        <span class="status-dot offline"></span>
                    </div>
                    <div class="friend-info">
                        <span class="friend-name">${escapeHtml(friend.name)}</span>
                        <span class="friend-status offline-text">${escapeHtml(friend.sub)}</span>
                    </div>`;
                makeActivable(item);
                friendsContainer.appendChild(item);
            });
        };

        const renderFriends = (searchQuery = '') => {
            if (!suggestionsListContainer) return;
            suggestionsListContainer.innerHTML = '';
            const added = getAddedFriends();

            const filteredFriends = mockFriends.filter(friend =>
                normalize(friend.name).includes(normalize(searchQuery)) ||
                normalize(friend.sub).includes(normalize(searchQuery))
            );

            if (filteredFriends.length === 0) {
                suggestionsListContainer.innerHTML = '<p class="settings-note">Aucun résultat.</p>';
                return;
            }

            filteredFriends.forEach(friend => {
                const isAdded = added.includes(friend.id);
                suggestionsListContainer.insertAdjacentHTML('beforeend', `
                    <div class="suggestion-item">
                        <img src="${escapeHtml(friend.avatar)}" alt="${escapeHtml(friend.name)}" class="suggestion-avatar">
                        <div class="suggestion-info">
                            <span class="suggestion-name">${escapeHtml(friend.name)}</span>
                            <span class="suggestion-sub">${escapeHtml(friend.sub)}</span>
                        </div>
                        <button type="button" class="btn-add-small${isAdded ? ' added' : ''}" data-id="${friend.id}" aria-pressed="${isAdded}">${isAdded ? 'Ajouté' : 'Ajouter'}</button>
                    </div>
                `);
            });
        };

        if (suggestionsListContainer) {
            suggestionsListContainer.addEventListener('click', (event) => {
                const btn = event.target.closest('.btn-add-small');
                if (!btn) return;
                const id = Number(btn.dataset.id);
                const added = getAddedFriends();
                const friend = mockFriends.find((m) => m.id === id);
                const isAdded = added.includes(id);
                store.set('friends', isAdded ? added.filter((x) => x !== id) : [...added, id]);
                renderAddedFriends();
                renderFriends(searchFriendInput ? searchFriendInput.value : '');
                toast(isAdded ? `${friend.name} retiré(e) de tes amis` : `${friend.name} ajouté(e) à tes amis`);
            });
        }

        if (searchFriendInput) {
            searchFriendInput.addEventListener('input', (event) => renderFriends(event.target.value));
        }

        const btnInvite = document.querySelector('.btn-invite-link');
        if (btnInvite) {
            btnInvite.addEventListener('click', () => shareLink('Plan Malin', 'Rejoins-moi sur Plan Malin, la carte des bons plans et du réemploi à Nantes !'));
        }

        renderAddedFriends();
        renderFriends();

        // Arrivée depuis le profil (icône « ajouter un ami »)
        if (new URLSearchParams(window.location.search).get('ajouter')) {
            btnAddFriend.click();
            window.history.replaceState(null, '', window.location.pathname);
        }
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
            const code = makeVoucherCode();
            store.set('vouchers', [{ name: reward.name, offer: reward.offer, code, date: new Date().toISOString() }, ...store.get('vouchers', [])].slice(0, 30));
            document.getElementById('voucher-name').textContent = reward.name;
            document.getElementById('voucher-offer').textContent = reward.offer;
            document.getElementById('voucher-code').textContent = code;
            voucherModal.classList.add('active');
            voucherBackdrop.classList.add('active');
            refreshGauge();
            renderRewards(currentRewardCategory);
        });
        // Historique : "Mes bons"
        const vouchersModal = setupSheet('vouchers-modal', 'vouchers-backdrop');
        const btnMyVouchers = document.getElementById('btn-my-vouchers');
        if (vouchersModal && btnMyVouchers) {
            const list = document.getElementById('vouchers-list');
            btnMyVouchers.addEventListener('click', () => {
                const vouchers = store.get('vouchers', []);
                list.innerHTML = '';
                if (vouchers.length === 0) {
                    list.innerHTML = '<li class="voucher-empty">Aucun bon pour le moment.</li>';
                }
                vouchers.forEach((v) => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${escapeHtml(v.name)}</strong>${escapeHtml(v.offer)}<br><code>${escapeHtml(v.code)}</code> <small>· ${escapeHtml(new Date(v.date).toLocaleDateString('fr-FR'))}</small>`;
                    list.appendChild(li);
                });
                vouchersModal.open();
            });
            document.getElementById('btn-close-vouchers').addEventListener('click', vouchersModal.close);
        }

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
                    toast("Impossible d'accéder à la caméra. Vérifie l'autorisation du navigateur (HTTPS ou localhost requis).");
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
                        toast("La caméra n'est pas encore prête, réessaie dans un instant.");
                        return;
                    }
                    const photos = [photo, ...store.get('photos', [])].slice(0, 12);
                    const saved = store.set('photos', photos);
                    const total = getPoints() + POINTS_PER_PHOTO;
                    if (saved) store.set('points', total);
                    closeCamera();
                    toast(saved
                        ? `Photo enregistrée ! +${POINTS_PER_PHOTO} points (total : ${total}).`
                        : "Photo prise, mais l'espace de stockage de l'appareil est plein : elle n'a pas été enregistrée.");
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
    const friendProfileSheet = document.getElementById('friend-profile-sheet');
    const friendsListEl = document.querySelector('.friends-list-container');

    if (friendsListEl && friendProfileSheet) {
        const friendSheet = setupSheet('friend-profile-sheet', 'friend-profile-backdrop');
        const fpAlbumGrid = document.getElementById('fp-album-grid');

        friendsListEl.querySelectorAll('.friend-item').forEach((item) => makeActivable(item));

        // Délégation : fonctionne aussi pour les amis ajoutés dynamiquement
        friendsListEl.addEventListener('click', (e) => {
            const item = e.target.closest('.friend-item');
            if (!item) return;
            const name = item.querySelector('.friend-name').innerText;

            document.getElementById('fp-name').innerText = name;
            document.getElementById('fp-avatar').src = item.querySelector('img').src;

            // Statistiques de démonstration, stables pour un même ami
            document.getElementById('fp-visites').innerText = seeded(name + 'v', 15) + 1;
            document.getElementById('fp-trouvailles').innerText = seeded(name + 't', 30) + 5;
            document.getElementById('fp-points').innerText = seeded(name + 'p', 150) + 20;

            if (fpAlbumGrid) {
                fpAlbumGrid.innerHTML = '';
                let photos;
                if (name === "Lucas Martel") {
                    photos = ["assets/img/trouvaille1.jpg", "assets/img/tee_shirt_noir.jpg", "assets/img/la_canaille.webp"];
                } else if (name === "Inès Carvalho") {
                    photos = ["assets/img/ticket_tenu.jpg"];
                } else {
                    photos = ["assets/img/trouvaille2.jpg", "assets/img/stade.jpg"];
                }
                photos.forEach(photoUrl => {
                    fpAlbumGrid.insertAdjacentHTML('beforeend', `
                        <div class="photo-item">
                            <img src="${escapeHtml(photoUrl)}" alt="Trouvaille de ${escapeHtml(name)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
                        </div>
                    `);
                });
            }

            refreshIcons();
            friendSheet.open();
        });
    }

    // ==========================================
    // 11. PROFIL : nom et photo, partage, favoris, réglages
    // ==========================================
    const profileNameEl = document.getElementById('profile-name');
    const profileAvatarImg = document.querySelector('.avatar-large-wrapper img');
    if (profileNameEl && profileAvatarImg) {
        const defaultAvatar = profileAvatarImg.getAttribute('src');
        const applyProfile = () => {
            const profile = store.get('profile', {});
            profileNameEl.textContent = profile.name || 'Moi';
            profileAvatarImg.src = profile.avatar || defaultAvatar;
        };
        applyProfile();

        // Partager le profil / l'application
        const btnShare = document.getElementById('btn-share-profile');
        if (btnShare) {
            btnShare.addEventListener('click', () => shareLink('Plan Malin', "Découvre Plan Malin, la carte des bons plans et du réemploi à Nantes !"));
        }

        // Modifier le profil : pseudo et photo
        const editSheet = setupSheet('edit-profile-sheet', 'edit-profile-backdrop');
        const editName = document.getElementById('edit-name');
        const editAvatar = document.getElementById('edit-avatar');
        const editPreview = document.getElementById('edit-avatar-preview');
        let pendingAvatar = null;
        document.getElementById('btn-edit-profile').addEventListener('click', () => {
            const profile = store.get('profile', {});
            editName.value = profile.name || '';
            editPreview.src = profile.avatar || defaultAvatar;
            pendingAvatar = null;
            editAvatar.value = '';
            editSheet.open();
        });
        editAvatar.addEventListener('change', () => {
            const file = editAvatar.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                toast('Choisis un fichier image.');
                return;
            }
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                // Recadrage carré 200 px pour garder un stockage léger
                const size = 200;
                const side = Math.min(img.width, img.height);
                const canvas = document.createElement('canvas');
                canvas.width = canvas.height = size;
                canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
                pendingAvatar = canvas.toDataURL('image/jpeg', 0.8);
                editPreview.src = pendingAvatar;
                URL.revokeObjectURL(url);
            };
            img.onerror = () => { URL.revokeObjectURL(url); toast("Impossible de lire cette image."); };
            img.src = url;
        });
        document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const profile = store.get('profile', {});
            const name = editName.value.trim().slice(0, 30);
            const next = { name, avatar: pendingAvatar || profile.avatar || null };
            if (store.set('profile', next)) {
                applyProfile();
                editSheet.close();
                toast('Profil mis à jour');
            } else {
                toast("Impossible d'enregistrer (stockage plein).");
            }
        });

        // Favoris : liste des lieux enregistrés depuis la carte
        const favContainer = document.getElementById('content-favoris');
        const renderFavorites = () => {
            if (!favContainer || typeof lieux === 'undefined') return;
            const keys = store.get('favorites', []);
            favContainer.innerHTML = '';
            const found = keys.map((k) => lieux.find((l) => `${l.name}|${l.address}` === k)).filter(Boolean);
            if (found.length === 0) {
                favContainer.innerHTML = '<p style="text-align: center; color: var(--text-grey); padding: 40px 20px; width: 100%; font-size: 1.1rem;">Aucun lieu favori pour le moment.<br><small>Appuie sur le cœur d\'une fiche de lieu sur la carte.</small></p>';
                return;
            }
            found.forEach((l) => {
                const row = document.createElement('div');
                row.className = 'favorite-item';
                row.innerHTML = `
                    <a class="fav-info" href="app.html?lieu=${encodeURIComponent(`${l.name}|${l.address}`)}" style="color:inherit; text-decoration:none;">
                        <strong>${escapeHtml(l.name)}</strong>
                        <small>${escapeHtml(l.category)} · ${escapeHtml(l.address)}</small>
                    </a>
                    <button type="button" class="fav-btn active" aria-label="Retirer ${escapeHtml(l.name)} des favoris"><i data-lucide="heart"></i></button>`;
                row.querySelector('button').addEventListener('click', () => {
                    store.set('favorites', store.get('favorites', []).filter((k) => k !== `${l.name}|${l.address}`));
                    renderFavorites();
                    toast('Retiré de tes favoris');
                });
                favContainer.appendChild(row);
            });
            refreshIcons();
        };
        renderFavorites();

        // Réglages : gestion des données enregistrées sur l'appareil
        const settingsSheet = setupSheet('settings-sheet', 'settings-backdrop');
        const settingsSummary = document.getElementById('settings-summary');
        const updateSummary = () => {
            settingsSummary.textContent = `${getPoints()} points · ${store.get('photos', []).length} photo(s) · ${store.get('favorites', []).length} favori(s) · ${store.get('friends', []).length} ami(s) ajouté(s) · ${store.get('suggestions', []).length} suggestion(s) · ${store.get('vouchers', []).length} bon(s)`;
        };
        document.getElementById('btn-settings').addEventListener('click', () => { updateSummary(); settingsSheet.open(); });
        document.getElementById('settings-clear-photos').addEventListener('click', () => {
            if (!window.confirm('Supprimer toutes tes photos ?')) return;
            localStorage.removeItem('pm_photos');
            toast('Photos supprimées');
            window.setTimeout(() => window.location.reload(), 700);
        });
        document.getElementById('settings-reset-all').addEventListener('click', () => {
            if (!window.confirm('Réinitialiser toutes les données de démonstration (points, photos, favoris, amis, bons, profil) ?')) return;
            Object.keys(localStorage).filter((k) => k.startsWith('pm_')).forEach((k) => localStorage.removeItem(k));
            toast('Données réinitialisées');
            window.setTimeout(() => window.location.reload(), 700);
        });
    }
});
