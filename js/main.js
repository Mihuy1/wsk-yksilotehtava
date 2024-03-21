'use strict';

var map = L.map('map').setView([60.1695, 24.9354], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);




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