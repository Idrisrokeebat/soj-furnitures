// --- Initialize Cart ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// --- Update Navbar Cart Count ---
function updateCartCount() {
  const cartCount = document.querySelector("cartCount");
  if (cartCount) {
    const totalItems = cart.reduce((sum, existingItem) => sum + existingItem.quantity, 0);
    cartCount.textContent = totalItems;
  }
  else {
    cart.push({ name: productName, price: price, quantity: 1 });
  }
}

// --- Add to Cart Function ---
function addToCart(productName, price) {
  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: productName, price: price, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${productName} added to cart!`);
  updateCartCount();
}

// --- Remove from Cart ---
function removeFromCart(productName) {
  cart = cart.filter(item => item.name !== productName);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
  updateCartCount();
}

// --- Clear Cart ---
function clearCart() {
  localStorage.removeItem("cart");
  cart = [];
  loadCartItems();
  updateCartCount();
}

// --- Load Cart Items on Cart Page ---
function loadCartItems() {
  const cartList = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  if (!cartList) return; // run only on cart page

  cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = `<li class="list-group-item text-center">Your cart is empty.</li>`;
  } else {
    cart.forEach(item => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div>
          <strong>${item.name}</strong> <br>
          Quantity: ${item.quantity} × $${item.price}
        </div>
        <div>
          <span class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
          <button class="btn btn-sm btn-danger ms-3" onclick="removeFromCart('${item.name}')">Remove</button>
        </div>
      `;
      cartList.appendChild(li);
      total += item.price * item.quantity;
    });
  }

  cartTotal.textContent = total.toFixed(2);
}

// --- Run on All Pages ---
document= addEventListener("DOMContentLoaded", updateCartCount);
