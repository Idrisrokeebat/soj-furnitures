// --- Initialize Cart ---
// store items as { id?, name, price, quantity }
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/*
  addToCart can be called in two ways:
   - addToCart(productObject) where productObject has {id, name, price}
   - addToCart(name, price) legacy support for inline calls
  The function is safe to call on any page.
*/
function addToCart(a, b) {
  // normalize input
  let item;
  if (typeof a === 'object' && a !== null) {
    item = { id: a.id || null, name: a.name, price: Number(a.price), quantity: 1 };
  } else {
    // legacy: (name, price)
    item = { id: null, name: String(a), price: Number(b), quantity: 1 };
  }

  const existing = cart.find(ci => (ci.id && item.id && ci.id === item.id) || (ci.name === item.name && (!ci.id || !item.id)));
  if (existing) {
    existing.quantity = (existing.quantity || 0) + 1;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  // use a non-blocking feedback for mobile (avoid alert) — fallback to console
  try {
    // small toast could be implemented; fall back:
    updateCartCount();
  } catch (e) {
    console.log(`${item.name} added to cart`);
  }
}

// Expose globally so product.js and inline onclicks can call it
window.addToCart = addToCart;

// --- Update Navbar Cart Count ---
function updateCartCount() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, it) => sum + (it.quantity || 0), 0);

  // update every element with id 'cart-count' (support multiple pages)
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = totalItems;
  });
}

// --- Remove from Cart ---
// Accepts id (number) or name (string)
function removeFromCart(identifier) {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (identifier === undefined || identifier === null) return;

  if (typeof identifier === 'number' || /^\d+$/.test(String(identifier))) {
    // treat as id if item has id
    const id = Number(identifier);
    cart = cart.filter(item => item.id !== id);
  } else {
    const name = String(identifier);
    cart = cart.filter(item => item.name !== name);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  // refresh UI if on cart page
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
// Updates both the small cart list (#cart-items) and the table (#cart-table) if present.
function loadCartItems() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];

  // update list-based cart (cart.html uses #cart-items and #cart-total)
  const cartList = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");

  if (cartList) {
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
            Quantity: ${item.quantity} × #${item.price}
          </div>
          <div>
            <span class="fw-bold">#${(item.price * item.quantity).toFixed(2)}</span>
            <button class="btn btn-sm btn-danger ms-3" onclick="removeFromCart(${item.id !== null ? item.id : `'${item.name.replace(/'/g, "\\'")}'`})">Remove</button>
          </div>
        `;
        cartList.appendChild(li);
        total += item.price * item.quantity;
      });
    }

    if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2);
  }

  // update table-based cart (table in cart.html)
  const tbody = document.querySelector("#cart-table tbody");
  if (tbody) {
    tbody.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      const row = `
        <tr>
          <td>${item.name}</td>
          <td>#${item.price}</td>
          <td>${item.quantity}</td>
          <td>#${subtotal.toFixed(2)}</td>
          <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id !== null ? item.id : `'${item.name.replace(/'/g, "\\'")}'`}); loadCartItems();">Remove</button></td>
        </tr>`;
      tbody.insertAdjacentHTML("beforeend", row);
    });

    const cartTableTotal = document.getElementById("cart-total-table");
    // write table total into #cart-total (reuse element if present)
    const totalEl = document.getElementById("cart-total");
    if (cartTableTotal) cartTableTotal.textContent = "Total: $" + total.toFixed(2);
    if (totalEl) totalEl.textContent = total.toFixed(2);

    // enable/disable checkout button if present
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  }
}

// --- Checkout ---
// Simulates order processing, stores order summary in localStorage "orders",
// clears the cart on success and updates UI. Returns a Promise.
function showCheckoutMessage(msg, type) {
  const el = document.getElementById('checkoutAlert');
  if (el) {
    el.textContent = msg;
    el.className = ''; // reset classes
    if (type === 'success') el.classList.add('text-success');
    if (type === 'error') el.classList.add('text-danger');
    if (type === 'info') el.classList.add('text-muted');
    return;
  }
  // fallback
  console[type === 'error' ? 'error' : 'log'](msg);
}

function checkout() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart || cart.length === 0) {
    showCheckoutMessage('Your cart is empty. Add items before checking out.', 'error');
    return Promise.resolve({ success: false, reason: 'empty_cart' });
  }

  const total = cart.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);
  const order = {
    id: Date.now(),
    items: cart,
    total: Number(total.toFixed(2)),
    createdAt: new Date().toISOString()
  };

  // persist order
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // simulate processing
  showCheckoutMessage('Processing your order...', 'info');
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.disabled = true;

  return new Promise(resolve => {
    setTimeout(() => {
      // clear cart and update UI
      clearCart();
      showCheckoutMessage('✅ Order placed! Order ID: ' + order.id, 'success');
      resolve({ success: true, order });
    }, 1200); // simulate network delay
  });
}

// expose globally
window.checkout = checkout;

// --- Run on All Pages ---
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadCartItems();
});

// --- Delegated handler for static "Add" buttons ---
// This makes sure buttons like <button class="add-to-cart" data-name="..." data-price="...">Add</button>
// will call addToCart and update the badge even if they are static in HTML (index.html, shop samples).
document.addEventListener('click', (e) => {
  // find nearest button with target classes
  const btn = e.target.closest('button.add-to-cart, button.add-to-cart-modal');
  if (!btn) return;

  // prefer data attributes
  const name = btn.dataset.name;
  const price = btn.dataset.price;

  if (name && price) {
    // legacy name+price support
    addToCart(name, Number(price));
    updateCartCount();
    return;
  }

  // modal buttons may carry data-* attributes for the current product
  const id = btn.dataset.id;
  if (id && window.products) {
    const product = window.products ? window.products.find(p => String(p.id) === String(id)) : null;
    if (product) {
      addToCart(product);
      updateCartCount();
    }
  }

  // fallback: if button has JSON in data-product
  if (btn.dataset.product) {
    try {
      const p = JSON.parse(btn.dataset.product);
      addToCart(p);
      updateCartCount();
    } catch (err) {
      console.error('Invalid data-product JSON', err);
    }
  }
});
