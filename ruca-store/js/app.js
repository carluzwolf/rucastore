/* ============================================================
   RUCA STORE — APP
   Header, busca, modais, toasts, login demo, contador de ofertas
   ============================================================ */

/* ---------- Toasts ---------- */
function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

/* ---------- Overlay / Drawers / Modals ---------- */
function openOverlay() { document.getElementById("overlay")?.classList.add("open"); }
function closeOverlayIfNothingOpen() {
  const anyOpen = document.querySelector(".drawer.open, .modal.open, .mobile-nav.open");
  if (!anyOpen) document.getElementById("overlay")?.classList.remove("open");
}
function openDrawer(id) {
  document.getElementById(id)?.classList.add("open");
  openOverlay();
  document.body.style.overflow = "hidden";
}
function closeDrawer(id) {
  document.getElementById(id)?.classList.remove("open");
  closeOverlayIfNothingOpen();
  document.body.style.overflow = "";
}
function openModal(id) {
  document.getElementById(id)?.classList.add("open");
  openOverlay();
  document.body.style.overflow = "hidden";
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove("open");
  closeOverlayIfNothingOpen();
  document.body.style.overflow = "";
}
function closeAllOverlays() {
  document.querySelectorAll(".drawer.open, .modal.open, .mobile-nav.open").forEach(el => el.classList.remove("open"));
  document.getElementById("overlay")?.classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------- Countdown da oferta da semana ---------- */
function startOfferCountdown() {
  const el = document.getElementById("offerCountdown");
  if (!el) return;
  let remaining = 12 * 3600 + 47 * 60 + 35; // 00:12:47:35 inicial, conforme o briefing
  function tick() {
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    el.querySelector("[data-cd-d]").textContent = String(days).padStart(2, "0");
    el.querySelector("[data-cd-h]").textContent = String(hours).padStart(2, "0");
    el.querySelector("[data-cd-m]").textContent = String(minutes).padStart(2, "0");
    el.querySelector("[data-cd-s]").textContent = String(seconds).padStart(2, "0");
    remaining = remaining > 0 ? remaining - 1 : 12 * 3600 + 47 * 60 + 35; // reinicia (demonstração)
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- Produto: modal de detalhes ---------- */
function openProductDetail(id) {
  const p = findProduct(id);
  if (!p) return;
  const disc = discountPercent(p);
  const modalBody = document.getElementById("productModalBody");
  const related = PRODUCTS.filter(r => r.category === p.category && r.id !== p.id).slice(0, 4);

  modalBody.innerHTML = `
    <div class="pd-grid">
      <div class="pd-media"><img src="${p.image}" alt="${p.name}"></div>
      <div class="pd-info">
        <span class="pd-cat">${p.category}</span>
        <h3 class="pd-title">${p.name}</h3>
        <div class="product-rating"><span class="stars">${starString(p.rating)}</span> (${p.reviews} avaliações)</div>
        <div class="pd-price-row">
          ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ""}
          <span class="price-now">${formatPrice(p.price)}</span>
          ${disc ? `<span class="discount-tag" style="position:static;">-${disc}%</span>` : ""}
        </div>
        <p class="pd-desc">${p.description}</p>
        <dl class="pd-info-list">
          <dt>Material</dt><dd>${p.material}</dd>
          <dt>Tamanho</dt><dd>${p.size}</dd>
          <dt>Acabamento</dt><dd>${p.finish}</dd>
          <dt>Prazo de produção</dt><dd>${p.production}</dd>
        </dl>
        <div class="qty-stepper" id="pdQtyStepper" data-qty="1">
          <button data-pd-qty-dec aria-label="Diminuir">−</button>
          <span data-pd-qty-value>1</span>
          <button data-pd-qty-inc aria-label="Aumentar">+</button>
        </div>
        <div class="pd-actions">
          ${p.customizable
            ? `<button class="btn btn-primary btn-block" data-open-customize="${p.id}">PERSONALIZAR E ADICIONAR</button>`
            : `<button class="btn btn-primary btn-block" data-pd-add="${p.id}">ADICIONAR AO CARRINHO</button>
               <button class="btn btn-secondary btn-block" data-pd-buy="${p.id}">COMPRAR AGORA</button>`
          }
        </div>
      </div>
    </div>
    ${related.length ? `
      <h4 class="related-title">Você também pode gostar</h4>
      <div class="related-grid">${related.map(productCardHTML).join("")}</div>
    ` : ""}
  `;

  modalBody.querySelector("[data-pd-qty-inc]")?.addEventListener("click", () => {
    const stepper = document.getElementById("pdQtyStepper");
    stepper.dataset.qty = Number(stepper.dataset.qty) + 1;
    stepper.querySelector("[data-pd-qty-value]").textContent = stepper.dataset.qty;
  });
  modalBody.querySelector("[data-pd-qty-dec]")?.addEventListener("click", () => {
    const stepper = document.getElementById("pdQtyStepper");
    stepper.dataset.qty = Math.max(1, Number(stepper.dataset.qty) - 1);
    stepper.querySelector("[data-pd-qty-value]").textContent = stepper.dataset.qty;
  });
  modalBody.querySelector("[data-pd-add]")?.addEventListener("click", () => {
    const qty = Number(document.getElementById("pdQtyStepper").dataset.qty);
    addToCart(p.id, qty);
  });
  modalBody.querySelector("[data-pd-buy]")?.addEventListener("click", () => {
    const qty = Number(document.getElementById("pdQtyStepper").dataset.qty);
    addToCart(p.id, qty);
    closeModal("productModal");
    document.getElementById("openCheckoutBtn")?.click() || openDrawer("cartDrawer");
  });
  modalBody.querySelector("[data-open-customize]")?.addEventListener("click", () => {
    closeModal("productModal");
    openCustomizeModal(p.id);
  });

  openModal("productModal");
}

/* ---------- Produto: modal de personalização ---------- */
function openCustomizeModal(id) {
  const p = findProduct(id);
  if (!p) return;
  const sizes = ["P", "M", "G", "GG"];
  const colors = [
    { name: "Preta", hex: "#1A1522" }, { name: "Branca", hex: "#FFFFFF" },
    { name: "Roxa", hex: "#7C3AED" }, { name: "Azul", hex: "#8FD9F2" }
  ];
  const body = document.getElementById("customizeModalBody");
  document.getElementById("customizeModalTitle").textContent = p.name.toUpperCase();

  body.innerHTML = `
    <div class="field">
      <label>Tamanho</label>
      <div class="size-options" data-size-group>
        ${sizes.map((s, i) => `<button type="button" class="size-opt ${i === 0 ? "selected" : ""}" data-size="${s}">${s}</button>`).join("")}
      </div>
    </div>
    <div class="field">
      <label>Cor</label>
      <div class="swatches" data-color-group>
        ${colors.map((c, i) => `<button type="button" class="swatch ${i === 0 ? "selected" : ""}" data-color="${c.name}" style="background:${c.hex}; ${c.name==='Branca' ? 'box-shadow:inset 0 0 0 1px #DED4F0;' : ''}" aria-label="${c.name}"></button>`).join("")}
      </div>
    </div>
    <div class="field">
      <label for="customFile">Adicionar arquivo (arte, foto ou logo)</label>
      <div class="file-drop" id="customFileDrop">
        <span id="customFileLabel">Escolher arquivo (demonstrativo)</span>
      </div>
      <input type="file" id="customFile" class="visually-hidden" accept="image/*">
    </div>
    <div class="field">
      <label for="customText">Texto personalizado</label>
      <input type="text" id="customText" maxlength="30" placeholder="Ex: RUCA para sempre">
    </div>
    <div class="field">
      <label for="customNotes">Observações</label>
      <textarea id="customNotes" rows="2" placeholder="Alguma instrução especial para a produção?"></textarea>
    </div>
    <div class="field">
      <label>Quantidade</label>
      <div class="qty-stepper" id="customQtyStepper" data-qty="1">
        <button type="button" data-cq-dec aria-label="Diminuir">−</button>
        <span data-cq-value>1</span>
        <button type="button" data-cq-inc aria-label="Aumentar">+</button>
      </div>
    </div>
    <div class="custom-price-box">
      <span>Total do personalizado</span>
      <strong id="customTotalPrice">${formatPrice(p.price)}</strong>
    </div>
    <button class="btn btn-primary btn-block" style="margin-top:18px;" id="addCustomToCartBtn">ADICIONAR PERSONALIZADO AO CARRINHO</button>
  `;

  function recalcCustomPrice() {
    const qty = Number(document.getElementById("customQtyStepper").dataset.qty);
    document.getElementById("customTotalPrice").textContent = formatPrice(p.price * qty);
  }

  body.querySelectorAll("[data-size]").forEach(btn => btn.addEventListener("click", () => {
    body.querySelectorAll("[data-size]").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
  }));
  body.querySelectorAll("[data-color]").forEach(btn => btn.addEventListener("click", () => {
    body.querySelectorAll("[data-color]").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
  }));
  body.querySelector("#customFileDrop").addEventListener("click", () => body.querySelector("#customFile").click());
  body.querySelector("#customFile").addEventListener("change", (e) => {
    const label = body.querySelector("#customFileLabel");
    const drop = body.querySelector("#customFileDrop");
    if (e.target.files[0]) {
      label.textContent = `Arquivo selecionado: ${e.target.files[0].name}`;
      drop.classList.add("has-file");
      showToast("Arquivo anexado (demonstrativo).");
    }
  });
  body.querySelector("[data-cq-inc]").addEventListener("click", () => {
    const stepper = body.querySelector("#customQtyStepper");
    stepper.dataset.qty = Number(stepper.dataset.qty) + 1;
    stepper.querySelector("[data-cq-value]").textContent = stepper.dataset.qty;
    recalcCustomPrice();
  });
  body.querySelector("[data-cq-dec]").addEventListener("click", () => {
    const stepper = body.querySelector("#customQtyStepper");
    stepper.dataset.qty = Math.max(1, Number(stepper.dataset.qty) - 1);
    stepper.querySelector("[data-cq-value]").textContent = stepper.dataset.qty;
    recalcCustomPrice();
  });

  body.querySelector("#addCustomToCartBtn").addEventListener("click", () => {
    const qty = Number(body.querySelector("#customQtyStepper").dataset.qty);
    const size = body.querySelector("[data-size].selected")?.dataset.size;
    const color = body.querySelector("[data-color].selected")?.dataset.color;
    const text = body.querySelector("#customText").value;
    addToCart(p.id, qty, { size, color, text, price: p.price });
    closeModal("customizeModal");
    openDrawer("cartDrawer");
  });

  openModal("customizeModal");
}

/* ---------- Login demo ---------- */
function refreshLoginUI() {
  const user = loadJSON(STORAGE_KEYS.user, null);
  const label = document.getElementById("accountLabel");
  if (label) label.textContent = user ? `Olá, ${user.name}!` : "Entrar";
}

/* ---------- Inicialização geral ---------- */
document.addEventListener("DOMContentLoaded", () => {
  refreshLoginUI();
  startOfferCountdown();

  /* Header com sombra ao rolar */
  const header = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
    backToTop?.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* Menu mobile */
  document.getElementById("hamburgerBtn")?.addEventListener("click", () => {
    document.getElementById("mobileNav")?.classList.add("open");
    openOverlay();
  });

  /* Fechar qualquer painel */
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.close;
      if (target === "mobileNav") { document.getElementById("mobileNav").classList.remove("open"); closeOverlayIfNothingOpen(); }
      else if (target.includes("Modal")) closeModal(target);
      else closeDrawer(target);
    });
  });
  document.getElementById("overlay")?.addEventListener("click", closeAllOverlays);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllOverlays(); });

  /* Abrir carrinho */
  document.querySelectorAll("[data-open-cart]").forEach(btn => btn.addEventListener("click", () => openDrawer("cartDrawer")));

  /* Abrir detalhes de produto (delegação, pois os cards são renderizados dinamicamente) */
  document.body.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open-product]");
    if (openBtn) { openProductDetail(Number(openBtn.dataset.openProduct)); return; }

    const customizeBtn = e.target.closest("[data-open-customize]");
    if (customizeBtn && !e.target.closest("#productModalBody")) {
      openCustomizeModal(Number(customizeBtn.dataset.openCustomize));
    }
  });

  /* Banners e CTAs que levam a categorias */
  document.querySelectorAll("[data-goto-category]").forEach(el => {
    el.addEventListener("click", () => {
      catalogState.category = el.dataset.gotoCategory;
      catalogState.quickFilter = "all";
      renderCategoryChips();
      renderProductGrid();
      document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
    });
  });
  document.querySelectorAll("[data-goto-customizable]").forEach(el => {
    el.addEventListener("click", () => {
      catalogState.quickFilter = "customizable";
      catalogState.category = "Todos";
      document.querySelectorAll("#quickFilters .chip").forEach(c => c.classList.remove("active"));
      document.querySelector('#quickFilters [data-quick="customizable"]')?.classList.add("active");
      renderCategoryChips();
      renderProductGrid();
      document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* Busca */
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchPanel = document.getElementById("searchResultsPanel");

  function updateSearchPanel() {
    const q = searchInput.value.trim().toLowerCase();
    searchForm.classList.toggle("has-value", q.length > 0);
    if (!q) { searchPanel.classList.remove("open"); return; }
    const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 6);
    searchPanel.innerHTML = matches.length
      ? matches.map(p => `
          <div class="search-result-item" data-open-product="${p.id}" role="button" tabindex="0">
            <img src="${p.image}" alt="">
            <div><strong style="font-size:0.85rem;">${p.name}</strong><br><span style="font-size:0.78rem;color:var(--text-muted);">${formatPrice(p.price)}</span></div>
          </div>`).join("")
      : `<div class="search-empty">Nenhum produto encontrado para "${searchInput.value}".</div>`;
    searchPanel.classList.add("open");
  }

  searchInput?.addEventListener("input", updateSearchPanel);
  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    catalogState.search = searchInput.value;
    catalogState.category = "Todos";
    renderCategoryChips();
    renderProductGrid();
    searchPanel.classList.remove("open");
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("searchClearBtn")?.addEventListener("click", () => {
    searchInput.value = "";
    catalogState.search = "";
    searchForm.classList.remove("has-value");
    searchPanel.classList.remove("open");
    renderProductGrid();
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-form")) searchPanel?.classList.remove("open");
  });
  searchPanel?.addEventListener("click", (e) => {
    const item = e.target.closest("[data-open-product]");
    if (item) { openProductDetail(Number(item.dataset.openProduct)); searchPanel.classList.remove("open"); }
  });

  /* Newsletter (demonstração) */
  document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("newsletterMsg");
    msg.textContent = "Cadastro realizado para demonstração!";
    e.target.reset();
    showToast("Cadastro na newsletter realizado.");
  });

  /* Login demo */
  document.getElementById("openLoginBtn")?.addEventListener("click", () => {
    const user = loadJSON(STORAGE_KEYS.user, null);
    if (user) {
      saveJSON(STORAGE_KEYS.user, null);
      refreshLoginUI();
      showToast("Você saiu da sua conta (demonstração).");
    } else {
      openModal("loginModal");
    }
  });
  document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const name = email.split("@")[0] || "Cliente";
    saveJSON(STORAGE_KEYS.user, { name: name.charAt(0).toUpperCase() + name.slice(1), email });
    refreshLoginUI();
    closeModal("loginModal");
    showToast("Login realizado (demonstração).");
  });

  /* Copiar código do cupom nas ofertas rápidas (se aplicável) */
  document.querySelectorAll("[data-quick-coupon]").forEach(el => {
    el.addEventListener("click", () => {
      openDrawer("cartDrawer");
      const input = document.getElementById("couponInput");
      if (input) { input.value = el.dataset.quickCoupon; applyCoupon(input.value); }
    });
  });
});
