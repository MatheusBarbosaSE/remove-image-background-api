// script.js

const uploadInput = document.getElementById("imageInput");
const removeBtn = document.getElementById("removeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const previewImage = document.getElementById("previewImage");
const dropArea = document.getElementById("dropArea");

let uploadedImage = null;

// Handle file selection
uploadInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please upload a valid image file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    previewImage.src = e.target.result;
    uploadedImage = file;
  };
  reader.readAsDataURL(file);
});

// Handle "Remove Background" button click
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

    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);

    // Wait for image to load before enabling download
    previewImage.onload = () => {
      downloadBtn.disabled = false;
      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = objectURL;
        a.download = "no-background.png";
        a.click();
      };
    };

    previewImage.src = objectURL;

  } catch (err) {
    alert("An error occurred while removing the background.");
    console.error("Remove background error:", err);
  }
});

// Drag & Drop support
["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, e => e.preventDefault());
  dropArea.addEventListener(eventName, e => e.stopPropagation());
});

// Visual feedback
dropArea.addEventListener("dragover", () => {
  dropArea.classList.add("highlight");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("highlight");
});

// Handle drop
dropArea.addEventListener("drop", e => {
  dropArea.classList.remove("highlight");
  const file = e.dataTransfer.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    previewImage.src = event.target.result;
    uploadedImage = file;
  };
  reader.readAsDataURL(file);
});
