/* ==========================================================================
   core.js — Camada de dados e regras de negócio COMPARTILHADAS
   Usado por sistema-grafica.html E orcamento.html.
   Qualquer mudança em regra de cálculo (custo, margem, logística) deve
   ser feita SÓ AQUI, para os dois arquivos nunca ficarem dessincronizados.
   ========================================================================== */

const STORAGE_KEY = "grafica_erp_data_v2";

function uid(prefix) {
  return (prefix || "id") + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function monthKey(dateStr) {
  return (dateStr || todayISO()).slice(0, 7); // YYYY-MM
}

/* ---------- Fornecedores reais cadastrados ---------- */
const SEED_SUPPLIERS = [
  {
    id: "futuraim",
    nome: "FuturaIM",
    categoria: "Materiais gráficos",
    cnpj: "08.142.850/0001-36",
    telefone: "(11) 4003-9016",
    whatsapp: "(11) 4003-9016",
    site: "futuraim.com.br",
    prazoEntrega: "4 a 7 dias úteis",
    custoFrete: "",
    observacoes: "Fornecedor responsável por Cartão de Visita e Panfleto A6."
  },
  {
    id: "empresalocal",
    nome: "Empresa Local",
    categoria: "Impressões",
    cnpj: "",
    telefone: "",
    whatsapp: "",
    site: "",
    prazoEntrega: "",
    custoFrete: "",
    observacoes: "Fornecedor responsável pela Impressão A4. Impressões especiais futuramente."
  }
];

/* ---------- Produtos reais cadastrados ----------
   tiers: cada item representa uma quantidade cadastrada.
   custoFrente/custoFV = valor pago ao fornecedor (uso interno).
   vendaFrente/vendaFV = valor cobrado do cliente (usado no orçamento).
   "null" = valor não cadastrado — nunca inventar / nunca aproximar.
*/
const SEED_PRODUCTS = [
  {
    id: "cartao-visita",
    nome: "Cartão de Visita",
    categoria: "Cartões",
    prazo: "4 a 7 dias úteis após aprovação",
    modoPreco: "tiers",
    materiais: [
      {
        id: "couche-brilho-250g",
        nome: "Couchê Brilho 250g",
        linha: "Linha Básica",
        acabamento: "",
        fornecedorId: "futuraim",
        linkFornecedor: "https://www.futuraim.com.br/produto/cartao-de-visita-em-couche-brilho?id=4526",
        tiers: [
          { qtd: 500,  custoFrente: 43.99,  custoFV: 54.99,  vendaFrente: 89.90,  vendaFV: 109.90 },
          { qtd: 1000, custoFrente: 57.99,  custoFV: 65.99,  vendaFrente: 129.90, vendaFV: 149.90 },
          { qtd: 2000, custoFrente: 101.99, custoFV: null,   vendaFrente: 219.90, vendaFV: 249.90 },
          { qtd: 3000, custoFrente: 144.99, custoFV: 169.99, vendaFrente: 299.90, vendaFV: 339.90 },
          { qtd: 4000, custoFrente: 187.99, custoFV: 221.99, vendaFrente: null,   vendaFV: null   },
          { qtd: 5000, custoFrente: 228.99, custoFV: 270.99, vendaFrente: 449.90, vendaFV: 519.90 }
        ]
      },
      {
        id: "couche-fosco-300g",
        nome: "Couchê Fosco 300g",
        linha: "Linha Premium",
        acabamento: "Laminação Fosca + Verniz Localizado",
        fornecedorId: "futuraim",
        linkFornecedor: "https://www.futuraim.com.br/produto/cartao-de-visita-em-couche-fosco-com-laminacao-fosca-e-verniz-localizado?id=4616",
        tiers: [
          { qtd: 500,  custoFrente: 90.99,  custoFV: 100.99, vendaFrente: 169.90, vendaFV: 199.90 },
          { qtd: 1000, custoFrente: 110.99, custoFV: 110.99, vendaFrente: 269.90, vendaFV: 319.90 },
          { qtd: 5000, custoFrente: 481.99, custoFV: 485.99, vendaFrente: 699.90, vendaFV: 799.90 }
        ]
      }
    ]
  },
  {
    id: "panfleto-a6",
    nome: "Panfleto A6",
    categoria: "Panfletos",
    prazo: "4 a 7 dias úteis",
    modoPreco: "tiers",
    materiais: [
      {
        id: "couche-brilho-90g",
        nome: "Couchê Brilho 90g",
        linha: "Linha Econômica",
        acabamento: "",
        fornecedorId: "futuraim",
        linkFornecedor: "https://www.futuraim.com.br/produto/folheto-em-couche-brilho?id=16301",
        tiers: [
          { qtd: 1000, custoFrente: 99.99,  custoFV: 114.99, vendaFrente: 199.90, vendaFV: 279.90 },
          { qtd: 2500, custoFrente: 139.99, custoFV: 153.99, vendaFrente: 249.90, vendaFV: 399.90 },
          { qtd: 5000, custoFrente: 211.99, custoFV: 239.99, vendaFrente: 349.90, vendaFV: 649.90 }
        ]
      },
      {
        id: "couche-brilho-150g",
        nome: "Couchê Brilho 150g",
        linha: "Linha Premium",
        acabamento: "",
        fornecedorId: "futuraim",
        linkFornecedor: "https://www.futuraim.com.br/produto/folheto-em-couche-brilho?id=25268",
        tiers: [
          { qtd: 250,  custoFrente: 110.99, custoFV: 151.99, vendaFrente: 189.90, vendaFV: 259.90 },
          { qtd: 500,  custoFrente: 174.99, custoFV: null,   vendaFrente: 279.90, vendaFV: 389.90 },
          { qtd: 1000, custoFrente: 201.99, custoFV: 204.99, vendaFrente: 329.90, vendaFV: 449.90 },
          { qtd: 2500, custoFrente: 218.99, custoFV: 222.99, vendaFrente: 349.90, vendaFV: 599.90 },
          { qtd: 5000, custoFrente: 413.99, custoFV: 421.99, vendaFrente: 589.90, vendaFV: 899.90 }
        ]
      }
    ]
  },
  {
    id: "impressao-a4",
    nome: "Impressão A4",
    categoria: "Impressões",
    prazo: "Prazo informado conforme quantidade e localização.",
    modoPreco: "faixas",
    qtdMinima: 20,
    materiais: [
      {
        id: "sulfite-75g",
        nome: "Sulfite 75g",
        linha: "",
        acabamento: "",
        fornecedorId: "empresalocal",
        linkFornecedor: "",
        faixas: [
          { min: 20,  max: 30,      custo: 0.90, venda: 1.90 },
          { min: 31,  max: 50,      custo: 0.70, venda: 1.75 },
          { min: 51,  max: 80,      custo: 0.50, venda: 1.45 },
          { min: 81,  max: 100,     custo: 0.40, venda: 1.25 },
          { min: 101, max: 200,     custo: 0.30, venda: 1.00 },
          { min: 201, max: 500,     custo: 0.25, venda: 0.80 },
          { min: 501, max: Infinity, custo: 0.22, venda: 0.65 }
        ]
      }
    ]
  },
  {
    id: "impressao-especial-a4",
    nome: "Impressão Especial A4",
    categoria: "Impressões",
    prazo: "Prazo informado conforme quantidade e localização.",
    modoPreco: "faixas",
    qtdMinima: 1,
    materiais: [
      {
        id: "fotografico-180g",
        nome: "Papel Fotográfico 180g",
        linha: "",
        acabamento: "",
        fornecedorId: null,
        linkFornecedor: "",
        faixas: [
          { min: 1, max: 1,        custo: null, venda: 7.90 },
          { min: 2, max: 4,        custo: null, venda: 6.90 },
          { min: 5, max: Infinity, custo: null, venda: 5.90 }
        ]
      },
      {
        id: "matte-220g",
        nome: "Papel Matte 220g",
        linha: "",
        acabamento: "",
        fornecedorId: null,
        linkFornecedor: "",
        observacao: "Frete grátis a partir de 8 folhas.",
        faixas: [
          { min: 1, max: 1,        custo: null, venda: 6.90 },
          { min: 2, max: 4,        custo: null, venda: 5.90 },
          { min: 8, max: Infinity, custo: null, venda: 4.90 }
        ]
      },
      {
        id: "adesivo-130g",
        nome: "Papel Adesivo 130g",
        linha: "",
        acabamento: "",
        fornecedorId: null,
        linkFornecedor: "",
        observacao: "Frete grátis a partir de 5 folhas.",
        faixas: [
          { min: 1, max: 1,        custo: null, venda: 7.90 },
          { min: 2, max: 4,        custo: null, venda: 6.90 },
          { min: 5, max: Infinity, custo: null, venda: 5.90 }
        ]
      }
    ]
  }
];

function seedDB() {
  return {
    version: 2,
    products: JSON.parse(JSON.stringify(SEED_PRODUCTS)),
    suppliers: JSON.parse(JSON.stringify(SEED_SUPPLIERS)),
    clients: [],
    budgets: [],
    orders: [],
    finance: [],
    stock: [],
    marketing: [],
    marketingPlatforms: [
      { id: "google-ads", nome: "Google Ads" }
    ],
    marketingDaily: [],
    marketingCosts: [],
    custosFornecedores: [],
    logisticsConfig: { custoPorKm: 0.50 },
    logisticsRoutes: [
      { id: "rota-empresalocal", fornecedorId: "empresalocal", origem: "Local do administrador", destino: "Empresa Local", distanciaKm: 7 },
      { id: "rota-futuraim", fornecedorId: "futuraim", origem: "Local do administrador", destino: "FuturaIM", distanciaKm: 7 }
    ],
    settings: {
      tema: "claro",
      empresaNome: "Impressão na Sua Casa",
      empresaCNPJ: "",
      empresaContato: "",
      notifEmail: true,
      notifWhatsapp: false,
      margemBoa: 40,
      margemBaixa: 20
    }
  };
}

/* ---------- Store: leitura/escrita única, com persistência automática ---------- */
const Store = (function () {
  let db = null;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        db = JSON.parse(raw);
        // Garante que campos novos existam mesmo em bancos salvos antes desta versão.
        const seed = seedDB();
        Object.keys(seed).forEach(k => { if (!(k in db)) db[k] = seed[k]; });
        Object.keys(seed.settings).forEach(k => { if (!(k in db.settings)) db.settings[k] = seed.settings[k]; });
        // Migração: garante rota de logística fixa do fornecedor FuturaIM (vínculo Produto → Fornecedor → Custo).
        if (Array.isArray(db.logisticsRoutes) && db.suppliers && db.suppliers.some(s => s.id === "futuraim")) {
          const jaTemRotaFuturaIM = db.logisticsRoutes.some(r => r.fornecedorId === "futuraim");
          if (!jaTemRotaFuturaIM) {
            db.logisticsRoutes.push({ id: "rota-futuraim", fornecedorId: "futuraim", origem: "Local do administrador", destino: "FuturaIM", distanciaKm: 7 });
          }
        }
        return db;
      }
    } catch (e) {
      console.error("Erro ao carregar dados salvos, iniciando com dados padrão.", e);
    }
    db = seedDB();
    persist();
    return db;
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error("Erro ao salvar dados:", e);
      if (window.Toast) Toast.show("Não foi possível salvar os dados (armazenamento cheio ou indisponível).", "error");
    }
  }

  function get() { return db; }

  function replaceAll(newDb) { db = newDb; persist(); }

  function resetAll() {
    db = seedDB();
    persist();
  }

  return { load, persist, get, replaceAll, resetAll };
})();
/* ==========================================================================
   FUNÇÕES UTILITÁRIAS — nunca aproximam ou inventam valores
   ========================================================================== */

function formatBRL(valor) {
  if (valor === null || valor === undefined || isNaN(valor)) return "—";
  return "R$ " + Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNum(valor) {
  if (valor === null || valor === undefined || isNaN(valor)) return "—";
  return Number(valor).toLocaleString("pt-BR");
}

function formatDateBR(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function formatMonthLabel(ym) {
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  const [y, m] = ym.split("-");
  return meses[parseInt(m, 10) - 1] + "/" + y.slice(2);
}

function classificarMargem(margemPct, thresholds) {
  const boa = (thresholds && thresholds.margemBoa) || 40;
  const baixa = (thresholds && thresholds.margemBaixa) || 20;
  if (margemPct === null || margemPct === undefined) return { label: "—", tone: "gray" };
  if (margemPct >= boa) return { label: "Margem boa", tone: "green" };
  if (margemPct >= baixa) return { label: "Margem baixa", tone: "amber" };
  return { label: "Necessita revisão", tone: "red" };
}

function calcularMargem(custo, venda) {
  if (custo === null || custo === undefined || venda === null || venda === undefined) {
    return { custo, venda, lucro: null, margemPct: null };
  }
  const lucro = venda - custo;
  const margemPct = venda > 0 ? (lucro / venda) * 100 : null;
  return { custo, venda, lucro, margemPct };
}

function buscarFaixa(faixas, quantidade) {
  return (faixas || []).find(f => quantidade >= f.min && quantidade <= f.max) || null;
}

function margemCellHtml(margem, thresholds) {
  if (margem.custo === null || margem.custo === undefined) {
    return `<span class="badge tone-gray">Sem custo cadastrado</span>`;
  }
  if (margem.venda === null || margem.venda === undefined) {
    return `<span class="badge tone-gray">Sem preço cadastrado</span>`;
  }
  const classe = classificarMargem(margem.margemPct, thresholds);
  return `
    <span style="font-family:var(--font-mono); font-weight:600;">${formatBRL(margem.lucro)}</span>
    &nbsp;·&nbsp;
    <span class="badge tone-${classe.tone}">${margem.margemPct.toFixed(1)}% · ${classe.label}</span>
  `;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getSupplierById(id) {
  if (!id) return null;
  return Store.get().suppliers.find(s => s.id === id) || null;
}

function getProductById(id) {
  return Store.get().products.find(p => p.id === id) || null;
}

function getClientById(id) {
  if (!id) return null;
  return Store.get().clients.find(c => c.id === id) || null;
}

function countProdutosDoFornecedor(fornecedorId) {
  let count = 0;
  Store.get().products.forEach(p => {
    (p.materiais || []).forEach(m => { if (m.fornecedorId === fornecedorId) count++; });
  });
  return count;
}

/* Retorna [{ymLabel, ym, valor}] dos últimos N meses (incluindo meses sem dado, valor 0) */
function lastNMonthsSeries(n) {
  const arr = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
    arr.push({ ym, label: formatMonthLabel(ym), valor: 0 });
  }
  return arr;
}

function withinPeriod(dateStr, days) {
  if (days === "tudo") return true;
  const d = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - Number(days));
  return d >= cutoff;
}

function isCurrentMonth(dateStr) {
  return monthKey(dateStr) === monthKey(todayISO());
}

/* ==========================================================================
   Modal, Toast e helpers de tabela — compartilhados entre os dois arquivos
   ========================================================================== */
function renderModalHost() {
  if (document.getElementById("modal-host")) return;
  const div = document.createElement("div");
  div.id = "modal-host";
  document.body.appendChild(div);
}

function openModal({ title, bodyHtml, footerHtml, size, onOpen }) {
  renderModalHost();
  const host = document.getElementById("modal-host");
  host.innerHTML = `
    <div class="modal-overlay" id="activeModalOverlay">
      <div class="modal ${size === "lg" ? "modal--lg" : ""}" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
        <div class="modal__header">
          <h3>${title}</h3>
          <button class="modal__close" id="modalCloseBtn" type="button" aria-label="Fechar">
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div class="modal__body">${bodyHtml || `<div class="modal__placeholder">Nada para exibir.</div>`}</div>
        <div class="modal__footer">${footerHtml || `<button class="btn btn-secondary" id="modalCancelBtn" type="button">Fechar</button>`}</div>
      </div>
    </div>
  `;
  requestAnimationFrame(() => {
    document.getElementById("activeModalOverlay").classList.add("open");
  });
  const overlay = document.getElementById("activeModalOverlay");
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
  const cancelBtn = document.getElementById("modalCancelBtn");
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  if (onOpen) onOpen();
}

function closeModal() {
  const overlay = document.getElementById("activeModalOverlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  setTimeout(() => {
    const host = document.getElementById("modal-host");
    if (host) host.innerHTML = "";
  }, 200);
}

function confirmModal(title, message, onConfirm, confirmLabel) {
  openModal({
    title,
    bodyHtml: `<p style="font-size:13.5px; color:var(--color-text-700); line-height:1.6;">${message}</p>`,
    footerHtml: `
      <button class="btn btn-secondary" id="modalCancelBtn" type="button">Cancelar</button>
      <button class="btn btn-danger" id="modalConfirmBtn" type="button">${confirmLabel || "Confirmar"}</button>
    `,
    onOpen: () => {
      document.getElementById("modalConfirmBtn").addEventListener("click", () => {
        onConfirm();
        closeModal();
      });
    }
  });
}

/* ---------- Toast ---------- */
const Toast = {
  show(message, tone) {
    const host = document.getElementById("toast-host");
    const el = document.createElement("div");
    el.className = "toast";
    const icon = tone === "error"
      ? `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>`
      : `<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>`;
    el.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
    host.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, 2800);
  }
};

/* ---------- Tabelas / estados vazios ---------- */
function emptyStateHtml(message, sub) {
  return `
    <div class="table-empty">
      <div class="table-empty__icon"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h7"/></svg></div>
      <div class="table-empty__title">${message}</div>
      <div class="table-empty__sub">${sub || ""}</div>
    </div>
  `;
}

function reusableTable(columns, emptyMessage, emptySub) {
  const ths = columns.map(c => `<th>${c}</th>`).join("");
  return `
    <div class="card table-card">
      <table class="data-table"><thead><tr>${ths}</tr></thead></table>
      ${emptyStateHtml(emptyMessage, emptySub)}
    </div>
  `;
}

function dataTable(columns, rows) {
  const ths = columns.map(c => `<th>${c}</th>`).join("");
  return `
    <div class="card table-card">
      <table class="data-table">
        <thead><tr>${ths}</tr></thead>
        <tbody>${rows.join("")}</tbody>
      </table>
    </div>
  `;
}

/* ---------- Gráficos inline em SVG (sem bibliotecas externas) ---------- */

/* ---------- Helpers usados pelo orçamento (e por outras telas) ---------- */
function clienteOptionsHtml(selectedId) {
  const clientes = Store.get().clients;
  return `<option value="">Cliente avulso (não cadastrado)</option>` + clientes.map(c =>
    `<option value="${c.id}" ${c.id === selectedId ? "selected" : ""}>${escapeHtml(c.nome)}</option>`).join("");
}

/* Custo logístico aplicável a um fornecedor, para uso no Orçamento PDV */
function custoLogisticoDoFornecedor(fornecedorId) {
  if (!fornecedorId) return null;
  const db = Store.get();
  const rota = db.logisticsRoutes.find(r => r.fornecedorId === fornecedorId);
  if (!rota) return null;
  return rota.distanciaKm * db.logisticsConfig.custoPorKm;
}


function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema === "escuro" ? "dark" : "light");
}
