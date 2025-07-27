// script.js

const uploadInput = document.getElementById("imageInput");
const removeBtn = document.getElementById("removeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const previewImage = document.getElementById("previewImage");

let uploadedImage = null;

// When user selects a file
uploadInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    previewImage.src = e.target.result;
    uploadedImage = file;
  };
  reader.readAsDataURL(file);
});

// When user clicks "Remove Background"
removeBtn.addEventListener("click", async () => {
  if (!uploadedImage) {
    alert("Please upload an image first.");
    return;
  }

  const formData = new FormData();
  formData.append("image", uploadedImage);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/remove-background/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to remove background");

    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);

    previewImage.src = objectURL;

    // Enable download
    downloadBtn.disabled = false;
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = objectURL;
      a.download = "no-background.png";
      a.click();
    };
  } catch (err) {
    alert("An error occurred while removing the background.");
    console.error(err);
  }
});
