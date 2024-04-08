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

  const fakeButton = document.createElement('button');
  fakeButton.classList.add('right-button');

  fakeButton.innerHTML = `<i class="arrow right"></i>`;

  fakeButton.style.pointerEvents = 'none';

  const dailyButton = document.createElement('button');
  dailyButton.classList.add('left-button');
  dailyButton.innerHTML = `<i class="arrow left"></i>`;

  dailyButton.addEventListener('click', function (event) {
    event.stopPropagation();
    displayDailyMenuOnClick(marker, id);
  });

  const content = document.createElement('div');

  const div = document.createElement('div');

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('marker-popup');

  buttonDiv.append(dailyButton, fakeButton);
  div.append(name, phone, city, address, postalCode, company);
  content.appendChild(buttonDiv);
  content.appendChild(div);

  marker.bindPopup(content).openPopup();
}

async function displayDailyMenuOnClick(marker, id) {
  const menuUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/en`;

  let foundDailyMenu = false;

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
      for (const restaurant of data) {
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
  const distances = [];

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const data = await fetchData(allRestaurants);

        for (const restaurant of data) {
          const distance = vincentysDistance(
            latitude,
            longitude,
            restaurant.location.coordinates[1],
            restaurant.location.coordinates[0]
          );

          distances.push({distance, restaurant});
        }

        distances.sort((a, b) => a.distance - b.distance);

        const closestRestaurant = distances[0].restaurant;

        console.log('Closest restaurant:', closestRestaurant);

        console.log(
          closestRestaurant.location.coordinates[0],
          closestRestaurant.location.coordinates[1]
        );

        map.setView(
          [
            closestRestaurant.location.coordinates[1],
            closestRestaurant.location.coordinates[0],
          ],
          17
        );
      },
      function (error) {
        console.log('Error getting current position:', error);
      }
    );
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
});

function showElement(element) {
  element.style.display = 'block';
}

function hideElement(element) {
  element.style.display = 'none';
}

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
    showElement(profileButton);
    showElement(logoutButton);

    hideElement(loginButton);
    hideElement(registerButton);
    hideElement(loginModal);
    profileButton.innerHTML = username;

    loginModal.style.display = 'none';
    return true;
  } else {
    showElement(incorrectPassword);
    passwordInput.style.borderColor = 'red';
    usernameInput.style.borderColor = 'red';

    console.error('Login failed!');
    return false;
  }
}

function logout() {
  localStorage.removeItem('loggedInUser');

  hideElement(profileButton);
  hideElement(logoutButton);

  showElement(loginButton);
  showElement(registerButton);

  console.log('User logged out.');
}

function showUsername() {
  const username = localStorage.getItem('username');
  if (username) {
    console.log('Logged in as:', username);
    profileButton.textContent = username; // Set the button text to the username
    showElement(profileButton); // Show the profile button
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
});

logoutButton.addEventListener('click', function () {
  logout();
  console.log('User logged out.');
});

window.addEventListener('load', function () {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    hideElement(loginButton);
    hideElement(registerButton);

    showElement(profileButton);
    showElement(logoutButton);

    showUsername();

    profileButton.innerHTML = localStorage.getItem('loggedInUser');

    // Load the user's favoirte restaurant etc... here
  } else {
    showElement(loginButton);
    showElement(registerButton);

    hideElement(profileButton);
    hideElement(logoutButton);

    profileButton.style.innerHTML = 'Profile';
  }
});

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function vincentysDistance(lat1, lon1, lat2, lon2) {
  const a = 6378137;
  const b = 6356752.314245;
  const f = 1 / 298.257223563; // WGS-84 ellipsoid params
  const L = toRadians(lon2 - lon1);
  const U1 = Math.atan((1 - f) * Math.tan(toRadians(lat1)));
  const U2 = Math.atan((1 - f) * Math.tan(toRadians(lat2)));
  const sinU1 = Math.sin(U1);
  const cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2);
  const cosU2 = Math.cos(U2);

  let lambda = L;
  let lambdaP;
  let iterLimit = 100;
  let cosSqAlpha;
  let sigma;
  let cos2SigmaM;
  let cosSigma;
  let sinSigma;
  do {
    const sinLambda = Math.sin(lambda);
    const cosLambda = Math.cos(lambda);
    const sinSqSigma =
      cosU2 * sinLambda * (cosU2 * sinLambda) +
      (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) *
        (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda);
    sinSigma = Math.sqrt(sinSqSigma);
    if (sinSigma === 0) return 0; // co-incident points
    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
    sigma = Math.atan2(sinSigma, cosSigma);
    const sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
    cosSqAlpha = 1 - sinAlpha * sinAlpha;
    cos2SigmaM = cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha;
    const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    lambdaP = lambda;
    lambda =
      L +
      (1 - C) *
        f *
        sinAlpha *
        (sigma +
          C *
            sinSigma *
            (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
  } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

  if (iterLimit === 0) return NaN; // formula failed to converge

  const uSq = (cosSqAlpha * (a * a - b * b)) / (b * b);
  const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const deltaSigma =
    B *
    sinSigma *
    (cos2SigmaM +
      (B / 4) *
        (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
          (B / 6) *
            cos2SigmaM *
            (-3 + 4 * sinSigma * sinSigma) *
            (-3 + 4 * cos2SigmaM * cos2SigmaM)));
  const s = b * A * (sigma - deltaSigma);

  return s; // return distance in meters
}
