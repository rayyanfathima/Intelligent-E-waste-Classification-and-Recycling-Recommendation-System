// ================================
// AUTH CHECK
// ================================

// ================================
// DOM ELEMENTS
// ================================
const uploadZone = document.getElementById("uploadZone");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");
const removeImage = document.getElementById("removeImage");
const analyzeBtn = document.getElementById("analyzeBtn");
const loading = document.getElementById("loading");
const resultsCards = document.querySelectorAll(".results");
const logoutBtn = document.getElementById("logoutBtn");

// ================================
// LOGOUT
// ================================
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedIn");
        window.location.href = "login.html";
    });
}

// ================================
// UPLOAD HANDLERS
// ================================
uploadZone.addEventListener("click", () => imageInput.click());

uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("dragover");
});

uploadZone.addEventListener("dragleave", () => {
    uploadZone.classList.remove("dragover");
});

uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
        handleImageUpload(file);
    }
});

imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

removeImage.addEventListener("click", () => {
    imagePreview.classList.remove("active");
    imageInput.value = "";
    analyzeBtn.disabled = true;
    hideResults();
});

function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        imagePreview.classList.add("active");
        analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

// ================================
// BACKEND CONNECTION
// ================================
analyzeBtn.addEventListener("click", function () {

    const file = imageInput.files[0];

    if (!file) {
        alert("Please select an image first!");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);

    loading.classList.add("active");
    analyzeBtn.disabled = true;
    hideResults();

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {

    loading.classList.remove("active");
    analyzeBtn.disabled = false;

    if (data.error) {
        alert(data.error);
        return;
    }

    const classificationCard = document.getElementById("classificationCard");
    const materialsCard = document.getElementById("materialsCard");
    const recommendationsCard = document.getElementById("recommendationsCard");
    const impactCard = document.getElementById("impactCard");

    // Always show classification
    classificationCard.classList.add("active");

    // If NOT e-waste → hide other cards
    if (data.category === "Not an E-Waste Item") {

        materialsCard.classList.remove("active");
        recommendationsCard.classList.remove("active");
        impactCard.classList.remove("active");

    } else {

        // Show all for real e-waste
        materialsCard.classList.add("active");
        recommendationsCard.classList.add("active");
        impactCard.classList.add("active");

    }

    document.getElementById("categoryResult").textContent = data.category || "Unknown";
    document.getElementById("confidenceText").textContent = (data.confidence || 0) + "%";
    document.getElementById("confidenceFill").style.width = (data.confidence || 0) + "%";

    if (data.category !== "Not an E-Waste Item") {
        document.getElementById("totalValue").textContent = "₹" + data.estimated_value;
    } else {
        document.getElementById("totalValue").textContent = "";
    }

    const materialsList = document.getElementById("materialsList");
    if (data.category !== "Not an E-Waste Item" && data.materials && data.materials.length > 0) {
        materialsList.innerHTML = data.materials.map(mat => `
            <div class="material-item">
                <span class="material-name">${mat}</span>
            </div>
        `).join("");
    } else {
        materialsList.innerHTML = "<p>No material data available</p>";
    }

    const recommendationsList = document.getElementById("recommendationsList");
    if (data.recommendations && Array.isArray(data.recommendations)) {
        recommendationsList.innerHTML = data.recommendations.map(rec => `
            <div class="recommendation">
                <div class="recommendation-text">
                    ${rec.name}
                    ${rec.link ? `<br><a href="${rec.link}" target="_blank">Open Location</a>` : ""}
                </div>
            </div>
        `).join("");
    } else {
        recommendationsList.innerHTML = "<p>No recommendations available</p>";
    }

})
    .catch(error => {
        loading.classList.remove("active");
        analyzeBtn.disabled = false;
        console.error("Error:", error);
        alert("Server not responding. Make sure backend is running.");
    });
});

function hideResults() {
    resultsCards.forEach(card => card.classList.remove("active"));
}