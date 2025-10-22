const products = [
  { id: 1, name: "Modern Chair", price: 120000, category: "chair", image: "images/chair1.jpg" },
  { id: 2, name: "Wooden Table", price: 300000, category: "table", image: "images/table1.jpg" },
  { id: 3, name: "Luxury Sofa", price: 700000, category: "sofa", image: "images/sofa1.jpg" },
  { id: 4, name: "Office Desk", price: 250000, category: "table", image: "images/desk1.jpg" },
  { id: 5, name: "Dining Chair", price: 150000, category: "chair", image: "images/chair2.jpg" },
  { id: 6, name: "Recliner Sofa", price: 800000, category: "sofa", image: "images/sofa2.jpg" },
  { id: 7, name: "Coffee Table", price: 200000, category: "table", image: "images/table2.jpg" },
  { id: 8, name: "Armchair", price: 180000, category: "chair", image: "images/chair3.jpg" },
  { id: 9, name: "Sectional Sofa", price: 900000, category: "sofa", image: "images/sofa3.jpg" },
  { id: 10, name: "Bedside Table", price: 220000, category: "table", image: "images/table3.jpg" },
  { id: 11, name: "Dining Table", price: 450000, category: "table", image: "images/table4.jpg" },
  { id: 12, name: "Luxury Cabinet", price: 499000, category: "cabinet", image: "images/cabinet2.jpg" },
  { id: 13, name: "Modern Bed", price: 499000, category: "bed", image: "images/bed2.jpg" },
  // ...add more products
];

let filtered = [...products];
let itemsPerPage = 6;
let currentPage = 1;

function displayProducts() {
  // compute slice for pagination
  const end = currentPage * itemsPerPage;
  const displayItems = filtered.slice(0, end);

  const container = document.getElementById("product-list");
  if (!container) return; // guard when script runs on pages without product list

  container.innerHTML = "";

  displayItems.forEach(p => {
    // add data-id for remove/identify later and pass product object to addToCart
    const html = `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${p.image}" class="card-img-top" alt="${p.name}" style="object-fit:cover; height:200px;">
          <div class="card-body d-flex flex-column">
            <h5 class="mb-2">${p.name}</h5>
            <p class="mb-3">#${p.price}</p>
            <div class="mt-auto">
              <button class="btn btn-sm btn-success add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>`;
    container.insertAdjacentHTML("beforeend", html);
  });

  // attach click handlers to new buttons (safer than inline JSON)
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const product = products.find(x => x.id === id);
      if (product && window.addToCart) {
        // call global addToCart API (cart.js provides it)
        window.addToCart(product);
      }
    });
  });

  // Hide Load More button if all shown (guard)
  const loadMoreBtn = document.getElementById("loadMore");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = displayItems.length >= filtered.length ? "none" : "block";
  }
}

function applyFilters() {
  const searchEl = document.getElementById("search");
  const categoryEl = document.getElementById("categoryFilter");
  const sortEl = document.getElementById("sortPrice");

  const search = searchEl ? searchEl.value.toLowerCase() : "";
  const category = categoryEl ? categoryEl.value : "";
  const sort = sortEl ? sortEl.value : "";

  filtered = products.filter(p => 
    p.name.toLowerCase().includes(search) &&
    (category === "" || p.category === category)
  );

  if (sort === "low-high") filtered.sort((a,b) => a.price - b.price);
  if (sort === "high-low") filtered.sort((a,b) => b.price - a.price);

  currentPage = 1;
  displayProducts();
}

// Safe event binding: only attach if elements exist (prevents errors on other pages)
document.addEventListener("DOMContentLoaded", () => {
  const searchEl = document.getElementById("search");
  const catEl = document.getElementById("categoryFilter");
  const sortEl = document.getElementById("sortPrice");
  const loadMore = document.getElementById("loadMore");

  if (searchEl) searchEl.addEventListener("input", applyFilters);
  if (catEl) catEl.addEventListener("change", applyFilters);
  if (sortEl) sortEl.addEventListener("change", applyFilters);
  if (loadMore) loadMore.addEventListener("click", () => {
    currentPage++;
    displayProducts();
  });

  // initial render if product-list exists
  displayProducts();
});
