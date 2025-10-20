// js/products.js

const products = [
  { id: 1, name: "Modern Chair", price: 120, category: "chair", image: "images/chair1.jpg" },
  { id: 2, name: "Wooden Table", price: 300, category: "table", image: "images/table1.jpg" },
  { id: 3, name: "Luxury Sofa", price: 700, category: "sofa", image: "images/sofa1.jpg" },
  // ...add more products
];

let filtered = [...products];
let itemsPerPage = 6;
let currentPage = 1;

function displayProducts() {
  const start = 0;
  const end = currentPage * itemsPerPage;
  const displayItems = filtered.slice(0, end);

  const container = document.getElementById("product-list");
  container.innerHTML = "";

  displayItems.forEach(p => {
    const html = `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${p.image}" class="card-img-top" alt="${p.name}">
          <div class="card-body">
            <h5>${p.name}</h5>
            <p>$${p.price}</p>
            <button class="btn btn-sm btn-success" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
          </div>
        </div>
      </div>`;
    container.insertAdjacentHTML("beforeend", html);
  });

  // Hide Load More button if all shown
  document.getElementById("loadMore").style.display =
    displayItems.length >= filtered.length ? "none" : "block";
}

function applyFilters() {
  const search = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const sort = document.getElementById("sortPrice").value;

  filtered = products.filter(p => 
    p.name.toLowerCase().includes(search) &&
    (category === "" || p.category === category)
  );

  if (sort === "low-high") filtered.sort((a,b) => a.price - b.price);
  if (sort === "high-low") filtered.sort((a,b) => b.price - a.price);

  currentPage = 1;
  displayProducts();
}

document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("sortPrice").addEventListener("change", applyFilters);
document.getElementById("loadMore").addEventListener("click", () => {
  currentPage++;
  displayProducts();
});

document.addEventListener("DOMContentLoaded", () => {
  displayProducts();
});
