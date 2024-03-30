"use strict";

const map = L.map("map").setView([60.1695, 24.9354], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let markers = [{ lat: 60.1695, lon: 24.9354, city: "Helsinki" }];

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

const loginModal = document.getElementById("login-modal-id");
const registerModal = document.getElementById("register-modal-id");

window.addEventListener("click", function (event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  } else if (event.target == registerModal) {
    registerModal.style.display = "none";
  }
});

const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", function () {
  console.log("click");
  loginModal.style.display = "block";
});

const registerButton = document.getElementById("register-button");

registerButton.addEventListener("click", function () {
  console.log("click");
  registerModal.style.display = "block";
});

window.addEventListener("load", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        map.setView([latitude, longitude], 13);
      },
      function (error) {
        console.log("Error getting current position:", error);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
});

function createUser(username, password) {
  if (localStorage.getItem(username)) {
    alert("Username already exists!");
    return;
  }

  localStorage.setItem(username, password);
  console.log("User created successfully!");
}

function login(username, password) {
  const storedPassword = localStorage.getItem(username);
  if (storedPassword === password) {
    console.log("Login successful!");
    return true;
  } else {
    console.error("Login failed!");
    return false;
  }
}


// Listen to form submission

const registerForm = document.querySelector(".register-modal-content");
const loginForm = document.querySelector(".login-modal-content")

registerForm.addEventListener('submit', evt => {
    evt.preventDefault();

    const username = document.querySelector("#register-username").value;
    const password = document.querySelector("#register-password").value;

    createUser(username, password);
})

loginForm.addEventListener('submit', evt => {
    evt.preventDefault();

    const username = document.querySelector("#login-username").value;
    const password = document.querySelector("#login-password").value;

    login(username, password);
});

