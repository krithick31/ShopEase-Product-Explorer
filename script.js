
// ==============================
// API CONFIGURATION
// ==============================

const API_URL = "https://dummyjson.com/products?limit=0";

// HTML Elements
const productContainer = document.getElementById("productContainer");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const retryBtn = document.getElementById("retryBtn");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const productCount = document.getElementById("productCount");

// Store all products
let allProducts = [];


// ==============================
// FETCH PRODUCTS FROM API
// ==============================

async function fetchProducts() {

    loading.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    productContainer.innerHTML = "";
    productCount.textContent = "Loading products...";

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        allProducts = data.products;

        // Hide loading animation
        loading.classList.add("hidden");

        // Load categories
        loadCategories();

        // Display products
        displayProducts(allProducts);

    } catch (error) {

        console.error("API Error:", error);

        loading.classList.add("hidden");
        errorMessage.classList.remove("hidden");
        productCount.textContent = "Unable to load products.";

    }
}


// ==============================
// LOAD CATEGORIES
// ==============================

function loadCategories() {

    const categories = [
        ...new Set(allProducts.map(product => product.category))
    ];

    categoryFilter.innerHTML =
        '<option value="all">All Categories</option>';

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category
            .replace(/-/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());

        categoryFilter.appendChild(option);

    });

}


// ==============================
// DISPLAY PRODUCTS
// ==============================

function displayProducts(products) {

    productContainer.innerHTML = "";

    productCount.textContent =
        `Showing ${products.length} of ${allProducts.length} products`;

    if (products.length === 0) {

        productContainer.innerHTML = `
            <p class="no-products">
                No products found. Try another search!
            </p>
        `;

        return;
    }

    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        const image = product.thumbnail || "";

        const safeImage = image.replace(/&/g, "&amp;")
                               .replace(/"/g, "&quot;");

        card.innerHTML = `
            <div class="product-image">
                <img
                    src="${safeImage}"
                    alt="Product image"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h3>${escapeHTML(product.title)}</h3>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-rating">
                    ⭐ ${product.rating} / 5
                </div>

                <div class="product-bottom">

                    <span class="product-price">
                        $${product.price}
                    </span>

                    <button class="product-btn">
                        View Details
                    </button>

                </div>

            </div>
        `;

        productContainer.appendChild(card);

    });

}


// ==============================
// SAFE TEXT DISPLAY
// ==============================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


// ==============================
// SEARCH PRODUCTS
// ==============================

function searchProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const selectedCategory = categoryFilter.value;

    const filteredProducts = allProducts.filter(product => {

        const matchesSearch =
            product.title.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    displayProducts(filteredProducts);

}


// ==============================
// EVENT LISTENERS
// ==============================

// Search while typing
searchInput.addEventListener("input", searchProducts);

// Filter by category
categoryFilter.addEventListener("change", searchProducts);

// Retry API request
retryBtn.addEventListener("click", fetchProducts);


// ==============================
// INITIALIZE WEBSITE
// ==============================

fetchProducts();
