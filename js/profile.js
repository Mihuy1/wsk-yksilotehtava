const profilePicture = document.getElementById('profile-picture');
const fileInput = document.getElementById('file-input');

const email = document.getElementById('change-email');
const username = document.getElementById('change-username');
const password = document.getElementById('change-password');

const form = document.querySelector('form');

window.onload = async () => {
  await setFieldData();
};

const setFieldData = async () => {
  try {
    const response = await fetch(
      'https://10.120.32.94/restaurant/api/v1/users/token',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      email.value = data.email;
      username.value = data.username;
      profilePicture.src = `https://10.120.32.94/restaurant/uploads/${data.avatar}`;
    } else if (response.status === 403) {
      console.error('Forbidden');
      window.location.href = 'main.html';
    }
  } catch (error) {
    console.error(error);
  }
};

function setProfileButtonToName() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    profileButton.innerHTML = loggedInUser;
  }
}

function resetProfileButton() {
  profileButton.innerHTML = 'Profile';
}

profilePicture.addEventListener('click', function () {
  fileInput.click();
});

fileInput.addEventListener('change', async function () {
  if (this.files && this.files[0]) {
    const formData = new FormData();
    formData.append('avatar', this.files[0]);

    // e.target.result is the base64 encoded image
    // send this to the server
    try {
      const response = await fetch(
        'https://10.120.32.94/restaurant/api/v1/users/avatar',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: formData,
        }
      );

      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error('Something went wrong', response);
        alert('Something went wrong, failed to update profile picture');
      }
    } catch (error) {
      console.error(error);
    }
  }
});

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const updatedEmail = email.value;
  const updatedUsername = username.value;
  const updatedPassword = password.value;

  let requestBody = {};

  if (password.value === '') {
    requestBody = {
      email: updatedEmail,
      username: updatedUsername,
    };
  } else {
    if (password.value.length < 5) {
      alert('Password must be at least 5 characters long');
      return;
    } else {
      requestBody = {
        email: updatedEmail,
        username: updatedUsername,
        password: updatedPassword,
      };
    }
  }

  try {
    const response = await fetch(
      'https://10.120.32.94/restaurant/api/v1/users',
      {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );
    if (response.status === 200) {
      alert('Profile updated successfully');
    } else if (response.status === 401) {
      console.error('Unauthorized');
      alert('Unauthorized');
    } else {
      console.error('Something went wrong');
      alert('Something went wrong');
    }
  } catch (error) {
    console.error(error);
  }
});
