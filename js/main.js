'use strict';

const map = L.map('map').setView([60.1695, 24.9354], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let markers = [{lat: 60.1695, lon: 24.9354, city: 'Helsinki'}];

const allRestaurants = 'https://10.120.32.94/restaurant/api/v1/restaurants/';

const loginModal = document.getElementById('login-modal-id');
const registerModal = document.getElementById('register-modal-id');

const profileButton = document.getElementById('profile-button');
const logoutButton = document.getElementById('logout-button');

const passwordInput = document.querySelector('#login-password');
const usernameInput = document.querySelector('#login-username');

const incorrectPassword = document.querySelector('#incorrect-password');
incorrectPassword.style.paddingBottom = '1rem';

async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to retrieve data');
    }
    const data = await response.json();

    console.log('Data fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    alert(
      'Failed to retrieve data, make sure you are connected to the VPN / network'
    );
  }
}

async function displayRestaurantInfoOnClick(id, marker) {
  const url = 'https://10.120.32.94/restaurant/api/v1/restaurants/' + id;

  const restaurant = await fetchData(url);

  const name = document.createElement('h2');
  name.textContent = `${restaurant.name}`;

  const phone = document.createElement('p');
  phone.textContent = `Phone: ${restaurant.phone}`;

  const city = document.createElement('p');
  city.textContent = `City: ${restaurant.city}`;

  const address = document.createElement('p');
  address.textContent = `Address: ${restaurant.address}`;

  const postalCode = document.createElement('p');
  postalCode.textContent = `Postal code: ${restaurant.postalCode}`;

  const company = document.createElement('p');
  company.textContent = `Company: ${restaurant.company}`;

  const dailyButton = document.createElement('button');
  dailyButton.classList.add('left-button');
  dailyButton.innerHTML = `<i class="arrow left"></i>`;

  dailyButton.addEventListener('click', function (event) {
    event.stopPropagation();
    displayDailyMenuOnClick(marker, id);
  });

  const content = document.createElement('div');

  const div = document.createElement('div');
  div.append(dailyButton, name, phone, city, address, postalCode, company);
  content.appendChild(div);

  marker.bindPopup(div).openPopup();
}

async function displayDailyMenuOnClick(marker, id) {
  const menuUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/en`;

  const foundDailyMenu = false;

  const data = await fetchData(menuUrl);

  const date = new Date();
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const currentDayOfWeek = daysOfWeek[date.getDay()];

  const weeklyButton = document.createElement('button');
  weeklyButton.classList.add('right-button');
  weeklyButton.innerHTML = `<i class="arrow left"></i>`;

  weeklyButton.addEventListener('click', function (event) {
    event.stopPropagation();
    displayWeeklyMenuOnClick(marker, id);
  });

  const popupContent = document.createElement('div');
  const infoButton = document.createElement('button');
  infoButton.classList.add('left-button');
  infoButton.innerHTML = `<i class="arrow right"></i>`;
  infoButton.addEventListener('click', function (event) {
    console.log('click');
    event.stopPropagation();
    displayRestaurantInfoOnClick(id, marker);
  });

  const div = document.createElement('div');
  div.classList.add('marker-popup');

  div.appendChild(weeklyButton);
  div.appendChild(infoButton);
  popupContent.appendChild(div);

  for (const {date, courses} of data.days) {
    const dateArray = date.split(',');
    if (dateArray[0] === currentDayOfWeek) {
      const dayElement = document.createElement('h2');
      dayElement.textContent = currentDayOfWeek.toString();
      popupContent.appendChild(dayElement);
      foundDailyMenu = true;
      for (const {name, price} of courses) {
        const nameElement = document.createElement('p');
        nameElement.textContent = name;
        const priceElement = document.createElement('p');
        priceElement.innerHTML = `<b>${price}</b>`;
        popupContent.appendChild(nameElement);
        popupContent.appendChild(priceElement);
      }
      marker.bindPopup(popupContent, {className: 'custom-style'}).openPopup();
    }
  }
  if (!foundDailyMenu) {
    const h2 = document.createElement('h2');
    h2.textContent = 'No menu available for today';
    div.appendChild(weeklyButton);
    div.appendChild(infoButton);
    popupContent.appendChild(div);
    popupContent.appendChild(h2);
    marker.bindPopup(popupContent, {className: 'custom-style'}).openPopup();
  }
}

async function displayWeeklyMenuOnClick(marker, id) {
  const menuUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/en`;

  const data = await fetchData(menuUrl);

  const content = document.createElement('div');

  const fakeButton = document.createElement('button');
  fakeButton.classList.add('left-button');

  fakeButton.innerHTML = `<i class="arrow left"></i>`;

  // Change button style so that it indicates that it is not clickable
  fakeButton.style.pointerEvents = 'none';

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('marker-popup');

  const dailyButton = document.createElement('button');
  dailyButton.innerHTML = `<i class="arrow right"></i>`;
  dailyButton.classList.add('right-button');

  dailyButton.addEventListener('click', (evt) => {
    evt.stopPropagation();

    displayDailyMenuOnClick(marker, id);
  });

  buttonDiv.appendChild(fakeButton);
  buttonDiv.appendChild(dailyButton);
  content.appendChild(buttonDiv);

  for (const {date, courses} of data.days) {
    const dateArray = date.split(',');
    const headerElement = document.createElement('h2');
    headerElement.textContent = dateArray[0];
    content.appendChild(headerElement);

    for (const {name, price} of courses) {
      const nameElement = document.createElement('p');
      nameElement.textContent = name;

      const priceElement = document.createElement('p');
      priceElement.innerHTML = `<b>${price}</b>`;

      content.appendChild(nameElement);
      content.appendChild(priceElement);
    }
  }
  marker.bindPopup(content).openPopup();
}

async function getAllRestaurants() {
  fetch(allRestaurants)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      for (const restaurant of data) {
        console.log(restaurant.address);
        let marker = L.marker([
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0],
        ]).addTo(map);
        marker.bindTooltip(restaurant.name);

        marker.on('click', () => {
          displayDailyMenuOnClick(marker, restaurant._id);
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(
        'Failed to retrieve data, make sure you are connected to the VPN / network'
      );
    });
}

getAllRestaurants();

window.addEventListener('click', function (event) {
  if (event.target == loginModal) {
    loginModal.style.display = 'none';
  } else if (event.target == registerModal) {
    registerModal.style.display = 'none';
  }
});

const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', function () {
  console.log('click');
  loginModal.style.display = 'block';
});

const registerButton = document.getElementById('register-button');

registerButton.addEventListener('click', function () {
  console.log('click');
  registerModal.style.display = 'block';
});

window.addEventListener('load', function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        map.setView([latitude, longitude], 13);
      },
      function (error) {
        console.log('Error getting current position:', error);
      }
    );
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
});

function createUser(username, password) {
  if (localStorage.getItem(username)) {
    alert('Username already exists!');
    return;
  }

  localStorage.setItem(username, password);
  console.log('User created successfully!');
}

function login(username, password) {
  const storedPassword = localStorage.getItem(username);
  if (storedPassword === password) {
    console.log('Login successful!');
    localStorage.setItem('loggedInUser', username);

    showUsername();
    profileButton.style.display = 'block';
    logoutButton.style.display = 'block';

    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
    loginModal.style.display = 'none';
    profileButton.innerHTML = username;
  } else {
    incorrectPassword.style.display = 'block';
    passwordInput.style.borderColor = 'red';
    usernameInput.style.borderColor = 'red';

    console.error('Login failed!');
    return false;
  }
}

function logout() {
  localStorage.removeItem('loggedInUser');
  profileButton.style.display = 'none';
  logoutButton.style.display = 'none';

  loginButton.style.display = 'block';
  registerButton.style.display = 'block';

  console.log('User logged out.');
}

function showUsername() {
  const username = localStorage.getItem('username');
  if (username) {
    console.log('Logged in as:', username);
  } else {
    console.log('No user logged in.');
  }
}

const registerForm = document.querySelector('.register-modal-content');
const loginForm = document.querySelector('.login-modal-content');

registerForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const username = document.querySelector('#register-username').value;
  const password = document.querySelector('#register-password').value;

  createUser(username, password);

  // close modal
  registerModal.style.display = 'none';
});

loginForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const username = document.querySelector('#login-username').value;
  const password = document.querySelector('#login-password').value;

  incorrectPassword.style.display = 'none';
  passwordInput.style.borderColor = 'none';
  usernameInput.style.borderColor = 'none';

  login(username, password);

  loginModal.style.display = 'none';
});

logoutButton.addEventListener('click', function () {
  logout();
  console.log('User logged out.');
});

window.addEventListener('load', function () {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
    profileButton.style.display = 'block';
    logoutButton.style.display = 'block';
    profileButton.innerHTML = localStorage.getItem('loggedInUser');

    // Load the user's favoirte restaurant etc... here
  } else {
    loginButton.style.display = 'block';
    registerButton.style.display = 'block';
    profileButton.style.display = 'none';
    logoutButton.style.display = 'none';
    profileButton.style.innerHTML = 'Profile';
  }
});
