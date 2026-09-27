/* ============================================================
   RUCA STORE — CARRINHO, FAVORITOS, CUPOM E FRETE
   Tudo persistido em localStorage (demonstração, sem backend)
   ============================================================ */

const STORAGE_KEYS = {
  cart: "ruca_cart_v1",
  favorites: "ruca_favorites_v1",
  coupon: "ruca_coupon_v1",
  shipping: "ruca_shipping_v1",
  user: "ruca_user_v1"
};

const VALID_COUPONS = {
  "RUCA10": 0.10,
  "RUCA20": 0.20
};

// ---------- Helpers de persistência ----------
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage indisponível */ }
}

let cart = loadJSON(STORAGE_KEYS.cart, []); // [{id, qty, customization?}]
let favorites = loadJSON(STORAGE_KEYS.favorites, []); // [id,...]
let appliedCoupon = loadJSON(STORAGE_KEYS.coupon, null); // {code, rate}
let appliedShipping = loadJSON(STORAGE_KEYS.shipping, null); // {method, price, days}

function persistCart() { saveJSON(STORAGE_KEYS.cart, cart); }
function persistFavorites() { saveJSON(STORAGE_KEYS.favorites, favorites); }

// ---------- Favoritos ----------
function isFavorite(id) { return favorites.includes(id); }

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
    showToast("Produto removido dos favoritos.");
  } else {
    favorites.push(id);
    showToast("Produto adicionado aos favoritos.");
  }
  persistFavorites();
  renderProductGrid();
  renderFavoritesSection();
}

function renderFavoritesSection() {
  const wrap = document.getElementById("favoritesGrid");
  if (!wrap) return;
  const items = PRODUCTS.filter(p => favorites.includes(p.id));
  if (items.length === 0) {
    wrap.innerHTML = `<div class="fav-section-empty">Você ainda não tem favoritos. Toque no coração de um produto para salvá-lo aqui.</div>`;
    return;
  }
  wrap.innerHTML = items.map(productCardHTML).join("");
}

// ---------- Carrinho ----------
function cartQuantityTotal() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function findProduct(id) { return PRODUCTS.find(p => p.id === Number(id)); }

function addToCart(id, qty = 1, customization = null) {
  id = Number(id);
  const existing = cart.find(i => i.id === id && !i.customization && !customization);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty, customization });
  }
  persistCart();
  renderCart();
  updateCartCount();
  showToast("Produto adicionado ao carrinho.");
}

function removeCartLine(index) {
  cart.splice(index, 1);
  persistCart();
  renderCart();
  updateCartCount();
  showToast("Produto removido.");
}

function changeCartQty(index, delta) {
  const item = cart[index];
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  persistCart();
  renderCart();
  updateCartCount();
}

function cartSubtotal() {
  return cart.reduce((sum, item) => {
    const p = findProduct(item.id);
    if (!p) return sum;
    const unit = item.customization?.price ?? p.price;
    return sum + unit * item.qty;
  }, 0);
}

function couponDiscountValue() {
  if (!appliedCoupon) return 0;
  return cartSubtotal() * appliedCoupon.rate;
}

function shippingValue() {
  return appliedShipping ? appliedShipping.price : 0;
}

function cartTotal() {
  return Math.max(0, cartSubtotal() - couponDiscountValue() + shippingValue());
}

function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = cartQuantityTotal();
  });
}

function cartLineHTML(item, index) {
  const p = findProduct(item.id);
  if (!p) return "";
  const unit = item.customization?.price ?? p.price;
  const meta = item.customization
    ? [item.customization.size, item.customization.color, item.customization.text ? `"${item.customization.text}"` : null].filter(Boolean).join(" • ")
    : p.category;
  return `
  <div class="cart-item">
    <img src="${p.image}" alt="${p.name}">
    <div class="cart-item-info">
      <h4>${p.name}</h4>
      <div class="ci-meta">${meta}</div>
      <div class="cart-item-price">${formatPrice(unit * item.qty)}</div>
      <div class="qty-control">
        <button data-cart-dec="${index}" aria-label="Diminuir quantidade">−</button>
        <span>${item.qty}</span>
        <button data-cart-inc="${index}" aria-label="Aumentar quantidade">+</button>
      </div>
      <button class="cart-item-remove" data-cart-remove="${index}">Remover</button>
    </div>
  </div>`;
}

function renderCart() {
  const body = document.getElementById("cartDrawerBody");
  const footTotals = document.getElementById("cartTotals");
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2l2.4 12.4a2 2 0 002 1.6h8.2a2 2 0 002-1.6L21 8H6"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg>
        <p>Seu carrinho está vazio.<br>Que tal começar por um botton personalizado?</p>
      </div>`;
  } else {
    body.innerHTML = `<div id="cartItemsList">${cart.map(cartLineHTML).join("")}</div>`;
  }

  if (footTotals) {
    const subtotal = cartSubtotal();
    const discount = couponDiscountValue();
    const shipping = shippingValue();
    const total = cartTotal();
    footTotals.innerHTML = `
      ${appliedCoupon ? `<div class="summary-row"><span>Cupom (${appliedCoupon.code})</span><span class="discount-value">-${formatPrice(discount)}</span></div>` : ""}
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Frete</span><span>${appliedShipping ? formatPrice(shipping) : "a calcular"}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
    `;
  }

  const checkoutBtn = document.getElementById("goCheckoutBtn");
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

// ---------- Cupom ----------
function applyCoupon(code) {
  const msg = document.getElementById("couponMsg");
  const clean = code.trim().toUpperCase();
  if (!clean) return;
  if (VALID_COUPONS[clean]) {
    appliedCoupon = { code: clean, rate: VALID_COUPONS[clean] };
    saveJSON(STORAGE_KEYS.coupon, appliedCoupon);
    if (msg) { msg.textContent = `Cupom ${clean} aplicado com sucesso!`; msg.className = "coupon-msg ok"; }
    showToast("Cupom aplicado.");
  } else {
    if (msg) { msg.textContent = "Cupom inválido ou expirado."; msg.className = "coupon-msg err"; }
  }
  renderCart();
}

function removeCoupon() {
  appliedCoupon = null;
  saveJSON(STORAGE_KEYS.coupon, null);
  const msg = document.getElementById("couponMsg");
  if (msg) { msg.textContent = ""; msg.className = "coupon-msg"; }
  renderCart();
}

// ---------- Frete (simulação por faixa de CEP) ----------
function shippingRateForCEP(cep) {
  const prefix = parseInt(cep.slice(0, 2), 10);
  const table = [
    { max: 19, price: 12.90 }, { max: 28, price: 14.90 }, { max: 39, price: 16.90 },
    { max: 48, price: 18.90 }, { max: 59, price: 19.90 }, { max: 69, price: 21.90 },
    { max: 79, price: 22.90 }, { max: 89, price: 24.90 }, { max: 99, price: 26.90 }
  ];
  const found = table.find(t => prefix <= t.max);
  return found ? found.price : 26.90;
}

function calculateShipping(cep) {
  const clean = cep.replace(/\D/g, "");
  const resultsBox = document.getElementById("shippingResults");
  if (!resultsBox) return;
  if (clean.length !== 8) {
    resultsBox.innerHTML = `<p class="coupon-msg err">Digite um CEP válido com 8 dígitos.</p>`;
    return;
  }
  const base = shippingRateForCEP(clean);
  const options = [
    { method: "PAC", price: base, days: "5–9 dias úteis" },
    { method: "Expresso", price: +(base * 1.6).toFixed(2), days: "2–5 dias úteis" }
  ];
  resultsBox.innerHTML = options.map((o, i) => `
    <label class="ship-opt" data-ship-option>
      <span><input type="radio" name="shipOption" value="${i}"> <strong>${o.method}</strong><br><small>Entrega estimada: ${o.days}</small></span>
      <strong>${formatPrice(o.price)}</strong>
    </label>`).join("");

  resultsBox.querySelectorAll("input[name=shipOption]").forEach((radio, i) => {
    radio.addEventListener("change", () => {
      appliedShipping = options[i];
      saveJSON(STORAGE_KEYS.shipping, appliedShipping);
      resultsBox.querySelectorAll(".ship-opt").forEach(el => el.classList.remove("selected"));
      radio.closest(".ship-opt").classList.add("selected");
      renderCart();
      showToast("Frete calculado.");
      renderCheckoutSummary();
    });
  });
  showToast("Frete calculado.");
}

// ---------- Eventos globais de carrinho ----------
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
  renderFavoritesSection();

  // Delegação: adicionar ao carrinho / favoritar a partir de qualquer grid
  document.body.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add-cart]");
    if (addBtn) { addToCart(addBtn.dataset.addCart); return; }

    const favBtn = e.target.closest("[data-fav]");
    if (favBtn) { toggleFavorite(Number(favBtn.dataset.fav)); return; }

    const dec = e.target.closest("[data-cart-dec]");
    if (dec) { changeCartQty(Number(dec.dataset.cartDec), -1); return; }

    const inc = e.target.closest("[data-cart-inc]");
    if (inc) { changeCartQty(Number(inc.dataset.cartInc), 1); return; }

    const rem = e.target.closest("[data-cart-remove]");
    if (rem) { removeCartLine(Number(rem.dataset.cartRemove)); return; }
  });

  // Cupom
  document.getElementById("applyCouponBtn")?.addEventListener("click", () => {
    const input = document.getElementById("couponInput");
    applyCoupon(input.value);
  });
  document.getElementById("couponInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); applyCoupon(e.target.value); }
  });

  // Frete no carrinho
  document.getElementById("calcShippingBtn")?.addEventListener("click", () => {
    const input = document.getElementById("cepInput");
    calculateShipping(input.value);
  });
});
