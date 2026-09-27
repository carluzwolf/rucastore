/* ============================================================
   RUCA STORE — PRODUCTS
   Catálogo de demonstração + renderização dos cards de produto
   ============================================================ */

// Gera uma imagem placeholder em SVG (data URI) colorida por categoria,
// já que este projeto não inclui fotos reais de produto.
function placeholderImage(label, bg, fg) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
    <rect width='400' height='400' fill='${bg}'/>
    <circle cx='200' cy='150' r='90' fill='${fg}' opacity='0.35'/>
    <text x='50%' y='58%' font-family='Poppins, sans-serif' font-size='28' font-weight='700'
      fill='${fg}' text-anchor='middle'>${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const PRODUCTS = [
  {
    id: 1, name: "Botton Personalizado", category: "Bottons", price: 8.90, oldPrice: 11.90,
    rating: 5, reviews: 24, customizable: true, badge: "PERSONALIZÁVEL",
    description: "Personalize com sua arte, foto ou frase favorita. Acabamento em metal resistente.",
    material: "Metal + papel laminado", size: "4,5cm", finish: "Brilho ou fosco", production: "2 dias úteis",
    image: placeholderImage("Botton", "#EFE5FD", "#6425C4")
  },
  {
    id: 2, name: "Botton Billie Eilish", category: "Bottons", price: 9.90, oldPrice: null,
    rating: 5, reviews: 41, customizable: false, badge: "MAIS VENDIDO",
    description: "Botton de fã-arte inspirado na artista pop, perfeito para mochilas e jaquetas.",
    material: "Metal", size: "4,5cm", finish: "Brilho", production: "Envio imediato",
    image: placeholderImage("Botton", "#FFE7D8", "#E85D2A")
  },
  {
    id: 3, name: "Botton Artista Pop", category: "Bottons", price: 9.90, oldPrice: null,
    rating: 4, reviews: 18, customizable: false, badge: "NOVO",
    description: "Coleção inspirada nos maiores nomes da música pop atual.",
    material: "Metal", size: "4,5cm", finish: "Fosco", production: "Envio imediato",
    image: placeholderImage("Botton", "#E4F7FC", "#2B3F8C")
  },
  {
    id: 4, name: "Kit de Adesivos", category: "Adesivos", price: 15.90, oldPrice: 19.90,
    rating: 5, reviews: 63, customizable: false, badge: "MAIS VENDIDO",
    description: "Kit com 12 adesivos vinílicos resistentes à água, temática cultura pop.",
    material: "Vinil fosco", size: "Variado (3 a 7cm)", finish: "Resistente à água", production: "Envio imediato",
    image: placeholderImage("Adesivos", "#EFE5FD", "#6425C4")
  },
  {
    id: 5, name: "Adesivo Personalizado", category: "Adesivos", price: 5.90, oldPrice: null,
    rating: 5, reviews: 12, customizable: true, badge: "PERSONALIZÁVEL",
    description: "Envie sua arte e transformamos em um adesivo vinílico de alta durabilidade.",
    material: "Vinil fosco", size: "Até 10cm", finish: "Fosco ou brilho", production: "2 dias úteis",
    image: placeholderImage("Adesivo", "#FFE7D8", "#E85D2A")
  },
  {
    id: 6, name: "Chaveiro Acrílico", category: "Chaveiros", price: 14.90, oldPrice: null,
    rating: 4, reviews: 9, customizable: false, badge: "NOVO",
    description: "Chaveiro em acrílico transparente com estampa dupla face.",
    material: "Acrílico 3mm", size: "5cm", finish: "Brilhante", production: "Envio imediato",
    image: placeholderImage("Chaveiro", "#E4F7FC", "#2B3F8C")
  },
  {
    id: 7, name: "Chaveiro Personalizado", category: "Chaveiros", price: 17.90, oldPrice: 21.90,
    rating: 5, reviews: 31, customizable: true, badge: "PERSONALIZÁVEL",
    description: "Crie seu chaveiro com foto, nome ou desenho exclusivo.",
    material: "Acrílico 3mm", size: "5cm", finish: "Brilhante ou fosco", production: "3 dias úteis",
    image: placeholderImage("Chaveiro", "#EFE5FD", "#6425C4")
  },
  {
    id: 8, name: "Camisa Personalizada", category: "Camisas", price: 59.90, oldPrice: 74.90,
    rating: 5, reviews: 52, customizable: true, badge: "PERSONALIZÁVEL",
    description: "Camisa 100% algodão com estampa personalizada de alta durabilidade.",
    material: "100% algodão", size: "P, M, G, GG", finish: "Estampa DTF", production: "4 dias úteis",
    image: placeholderImage("Camisa", "#FFE7D8", "#E85D2A")
  },
  {
    id: 9, name: "Camisa Fandom", category: "Camisas", price: 64.90, oldPrice: null,
    rating: 5, reviews: 38, customizable: false, badge: "MAIS VENDIDO",
    description: "Estampas exclusivas inspiradas nos maiores fandoms da cultura pop.",
    material: "100% algodão", size: "P, M, G, GG", finish: "Estampa DTF", production: "2 dias úteis",
    image: placeholderImage("Camisa", "#E4F7FC", "#2B3F8C")
  },
  {
    id: 10, name: "Caneca Personalizada", category: "Canecas", price: 34.90, oldPrice: 42.90,
    rating: 4, reviews: 27, customizable: true, badge: "PERSONALIZÁVEL",
    description: "Caneca de cerâmica com sua arte, foto ou frase, resistente à micro-ondas.",
    material: "Cerâmica", size: "325ml", finish: "Sublimação", production: "3 dias úteis",
    image: placeholderImage("Caneca", "#EFE5FD", "#6425C4")
  },
  {
    id: 11, name: "Kit Papelaria", category: "Papelaria", price: 27.90, oldPrice: null,
    rating: 5, reviews: 16, customizable: false, badge: "NOVO",
    description: "Kit completo com caderno, caneta, marcadores e bloco de notas RUCA.",
    material: "Papel + PU", size: "A5", finish: "Capa dura", production: "Envio imediato",
    image: placeholderImage("Papelaria", "#FFE7D8", "#E85D2A")
  },
  {
    id: 12, name: "Photocard Personalizado", category: "Personalizados", price: 6.90, oldPrice: null,
    rating: 5, reviews: 45, customizable: true, badge: "PERSONALIZÁVEL",
    description: "Photocards em alta qualidade com sua foto favorita e acabamento fosco.",
    material: "Papel fotográfico 300g", size: "5,4 x 8,5cm", finish: "Fosco", production: "2 dias úteis",
    image: placeholderImage("Photocard", "#E4F7FC", "#2B3F8C")
  },
  {
    id: 13, name: "Camiseta Cultura Pop", category: "Cultura Pop", price: 69.90, oldPrice: 79.90,
    rating: 5, reviews: 22, customizable: false, badge: "MAIS VENDIDO",
    description: "Peça exclusiva da coleção RUCA inspirada em ícones da cultura pop.",
    material: "100% algodão", size: "P, M, G, GG", finish: "Estampa DTF", production: "2 dias úteis",
    image: placeholderImage("Cultura Pop", "#EFE5FD", "#6425C4")
  },
  {
    id: 14, name: "Ecobag Personalizada", category: "Personalizados", price: 39.90, oldPrice: null,
    rating: 4, reviews: 8, customizable: true, badge: "PERSONALIZÁVEL",
    description: "Ecobag de lona resistente com sua estampa exclusiva.",
    material: "Lona 100% algodão", size: "40x35cm", finish: "Estampa serigrafia", production: "3 dias úteis",
    image: placeholderImage("Ecobag", "#FFE7D8", "#E85D2A")
  }
];

// Estado dos filtros/busca aplicados ao catálogo
const catalogState = {
  search: "",
  category: "Todos",
  quickFilter: "all", // all | customizable | bestseller | new
  sort: "relevant"
};

function starString(rating) {
  return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
}

function badgeClass(badge) {
  if (badge === "MAIS VENDIDO") return "badge-bestseller";
  if (badge === "NOVO") return "badge-new";
  if (badge === "PERSONALIZÁVEL") return "badge-custom";
  return "badge-custom";
}

function discountPercent(p) {
  if (!p.oldPrice) return null;
  return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
}

function formatPrice(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function productCardHTML(p) {
  const disc = discountPercent(p);
  const isFav = isFavorite(p.id);
  return `
  <article class="product-card" data-id="${p.id}">
    <div class="product-media">
      <span class="product-badge ${badgeClass(p.badge)}">${p.badge}</span>
      <button class="fav-btn ${isFav ? "active" : ""}" data-fav="${p.id}" aria-label="Favoritar ${p.name}" aria-pressed="${isFav}">
        <svg viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4 6 4c2 0 3.5 1 6 3.5C14.5 5 16 4 18 4c4 0 5.5 4 4 7.7C19.5 16.4 12 21 12 21z"/></svg>
      </button>
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      ${disc ? `<span class="discount-tag">-${disc}%</span>` : ""}
    </div>
    <div class="product-body">
      <span class="product-cat">${p.category}</span>
      <h3 class="product-name">${p.name}</h3>
      <div class="product-rating"><span class="stars">${starString(p.rating)}</span> (${p.reviews} avaliações)</div>
      <div class="product-price-row">
        ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ""}
        <span class="price-now">${formatPrice(p.price)}</span>
      </div>
      <div class="product-actions">
        <button class="btn btn-ghost btn-sm" data-open-product="${p.id}">VER MAIS</button>
        <button class="btn btn-primary btn-sm" data-add-cart="${p.id}">ADICIONAR</button>
      </div>
    </div>
  </article>`;
}

function getFilteredProducts() {
  let list = [...PRODUCTS];

  if (catalogState.search.trim()) {
    const q = catalogState.search.trim().toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (catalogState.category !== "Todos") {
    list = list.filter(p => p.category === catalogState.category);
  }

  if (catalogState.quickFilter === "customizable") list = list.filter(p => p.customizable);
  if (catalogState.quickFilter === "bestseller") list = list.filter(p => p.badge === "MAIS VENDIDO");
  if (catalogState.quickFilter === "new") list = list.filter(p => p.badge === "NOVO");

  switch (catalogState.sort) {
    case "price-asc": list.sort((a, b) => a.price - b.price); break;
    case "price-desc": list.sort((a, b) => b.price - a.price); break;
    case "bestseller": list.sort((a, b) => b.reviews - a.reviews); break;
    case "newest": list.sort((a, b) => b.id - a.id); break;
    default: break; // relevância = ordem do catálogo
  }
  return list;
}

function renderProductGrid() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  const list = getFilteredProducts();

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <p><strong>Nenhum produto encontrado.</strong><br>Tente outra palavra-chave ou limpe os filtros.</p>
      </div>`;
    return;
  }
  grid.innerHTML = list.map(productCardHTML).join("");
}

function renderCategoryChips() {
  const wrap = document.getElementById("categoryChips");
  if (!wrap) return;
  const cats = ["Todos", ...new Set(PRODUCTS.map(p => p.category))];
  wrap.innerHTML = cats.map(c =>
    `<button class="chip ${catalogState.category === c ? "active" : ""}" data-category="${c}">${c}</button>`
  ).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCategoryChips();
  renderProductGrid();

  // Filtro por categoria
  document.getElementById("categoryChips")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-category]");
    if (!btn) return;
    catalogState.category = btn.dataset.category;
    renderCategoryChips();
    renderProductGrid();
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Filtros rápidos (personalizáveis / mais vendidos / novidades)
  document.getElementById("quickFilters")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-quick]");
    if (!btn) return;
    catalogState.quickFilter = btn.dataset.quick;
    document.querySelectorAll("#quickFilters .chip").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    renderProductGrid();
  });

  // Ordenação
  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    catalogState.sort = e.target.value;
    renderProductGrid();
  });
});
