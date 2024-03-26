document.addEventListener("DOMContentLoaded", function () {
  const profilePicture = document.getElementById("profile-picture");

  const fileInput = document.getElementById("file-input");

  profilePicture.addEventListener("mouseover", () => {});

  profilePicture.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        profilePicture.src = e.target.result;
        console.log(e.target.result);
      };

      reader.readAsDataURL(this.files[0]);
    }
  });
});
