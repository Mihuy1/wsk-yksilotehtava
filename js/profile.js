const profilePicture = document.getElementById("profile-picture");
const fileInput = document.getElementById("file-input");

const username = document.getElementById("change-username");
const password = document.getElementById("change-password");

const form = document.querySelector("form");

function setProfileButtonToName() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    profileButton.innerHTML = loggedInUser;
  }
}

function resetProfileButton() {
  profileButton.innerHTML = "Profile";
}

window.addEventListener("load", function() {
  username.value = localStorage.getItem("loggedInUser");
  console.log(this.localStorage.getItem('loggedInUser'));
});

profilePicture.addEventListener("click", function () {
  fileInput.click();
});

fileInput.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      profilePicture.src = e.target.result;
      console.log(e.target.result);

      // Save the image to local storage
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        localStorage.setItem(loggedInUser + "_profilePicture", e.target.result);
      }
    };

    reader.readAsDataURL(this.files[0]);
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

    const updatedUsername = username.value;
    const updatedPassword = password.value;
  
    localStorage.setItem("loggedInUser", updatedUsername);
    localStorage.setItem(updatedUsername, updatedPassword);
    console.log("Updated username: " + updatedUsername);
    console.log("Updated password: " + updatedPassword);
  });

  window.addEventListener("beforeunload", function() {
    localStorage.setItem("isLoggedIn", "true");
  });
  
  window.addEventListener("load", function() {
    // Set profile picture if already set (from local storage based on username)
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const profilePicture = localStorage.getItem(loggedInUser + "_profilePicture");
      if (profilePicture) {
        document.getElementById("profile-picture").src = profilePicture;
      }
    }

  });