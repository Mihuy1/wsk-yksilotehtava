'use strict';

const map = L.map('map').setView([60.1695, 24.9354], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let markers = [{lat: 60.1695, lon: 24.9354, city: 'Helsinki'}];

const allRestaurants = 'https://10.120.32.94/restaurant/api/v1/restaurants/';

const allRestaurantsArray = [];

const loginModal = document.getElementById('login-modal-id');
const registerModal = document.getElementById('register-modal-id');

const profileButton = document.getElementById('profile-button');
const logoutButton = document.getElementById('logout-button');

const passwordInput = document.querySelector('#login-password');
const usernameInput = document.querySelector('#login-username');

const favoriteRestaurants =
  JSON.parse(localStorage.getItem('favoriteRestaurants')) || {};

const incorrectPassword = document.querySelector('#incorrect-password');
const registerIncorrectPassword = document.querySelector(
  '#register-incorrect-password'
);

registerIncorrectPassword.style.color = 'red';
incorrectPassword.style.color = 'red';

incorrectPassword.style.paddingBottom = '1rem';

function createButton(classes, innerHTML, pointerEvents = 'auto') {
  const button = document.createElement('button');
  classes.forEach((className) => button.classList.add(className));
  button.innerHTML = innerHTML;
  button.style.pointerEvents = pointerEvents;
  return button;
}

function createTextElement(type, textContent) {
  const element = document.createElement(type);
  element.textContent = textContent;
  return element;
}

function createPopupContent() {
  return document.createElement('div');
}

function createAndAppendChildren(parent, children) {
  children.forEach((child) => parent.appendChild(child));
  return parent;
}

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
  }
}

async function displayRestaurantsOnStart() {
  const data = await fetchData(allRestaurants);

  displayRestaurants(data);
}

displayRestaurantsOnStart();

async function displayRestaurantInfoOnClick(id, marker) {
  const url = 'https://10.120.32.94/restaurant/api/v1/restaurants/' + id;

  const restaurant = await fetchData(url);

  const name = createTextElement('h2', `${restaurant.name}`);
  const phone = createTextElement('p', `Phone: ${restaurant.phone}`);
  const city = createTextElement('p', `City: ${restaurant.city}`);
  const address = createTextElement('p', `Address: ${restaurant.address}`);
  const postalCode = createTextElement(
    'p',
    `Postal code: ${restaurant.postalCode}`
  );
  const company = createTextElement('p', `Company: ${restaurant.company}`);

  const fakeButton = createButton(
    ['right-button', 'arrow-button'],
    '<i class="arrow right"></i>',
    'none'
  );
  const dailyButton = createButton(
    ['left-button', 'arrow-button'],
    '<i class="arrow left"></i>'
  );
  dailyButton.addEventListener('click', function (event) {
    event.stopPropagation();
    displayDailyMenuOnClick(marker, id);
  });

  dailyButton.addEventListener('click', function (event) {
    event.stopPropagation();
    displayDailyMenuOnClick(marker, id);
  });

  const content = createPopupContent();
  const div = createPopupContent();
  const buttonDiv = createPopupContent();
  buttonDiv.classList.add('marker-popup');

  createAndAppendChildren(buttonDiv, [dailyButton, fakeButton]);
  createAndAppendChildren(div, [
    name,
    phone,
    city,
    address,
    postalCode,
    company,
  ]);
  createAndAppendChildren(content, [buttonDiv, div]);

  marker.bindPopup(content).openPopup();
}

/*async function displayDailyMenuOnClick(marker, id) {
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

  const weeklyButton = createButton(
    ['right-button', 'arrow-button'],
    '<i class="arrow left"></i>'
  );

  weeklyButton.addEventListener('click', function (event) {
    event.stopPropagation();
    displayWeeklyMenuOnClick(marker, id);
  });
  const favoriteButton = createButton(
    ['favorite-button', 'themed-button'],
    'Favorite'
  );

  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    let favoriteRestaurants =
      JSON.parse(localStorage.getItem('favoriteRestaurants')) || {};
    if (!favoriteRestaurants[loggedInUser]) {
      favoriteRestaurants[loggedInUser] = [];
    }
    if (favoriteRestaurants[loggedInUser].includes(id)) {
      favoriteButton.style.backgroundColor = 'green';
    }
    favoriteButton.addEventListener('click', function () {
      if (!favoriteRestaurants[loggedInUser].includes(id)) {
        favoriteRestaurants[loggedInUser].push(id);
        marker._icon.classList.add('huechange');
        favoriteButton.style.backgroundColor = 'green';
      } else {
        const index = favoriteRestaurants[loggedInUser].indexOf(id);
        if (index !== -1) {
          favoriteRestaurants[loggedInUser].splice(index, 1);
          marker._icon.classList.remove('huechange');
          favoriteButton.style.backgroundColor = '#eb5e28';
        }
      }
      localStorage.setItem(
        'favoriteRestaurants',
        JSON.stringify(favoriteRestaurants)
      );
    });
  } else {
    console.error('You have to be logged in to favorite a restaurant.');
  }

  const popupContent = createPopupContent();
  const infoButton = createButton(
    ['right-button', 'arrow-button'],
    '<i class="arrow right"></i>'
  );

  infoButton.addEventListener('click', function (event) {
    console.log('click');
    event.stopPropagation();
    displayRestaurantInfoOnClick(id, marker);
  });

  const div = createPopupContent();
  div.classList.add('marker-popup');

  createAndAppendChildren(div, [weeklyButton, infoButton]);
  createAndAppendChildren(popupContent, [div]);

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
        createAndAppendChildren(popupContent, [nameElement, priceElement]);
      }
      popupContent.appendChild(favoriteButton);
      marker.bindPopup(popupContent, {className: 'custom-style'}).openPopup();
    }
  }
  if (!foundDailyMenu) {
    const h2 = document.createElement('h2');
    h2.textContent = 'No menu available for today';
    div.appendChild(weeklyButton);
    div.appendChild(infoButton);
    createAndAppendChildren(div, [weeklyButton, infoButton]);

    createAndAppendChildren(popupContent, [div, h2, favoriteButton]);

    marker.bindPopup(popupContent, {className: 'custom-style'}).openPopup();
  }
}*/

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

  const weeklyButton = createButton(
    ['right-button', 'arrow-button'],
    '<i class="arrow left"></i>'
  );

  weeklyButton.addEventListener('click', function (event) {
    event.stopPropagation();
    displayWeeklyMenuOnClick(marker, id);
  });
  const favoriteButton = createButton(
    ['favorite-button', 'themed-button'],
    'Favorite'
  );

  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    let favoriteRestaurants =
      JSON.parse(localStorage.getItem('favoriteRestaurants')) || {};
    if (!favoriteRestaurants[loggedInUser]) {
      favoriteRestaurants[loggedInUser] = [];
    }
    if (favoriteRestaurants[loggedInUser].includes(id)) {
      favoriteButton.style.backgroundColor = 'green';
    }
    favoriteButton.addEventListener('click', async function () {
      if (!favoriteRestaurants[loggedInUser].includes(id)) {
        // Add the restaurant to favorites
        favoriteRestaurants[loggedInUser].push(id);
        marker._icon.classList.add('huechange');
        favoriteButton.style.backgroundColor = 'green';
        // Update the favorite restaurants in localStorage
        localStorage.setItem(
          'favoriteRestaurants',
          JSON.stringify(favoriteRestaurants)
        );
        // Update the favorite restaurant in the user's profile (optional)
        await updateFavoriteRestaurant(loggedInUser, id);
      } else {
        // Remove the restaurant from favorites
        const index = favoriteRestaurants[loggedInUser].indexOf(id);
        if (index !== -1) {
          favoriteRestaurants[loggedInUser].splice(index, 1);
          marker._icon.classList.remove('huechange');
          favoriteButton.style.backgroundColor = '#eb5e28';
          // Update the favorite restaurants in localStorage
          localStorage.setItem(
            'favoriteRestaurants',
            JSON.stringify(favoriteRestaurants)
          );
          // Update the favorite restaurant in the user's profile (optional)
          await updateFavoriteRestaurant(loggedInUser, '');
        }
      }
    });
  } else {
    console.error('You have to be logged in to favorite a restaurant.');
  }

  const popupContent = createPopupContent();
  const infoButton = createButton(
    ['right-button', 'arrow-button'],
    '<i class="arrow right"></i>'
  );

  infoButton.addEventListener('click', function (event) {
    console.log('click');
    event.stopPropagation();
    displayRestaurantInfoOnClick(id, marker);
  });

  const div = createPopupContent();
  div.classList.add('marker-popup');

  createAndAppendChildren(div, [weeklyButton, infoButton]);
  createAndAppendChildren(popupContent, [div]);

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
        createAndAppendChildren(popupContent, [nameElement, priceElement]);
      }
      popupContent.appendChild(favoriteButton);
      marker.bindPopup(popupContent, {className: 'custom-style'}).openPopup();
    }
  }
  if (!foundDailyMenu) {
    const h2 = document.createElement('h2');
    h2.textContent = 'No menu available for today';
    div.appendChild(weeklyButton);
    div.appendChild(infoButton);
    createAndAppendChildren(div, [weeklyButton, infoButton]);

    createAndAppendChildren(popupContent, [div, h2, favoriteButton]);

    marker.bindPopup(popupContent, {className: 'custom-style'}).openPopup();
  }
}

async function updateFavoriteRestaurant(username, restaurantId) {
  try {
    const response = await fetch(
      `https://10.120.32.94/restaurant/api/v1/users`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username,
          favoriteRestaurant: restaurantId,
        }),
      }
    );
    if (response.status === 200) {
      console.log('Favorite restaurant updated successfully');
      console.log(await response.json());
    }
    if (!response.ok) {
      throw new Error('Failed to update favorite restaurant');
    }
  } catch (error) {
    console.error('Error updating favorite restaurant:', error);
  }
}

async function displayWeeklyMenuOnClick(marker, id) {
  const menuUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/en`;

  const data = await fetchData(menuUrl);

  const content = document.createElement('div');

  const fakeButton = document.createElement('button');
  fakeButton.classList.add('left-button');
  fakeButton.classList.add('arrow-button');

  fakeButton.innerHTML = `<i class="arrow left"></i>`;

  fakeButton.style.pointerEvents = 'none';

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('marker-popup');

  const dailyButton = document.createElement('button');
  dailyButton.innerHTML = `<i class="arrow right"></i>`;
  dailyButton.classList.add('right-button');
  dailyButton.classList.add('arrow-button');

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

window.addEventListener('click', function (event) {
  if (event.target == loginModal) {
    loginModal.style.display = 'none';
  } else if (event.target == registerModal) {
    registerModal.style.display = 'none';
  }
});

const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', function () {
  showElement(loginModal);
});

const registerButton = document.getElementById('register-button');

registerButton.addEventListener('click', function () {
  showElement(registerModal);
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

const favoriteRestaurant = async (userId, restaurantId, userToken) => {
  try {
    const response = await fetch(
      `https://10.120.32.94/restaurant/api/v1/users`,
      {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          _id: userId,
          favouriteRestaurant: restaurantId,
        }),
      }
    );
    if (response.status === 200) {
      alert('Restaurant favorited successfully');
      console.log(response.status);
      const data = await response.json();
      console.log(data);
    }
  } catch (error) {
    console.error('Failed to favorite restaurant:', error);
  }
};

function showElement(element) {
  element.style.display = 'block';
}

function hideElement(element) {
  element.style.display = 'none';
}

const register = async (username, email, password) => {
  if (password.length < 5) {
    registerIncorrectPassword.innerHTML = 'Password too short!';

    showElement(registerIncorrectPassword);
    return;
  }

  try {
    const response = await fetch(
      'https://10.120.32.94/restaurant/api/v1/users',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      alert('User registered successfully');
    } else if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === 'Username or email already exists') {
        registerIncorrectPassword.textContent =
          'Username or email already exists';
        return;
      } else {
        registerIncorrectPassword.textContent = 'Something went wrong';
        return;
      }
    }
  } catch (error) {
    console.error('Register failed:', error);
  }
};

const login = async (username, password) => {
  try {
    const response = await fetch(
      'https://10.120.32.94/restaurant/api/v1/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);
      showElement(profileButton);
      showElement(logoutButton);

      hideElement(loginButton);
      hideElement(registerButton);
      hideElement(loginModal);
      profileButton.innerHTML = username;

      loginModal.style.display = 'none';
      localStorage.setItem('token', data.token);

      localStorage.setItem('loggedInUser', username);

      // Set favoriteRestaurant to an empty string if not already set
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (!favoriteRestaurants[loggedInUser]) {
        favoriteRestaurants[loggedInUser] = '';
        console.log('Favorite restaurants:', favoriteRestaurants);
      } else {
        console.log('Favorite restaurants already set', favoriteRestaurants);
      }
    } else {
      const errorData = await response.json();

      if (errorData.message === 'Incorrect username/password') {
        showElement(incorrectPassword);
        passwordInput.style.borderColor = 'red';
        usernameInput.style.borderColor = 'red';

        incorrectPassword.textContent = 'Incorrect username/password';
        showElement(incorrectPassword);

        console.error('Login failed!');
      }
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const logout = () => {
  const token = localStorage.getItem('token');

  if (token) {
    localStorage.removeItem('token');
    hideElement(profileButton);
    hideElement(logoutButton);

    showElement(loginButton);
    showElement(registerButton);

    localStorage.removeItem('loggedInUser');
    removeAllMarkers();
    window.location.reload();
  }
};

const registerForm = document.querySelector('.register-modal-content');
const loginForm = document.querySelector('.login-modal-content');

registerForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.querySelector('#register-email').value;
  const username = document.querySelector('#register-username').value;
  const password = document.querySelector('#register-password').value;

  register(username, email, password);
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

window.onload = async () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const response = await fetch(
        'https://10.120.32.94/restaurant/api/v1/users/token',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        profileButton.innerHTML = data.username;
        showElement(profileButton);
        showElement(logoutButton);

        hideElement(loginButton);
        hideElement(registerButton);
        console.log('User is logged in', data);
        localStorage.setItem('_id', data._id);
        localStorage.setItem('loggedInUser', data.username);

        if (!favoriteRestaurants[data.username]) {
          favoriteRestaurants[data.username] = [];
        } else {
          const restaurantData = await fetchData(allRestaurants);

          for (const restaurant of restaurantData) {
            if (favoriteRestaurants[data.username].includes(restaurant._id)) {
              for (const marker of markers) {
                if (marker.restaurantId === restaurant._id) {
                  marker._icon.classList.add('huechange');
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }
};

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

function displayRestaurants(restaurants) {
  removeAllMarkers();

  try {
    for (const restaurant of restaurants) {
      let marker = L.marker([
        restaurant.location.coordinates[1],
        restaurant.location.coordinates[0],
      ]).addTo(map);
      marker.bindTooltip(restaurant.name);

      markers.push(marker);

      marker.restaurantId = restaurant._id;

      marker.on('click', () => {
        displayDailyMenuOnClick(marker, restaurant._id);
      });
    }
  } catch (error) {
    console.error('Failed to filter map:', error);
  }
}

const citySelectElement = document.getElementById('city');
const companySelectElement = document.getElementById('company');
const filterButton = document.getElementById('filter-button');

function filterMap() {
  const cityValue = citySelectElement.value;
  const companyValue = companySelectElement.value;

  fetchData(allRestaurants).then((data) => {
    const filteredData = data.filter(
      (restaurant) =>
        (cityValue === 'All' || restaurant.city === cityValue) &&
        (companyValue === 'All' || restaurant.company === companyValue)
    );
    console.log('filtered data:', filteredData);
    displayRestaurants(filteredData);
  });
}

function removeAllMarkers() {
  for (let i = 0; i < markers.length; i++) {
    map.removeLayer(markers[i]);
  }

  markers.length = 0;
}

filterButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  console.log('Filter clicked!');
  filterMap();
});

function searchByName(arr, target) {
  const lowerCaseTarget = target.toLowerCase();
  return arr.filter((item) =>
    item.name.toLowerCase().includes(lowerCaseTarget)
  );
}

async function fillRestaurantsArray() {
  if (allRestaurantsArray.length === 0) {
    const data = await fetchData(allRestaurants);

    allRestaurantsArray.push(...data);
  }
}

fillRestaurantsArray();

const searchBar = document.getElementById('search-bar');

const resultsContainer = document.getElementById('resultsContainer');

searchBar.addEventListener('input', function (event) {
  resultsContainer.innerHTML = '';

  const target = event.target.value;

  // only perform the search if the search bar is not empty
  if (target.trim() !== '') {
    const results = searchByName(allRestaurantsArray, target);

    if (results.length > 0) {
      resultsContainer.style.display = 'block';

      results.forEach((result) => {
        const resultElement = document.createElement('div');
        resultElement.textContent = result.name;
        resultElement.classList.add('result-div');

        resultElement.addEventListener('click', function () {
          const marker = markers.find(
            (marker) => marker.restaurantId === result._id
          );

          if (marker) {
            displayDailyMenuOnClick(marker, result._id);
          }
        });

        resultsContainer.appendChild(resultElement);
      });
    } else {
      resultsContainer.style.display = 'none';
    }
  } else {
    resultsContainer.style.display = 'none';
  }
});
