const PRODUCTS = [
  { id: "p1", name: "Taza de cerámica", price: 18.00, emoji: "☕" },
  { id: "p2", name: "Vela de soja", price: 14.50, emoji: "🕯️" },
  { id: "p3", name: "Bolsa de lino", price: 22.00, emoji: "👜" },
  { id: "p4", name: "Cuaderno artesanal", price: 12.00, emoji: "📓" },
  { id: "p5", name: "Manta de lana", price: 45.00, emoji: "🧶" },
  { id: "p6", name: "Set de té", price: 32.00, emoji: "🍵" },
];

const CART_KEY = "aurora_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",") + " €";
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = PRODUCTS.map((p) => `
    <div class="product-card">
      <div class="product-image">${p.emoji}</div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-price">${formatPrice(p.price)}</div>
        <button class="add-to-cart" data-id="${p.id}">Añadir al carrito</button>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.id);
      btn.textContent = "Añadido ✓";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "Añadir al carrito";
        btn.classList.remove("added");
      }, 1200);
    });
  });
}

function addToCart(id) {
  const cart = loadCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = loadCart();
  const items = Object.entries(cart);
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  const totalQty = items.reduce((sum, [, qty]) => sum + qty, 0);
  cartCount.textContent = totalQty;

  if (items.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
    cartTotal.textContent = formatPrice(0);
    return;
  }

  let total = 0;
  cartItems.innerHTML = items.map(([id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return "";
    total += product.price * qty;
    return `
      <div class="cart-item">
        <span class="cart-item-name">${product.emoji} ${product.name}</span>
        <span class="cart-item-qty">x${qty}</span>
        <button class="cart-item-remove" data-id="${id}">Quitar</button>
      </div>
    `;
  }).join("");

  cartTotal.textContent = formatPrice(total);

  cartItems.querySelectorAll(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
  });
}

function setupCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  const openCart = () => { drawer.classList.add("open"); overlay.classList.add("open"); };
  const closeCart = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); };

  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    const cart = loadCart();
    if (Object.keys(cart).length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    alert("Esta es una demo — no hay proceso de pago real conectado.");
  });
}

function setupNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  const msg = document.getElementById("formMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value;
    msg.textContent = `¡Gracias! Te hemos suscrito con ${email}.`;
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  setupCartDrawer();
  setupNewsletterForm();
});
