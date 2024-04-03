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

const restaurantNameh2 = document.createElement('h2');
const restaurantAddress = document.createElement('p');
const restaurantPostalCode = document.createElement('p');
const restaurantCity = document.createElement('p');
const restaurantPhone = document.createElement('p');
const restaurantCompany = document.createElement('p');

const allRestaurants = 'https://10.120.32.94/restaurant/api/v1/restaurants/'

const loginModal = document.getElementById("login-modal-id");
const registerModal = document.getElementById("register-modal-id");

const profileButton = document.getElementById("profile-button");
const logoutButton = document.getElementById("logout-button");

const passwordInput = document.querySelector("#login-password");
const usernameInput = document.querySelector("#login-username");

const incorrectPassword = document.querySelector("#incorrect-password");
incorrectPassword.style.paddingBottom = '1rem';

function displayRestaurantInfo(restaurant) {
  restaurantNameh2.innerHTML = restaurant.name;
  restaurantAddress.innerHTML = restaurant.address;
  restaurantPostalCode.innerHTML = restaurant.postalCode;
  restaurantCity.innerHTML = restaurant.city;
  restaurantPhone.innerHTML = restaurant.phone;
  restaurantCompany.innerHTML = restaurant.company;
}

function getAllRestaurants() {
  fetch(allRestaurants)
    .then(response => response.json())
    .then(data => {
      console.log(data[0]._id);
 
      for (let restaurant of data) {
        console.log(restaurant.address)
        let marker = L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]]).addTo(map);
        marker.bindPopup('')
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function displayWeeklyMenu(id) {
    const menuUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/en`;

  fetch(menuUrl)
    .then(response => {
      if (!response.ok) throw new Error('Failed to retrieve weekly menu');
      return response.json();
    })
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching weekly menu:', error);
    });
}

function displayDailyMenu(companyId) {
  const menuUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/daily/${companyId}/en`

  fetch(menuUrl)
    .then(response => {
      if(!response.ok) throw new Error('Failed to retrieve daily menu')
    })
    .then(data => {
      console.log(data)
    })
    .catch(error => {
      console.error('Error fetching daily menu:', error)
    })
}

const test = "6470d391cb12107db6fe24ef";
const t = 12;

getAllRestaurants();
displayWeeklyMenu(test);
displayDailyMenu(t);


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
    localStorage.setItem('loggedInUser', username);

    showUsername();
    profileButton.style.display = "block";
    logoutButton.style.display = "block";

    loginButton.style.display = "none";
    registerButton.style.display = "none";
    loginModal.style.display = "none";
    profileButton.innerHTML = username;

    } else {
      incorrectPassword.style.display = "block";
      passwordInput.style.borderColor = "red";
      usernameInput.style.borderColor = "red";

      console.error("Login failed!");
      return false;
    }
  }

function logout() {
  localStorage.removeItem("loggedInUser");
  profileButton.style.display = "none";
  logoutButton.style.display = "none";

  loginButton.style.display = "block";
  registerButton.style.display = "block";

  console.log("User logged out.");
}

function showUsername() {
  const username = localStorage.getItem("username");
  if (username) {
    console.log("Logged in as:", username);
  } else {
    console.log("No user logged in."); 
}
}

const registerForm = document.querySelector(".register-modal-content");
const loginForm = document.querySelector(".login-modal-content")

registerForm.addEventListener('submit', evt => {
    evt.preventDefault();

    const username = document.querySelector("#register-username").value;
    const password = document.querySelector("#register-password").value;

    createUser(username, password);

    // close modal
    registerModal.style.display = "none";
})

loginForm.addEventListener('submit', evt => {
    evt.preventDefault();

    const username = document.querySelector("#login-username").value;
    const password = document.querySelector("#login-password").value;

    incorrectPassword.style.display = "none";
    passwordInput.style.borderColor = "none";
    usernameInput.style.borderColor = "none";


    login(username, password);
});

logoutButton.addEventListener('click', function() {
    logout();
    console.log("User logged out.");
});

window.addEventListener("load", function() {
  let isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
      loginButton.style.display = "none";
      registerButton.style.display = "none";
      profileButton.style.display = "block";
      logoutButton.style.display = "block";
      profileButton.innerHTML = localStorage.getItem('loggedInUser');

      // Load the user's favoirte restaurant etc... here
  } else {
      loginButton.style.display = "block";
      registerButton.style.display = "block";
      profileButton.style.display = "none";
      logoutButton.style.display = "none";
      profileButton.style.innerHTML = "Profile";
  }
});
