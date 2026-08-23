const MAIN_PRODUCT = { id: "pro20", name: "Pro 20+" };

const VARIANT_LABELS = {
  "1": "1 Frasco",
  "3": "3 Frascos",
  "6": "6 Frascos",
};

const CROSS_SELL = [
  { id: "cs1", name: "Colágeno Marino", price: 38000, emoji: "✨" },
  { id: "cs2", name: "Magnesio Nocturno", price: 27000, emoji: "🌙" },
  { id: "cs3", name: "Vitamina D3+K2", price: 22000, emoji: "☀️" },
  { id: "cs4", name: "Omega-3 Algas", price: 33000, emoji: "🐟" },
];

const CART_KEY = "naturcalm_ar_cart";
let selectedVariant = "1";
let selectedPrice = 42000;
let quantity = 1;

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
  return "$" + Math.round(value).toLocaleString("es-AR");
}

/* Gallery */
function setupGallery() {
  const main = document.getElementById("galleryMain");
  document.querySelectorAll(".thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document.querySelectorAll(".thumb").forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      if (thumb.dataset.type === "img") {
        main.innerHTML = `<img src="${thumb.dataset.img}" alt="Pro 20+">`;
      } else {
        main.textContent = thumb.dataset.img;
      }
    });
  });
}

/* Variant selector */
function setupVariants() {
  const cards = document.querySelectorAll(".variant-card");
  cards.forEach((card) => {
    if (card.dataset.variant === selectedVariant) card.classList.add("selected");
    card.addEventListener("click", () => {
      cards.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedVariant = card.dataset.variant;
      selectedPrice = parseFloat(card.dataset.price);
      updateAddToCartPrice();
    });
  });
}

function updateAddToCartPrice() {
  document.getElementById("addToCartPrice").textContent = formatPrice(selectedPrice * quantity);
}

/* Quantity stepper */
function setupQuantity() {
  const qtyValue = document.getElementById("qtyValue");
  document.getElementById("qtyMinus").addEventListener("click", () => {
    if (quantity > 1) quantity--;
    qtyValue.textContent = quantity;
    updateAddToCartPrice();
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    quantity++;
    qtyValue.textContent = quantity;
    updateAddToCartPrice();
  });
}

/* Add to cart (main product) */
function setupAddToCart() {
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    const cart = loadCart();
    const key = `${MAIN_PRODUCT.id}-${selectedVariant}`;
    cart[key] = (cart[key] || 0) + quantity;
    saveCart(cart);
    renderCart();
    const btn = document.getElementById("addToCartBtn");
    const original = btn.innerHTML;
    btn.textContent = "Añadido al carrito ✓";
    setTimeout(() => { btn.innerHTML = original; }, 1400);
  });
}

/* Cross-sell grid */
function renderCrossSell() {
  const grid = document.getElementById("crossSellGrid");
  grid.innerHTML = CROSS_SELL.map((p) => `
    <div class="product-card">
      <div class="product-image">${p.emoji}</div>
      <div class="product-info-card">
        <h3>${p.name}</h3>
        <div class="product-price">${formatPrice(p.price)}</div>
        <button class="add-to-cart" data-id="${p.id}">Añadir al carrito</button>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cart = loadCart();
      cart[btn.dataset.id] = (cart[btn.dataset.id] || 0) + 1;
      saveCart(cart);
      renderCart();
      btn.textContent = "Añadido ✓";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "Añadir al carrito";
        btn.classList.remove("added");
      }, 1200);
    });
  });
}

function resolveCartLine(key) {
  if (key.startsWith(`${MAIN_PRODUCT.id}-`)) {
    const variant = key.split("-")[1];
    return {
      name: `${MAIN_PRODUCT.name} (${VARIANT_LABELS[variant] || variant})`,
      price: parseFloat(document.querySelector(`.variant-card[data-variant="${variant}"]`)?.dataset.price || 0),
      emoji: "🧪",
    };
  }
  const product = CROSS_SELL.find((p) => p.id === key);
  return product ? { name: product.name, price: product.price, emoji: product.emoji } : null;
}

function removeFromCart(key) {
  const cart = loadCart();
  delete cart[key];
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
  cartItems.innerHTML = items.map(([key, qty]) => {
    const line = resolveCartLine(key);
    if (!line) return "";
    total += line.price * qty;
    return `
      <div class="cart-item">
        <span class="cart-item-name">${line.emoji} ${line.name}</span>
        <span class="cart-item-qty">x${qty}</span>
        <button class="cart-item-remove" data-key="${key}">Quitar</button>
      </div>
    `;
  }).join("");

  cartTotal.textContent = formatPrice(total);

  cartItems.querySelectorAll(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.key));
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
  setupGallery();
  setupVariants();
  setupQuantity();
  setupAddToCart();
  renderCrossSell();
  renderCart();
  setupCartDrawer();
  setupNewsletterForm();
});
