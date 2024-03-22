'use strict';

const map = L.map('map').setView([60.1695, 24.9354], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let markers = [
    { lat: 60.1695, lon: 24.9354, city: 'Helsinki' },
];

const marker = L.marker([60.1695, 24.9354]).addTo(map);

function clearMarkers() {
    for (let marker of markers) {
       map.removeLayer(marker);
    }
}

function addMarkers(filteredMarkers) {
    for (let marker of filteredMarkers) {
        L.marker([marker.lat, market.lon]).addTo(map);
    }
}

let foodMenu = `
    <h2>Restaurant's Weekly Menu</h2>
    <ul>
        <li>Monday: Pasta Primavera</li>
        <li>Tuesday: Chicken Marsala</li>
        <li>Wednesday: Grilled Salmon</li>
        <li>Thursday: Beef Tacos</li>
        <li>Friday: Margherita Pizza</li>
        <li>Saturday: Shrimp Paella</li>
        <li>Sunday: BBQ Ribs</li>
    </ul>
`;

marker.bindPopup(foodMenu);

const modal = document.getElementById('login-modal-id');
window.onclick = function() {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', function() {
        console.log('click');
        modal.style.display = "block";
}
);

const registerButton = document.getElementById('register-button');

registerButton.addEventListener('click', function() {
        console.log('click');
        modal.style.display = "block";
}
);

window.addEventListener('load', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            map.setView([latitude, longitude], 13);
        }, function(error) {
            console.log('Error getting current position:', error);
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}); 