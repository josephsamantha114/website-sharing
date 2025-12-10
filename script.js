const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
});

// ===== NEW ABOUT US POPUP =====
const aboutUsLink = document.getElementById('about-btn');
const aboutPopup = document.querySelector('.about-popup');
const aboutCloseBtn = document.querySelector('.about-close');

aboutUsLink.addEventListener('click', (e) => {
    e.preventDefault(); // prevent default anchor behavior
    aboutPopup.classList.add('active');
});

aboutCloseBtn.addEventListener('click', () => {
    aboutPopup.classList.remove('active');
});

// Close About Us popup when clicking outside the box
aboutPopup.addEventListener('click', (e) => {
    if (e.target === aboutPopup) {
        aboutPopup.classList.remove('active');
    }
});

// --- Services popup ---
const servicesPopup = document.querySelector('.services-popup');
const servicesClose = document.querySelector('.services-close');
const serviceLink = document.querySelector('.services-link'); // ← correspond à la classe HTML

// Ouvrir le popup services
serviceLink.addEventListener('click', (e) => {
    e.preventDefault(); // empêche le lien de naviguer
    servicesPopup.classList.add('active');
});

// Fermer le popup
servicesClose.addEventListener('click', () => {
    servicesPopup.classList.remove('active');
});

// --- Leaflet Map ---
const mapPopup = document.querySelector('.map-popup');
const mapClose = document.querySelector('.map-close');
const viewMapButtons = document.querySelectorAll('.view-map');
let map;

viewMapButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const lat = parseFloat(btn.getAttribute('data-lat'));
        const lng = parseFloat(btn.getAttribute('data-lng'));

        mapPopup.classList.add('active');

        if (!map) {
            map = L.map('map').setView([lat, lng], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
        } else {
            map.setView([lat, lng], 16);
        }

        // Supprimer les anciens marqueurs et routes
        map.eachLayer(layer => {
            if(layer instanceof L.Marker || layer instanceof L.Routing.Control) {
                map.removeLayer(layer);
            }
        });

        // Ajouter un marqueur pour le don
        L.marker([lat, lng]).addTo(map);

        // Obtenir la position de l’utilisateur
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                // Ajouter la route depuis l'utilisateur vers le don
                L.Routing.control({
                    waypoints: [
                        L.latLng(userLat, userLng),
                        L.latLng(lat, lng)
                    ],
                    routeWhileDragging: false
                }).addTo(map);
            }, () => {
                alert("Impossible de récupérer votre position");
            });
        } else {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    });
});

// Fermer le popup map
mapClose.addEventListener('click', () => {
    mapPopup.classList.remove('active');
    // Supprimer toutes les couches (marqueurs et routes) pour réinitialiser la carte
    map.eachLayer(layer => {
        if(layer instanceof L.Marker || layer instanceof L.Routing.Control) {
            map.removeLayer(layer);
        }
    });
});
