/* ============================================================
   RUCA STORE — CHECKOUT DE DEMONSTRAÇÃO
   Nenhum pagamento real é processado.
   ============================================================ */

const checkoutState = {
  step: 1, // 1 identificação, 2 entrega, 3 pagamento, 4 confirmação
  payment: "pix"
};

function renderCheckoutSummary() {
  const box = document.getElementById("checkoutSummaryItems");
  const totalsBox = document.getElementById("checkoutTotals");
  if (!box) return;
  box.innerHTML = cart.map(item => {
    const p = findProduct(item.id);
    if (!p) return "";
    const unit = item.customization?.price ?? p.price;
    return `<div class="co-item"><span>${p.name} × ${item.qty}</span><span>${formatPrice(unit * item.qty)}</span></div>`;
  }).join("");

  if (totalsBox) {
    totalsBox.innerHTML = `
      ${appliedCoupon ? `<div class="co-item"><span>Cupom ${appliedCoupon.code}</span><span>-${formatPrice(couponDiscountValue())}</span></div>` : ""}
      <div class="co-item"><span>Subtotal</span><span>${formatPrice(cartSubtotal())}</span></div>
      <div class="co-item"><span>Frete</span><span>${appliedShipping ? formatPrice(shippingValue()) : "—"}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(cartTotal())}</span></div>
    `;
  }
}

function setCheckoutStep(step) {
  checkoutState.step = step;
  document.querySelectorAll(".checkout-steps .step").forEach(el => {
    const s = Number(el.dataset.step);
    el.classList.toggle("active", s === step);
    el.classList.toggle("done", s < step);
  });
  document.querySelectorAll(".checkout-panel-content").forEach(panel => {
    panel.style.display = Number(panel.dataset.stepContent) === step ? "block" : "none";
  });
  document.getElementById("checkoutModalBody")?.scrollTo({ top: 0, behavior: "smooth" });
}

function validateStep(step) {
  const panel = document.querySelector(`.checkout-panel-content[data-step-content="${step}"]`);
  if (!panel) return true;
  const requiredFields = panel.querySelectorAll("[required]");
  for (const field of requiredFields) {
    if (!field.value.trim()) {
      field.focus();
      showToast("Preencha os campos obrigatórios.");
      return false;
    }
  }
  return true;
}

function generateOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `#RUCA-2026-${rand}`;
}

function generateFakePixCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "00020126360014BR.GOV.BCB.PIX";
  for (let i = 0; i < 40; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function maskCardNumber(value) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function maskExpiry(value) {
  const v = value.replace(/\D/g, "").slice(0, 4);
  return v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
}
function maskCVV(value) { return value.replace(/\D/g, "").slice(0, 3); }

document.addEventListener("DOMContentLoaded", () => {
  // Navegação entre etapas
  document.querySelectorAll("[data-checkout-next]").forEach(btn => {
    btn.addEventListener("click", () => {
      const current = checkoutState.step;
      if (!validateStep(current)) return;
      setCheckoutStep(Math.min(4, current + 1));
      if (current + 1 === 3) {
        if (checkoutState.payment === "pix") {
          document.getElementById("pixCode").textContent = generateFakePixCode();
        }
      }
    });
  });
  document.querySelectorAll("[data-checkout-prev]").forEach(btn => {
    btn.addEventListener("click", () => setCheckoutStep(Math.max(1, checkoutState.step - 1)));
  });

  // Seleção de método de pagamento
  document.querySelectorAll("[data-pay-method]").forEach(el => {
    el.addEventListener("click", () => {
      checkoutState.payment = el.dataset.payMethod;
      document.querySelectorAll("[data-pay-method]").forEach(m => m.classList.remove("selected"));
      el.classList.add("selected");
      document.querySelectorAll("[data-pay-panel]").forEach(p => {
        p.style.display = p.dataset.payPanel === checkoutState.payment ? "block" : "none";
      });
      if (checkoutState.payment === "pix") {
        const codeEl = document.getElementById("pixCode");
        if (codeEl) codeEl.textContent = generateFakePixCode();
      }
    });
  });

  // Copiar código PIX (demonstrativo)
  document.getElementById("copyPixBtn")?.addEventListener("click", async (e) => {
    const code = document.getElementById("pixCode").textContent;
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) { /* clipboard indisponível — ignorar silenciosamente */ }
    e.target.textContent = "Copiado!";
    showToast("Código PIX copiado (demonstrativo).");
    setTimeout(() => { e.target.textContent = "Copiar código PIX"; }, 2000);
  });

  // Máscaras do cartão
  document.getElementById("cardNumber")?.addEventListener("input", (e) => {
    e.target.value = maskCardNumber(e.target.value);
    const preview = document.getElementById("cardPreviewNumber");
    if (preview) preview.textContent = e.target.value || "0000 0000 0000 0000";
  });
  document.getElementById("cardExpiry")?.addEventListener("input", (e) => {
    e.target.value = maskExpiry(e.target.value);
    const preview = document.getElementById("cardPreviewExpiry");
    if (preview) preview.textContent = e.target.value || "MM/AA";
  });
  document.getElementById("cardCVV")?.addEventListener("input", (e) => { e.target.value = maskCVV(e.target.value); });
  document.getElementById("cardName")?.addEventListener("input", (e) => {
    const preview = document.getElementById("cardPreviewName");
    if (preview) preview.textContent = e.target.value.toUpperCase() || "NOME NO CARTÃO";
  });

  // Finalizar pedido (demonstração)
  document.getElementById("placeOrderBtn")?.addEventListener("click", () => {
    if (checkoutState.payment === "card" && !validateStep(3)) return;
    const orderNumEl = document.getElementById("orderNumber");
    if (orderNumEl) orderNumEl.textContent = generateOrderNumber();
    cart = [];
    persistCart();
    updateCartCount();
    renderCart();
    appliedCoupon = null; appliedShipping = null;
    saveJSON(STORAGE_KEYS.coupon, null); saveJSON(STORAGE_KEYS.shipping, null);
    setCheckoutStep(4);
    showToast("Pedido de demonstração criado.");
  });

  document.getElementById("openCheckoutBtn")?.addEventListener("click", () => {
    if (cart.length === 0) return;
    setCheckoutStep(1);
    renderCheckoutSummary();
    openModal("checkoutModal");
    closeDrawer("cartDrawer");
  });
});
