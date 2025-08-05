const imageInput = document.getElementById("imageInput");
const previewArea = document.getElementById("previewArea");
const removeBtn = document.getElementById("removeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const dropArea = document.getElementById("dropArea");

let uploadedFile = null;
let processedImageURL = null;

// Preview uploaded image
if (imageInput && previewArea && removeBtn && downloadBtn) {
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) return;

        uploadedFile = file;
        removeBtn.disabled = false;

        const reader = new FileReader();
        reader.onload = (e) => {
            previewArea.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            downloadBtn.style.display = "none";
        };
        reader.readAsDataURL(file);
    });

    // Process image with API
    removeBtn.addEventListener("click", async () => {
        if (!uploadedFile) return;

        removeBtn.disabled = true;
        removeBtn.textContent = "Processing...";

        const formData = new FormData();
        formData.append("image", uploadedFile);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/remove-background/", {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error("Failed to process image");

            const blob = await response.blob();
            processedImageURL = URL.createObjectURL(blob);

            previewArea.innerHTML = `<img src="${processedImageURL}" alt="Processed">`;
            downloadBtn.href = processedImageURL;
            downloadBtn.style.display = "inline-block";

            removeBtn.textContent = "Remove Background";
            removeBtn.disabled = false;
        } catch (err) {
            alert("Error: " + err.message);
            removeBtn.textContent = "Remove Background";
            removeBtn.disabled = false;
        }
    });
}

// Drag & Drop
if (dropArea && previewArea && removeBtn && downloadBtn) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, e => e.preventDefault());
        document.body.addEventListener(eventName, e => e.preventDefault());
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'));
    });
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'));
    });

    dropArea.addEventListener('drop', e => {
        const file = e.dataTransfer.files[0];
        if (!file) return;

        uploadedFile = file;
        removeBtn.disabled = false;

        const reader = new FileReader();
        reader.onload = e => {
            previewArea.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            downloadBtn.style.display = "none";
        };
        reader.readAsDataURL(file);
    });
}

// Toggle mobile navigation menu on hamburger click
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".navbar nav");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}
