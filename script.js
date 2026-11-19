// Prisma Bank: JavaScript do index.html.
// Todas as telas estão no mesmo HTML. Este arquivo mostra uma de cada vez,
// monta as listas com os dados abaixo e tem as funções que os botões chamam
// (no HTML: onclick="nomeDaFuncao()").

const $ = (id) => document.getElementById(id); // pega um elemento pelo id
const reais = (valor) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); // 1234.5 → "R$ 1.234,50"

// Coloca o mesmo HTML em todos os elementos que combinam com o seletor
function preencher(seletor, html) {
  document.querySelectorAll(seletor).forEach(function (elemento) {
    elemento.innerHTML = html;
  });
}


// ===== 1. Dados: as listas do site saem daqui =====
// Valor positivo = entrada, negativo = saída
const movimentacoes = [
  { nome: "Lucas Ferreira",      data: "Hoje, 09:42", tipo: "Pix",     valor: 850 },
  { nome: "Supermercado Aurora", data: "Hoje, 08:15", tipo: "Cartão",  valor: -212.9 },
  { nome: "Conta de luz",        data: "3 nov",       tipo: "Boleto",  valor: -184.37, pendente: true },
  { nome: "Renata Lima",         data: "3 nov",       tipo: "TED",     valor: -1200 },
  { nome: "Recarga de celular",  data: "2 nov",       tipo: "Recarga", valor: -30 },
  { nome: "Salário",             data: "1 nov",       tipo: "TED",     valor: 5200 },
  { nome: "Farmácia Bem Estar",  data: "31 out",      tipo: "Cartão",  valor: -67.4 },
  { nome: "Juliana Costa",       data: "30 out",      tipo: "Pix",     valor: 300 },
  { nome: "Streaming",           data: "29 out",      tipo: "Cartão",  valor: -39.9 },
  { nome: "Posto Central",       data: "28 out",      tipo: "Cartão",  valor: -180 },
];

const contatos = [
  { nome: "Lucas Ferreira", chave: "lucas.ferreira@email.com", banco: "Prisma Bank", agencia: "0001", conta: "48213-0" },
  { nome: "Renata Lima",    chave: "(11) 97654-3210",          banco: "Itaú",        agencia: "0412", conta: "12345-6" },
  { nome: "Juliana Costa",  chave: "juliana.costa@email.com",  banco: "Bradesco",    agencia: "2231", conta: "77881-2" },
  { nome: "Marcos Alves",   chave: "(21) 98877-6655",          banco: "Caixa",       agencia: "1520", conta: "00321-9" },
];

const contas = [
  { nome: "Conta de luz", vence: "10 nov", valor: 184.37, codigo: "83640000001 84370052010 12345678901 34567890123" },
  { nome: "Internet",     vence: "15 nov", valor: 99.9,   codigo: "23793381286 00000999024 81000063307 10000009990" },
  { nome: "Água",         vence: "20 nov", valor: 76.2,   codigo: "82650000000 76200097202 51120230000 00000762002" },
];

// "tela" é para onde a notificação leva quando alguém clica nela
const notificacoes = [
  { icone: "entrada", texto: "Você recebeu um Pix de <strong>R$ 850,00</strong> de Lucas Ferreira", quando: "Hoje, 09:42", tela: "extrato" },
  { icone: "pagar",   texto: "Sua <strong>conta de luz</strong> vence em 10 nov", quando: "Ontem", tela: "pagar" },
  { icone: "cartao",  texto: "A fatura do cartão fechou em <strong>R$ 1.284,60</strong>", quando: "8 nov", tela: "cartoes" },
];


// ===== 2. Listas montadas com os dados =====
// Uma linha da tabela de movimentações
function linhaDoExtrato(mov) {
  const entrada = mov.valor > 0;
  return `
    <tr>
      <td class="descricao">${mov.nome}${mov.pendente ? '<small class="pendente">Pendente</small>' : ""}</td>
      <td>${mov.data}</td>
      <td>${mov.tipo}</td>
      <td class="valor ${entrada ? "positivo" : ""}">${entrada ? "+" : "−"} ${reais(Math.abs(mov.valor))}</td>
    </tr>`;
}

// Início: as 5 movimentações mais recentes
preencher("#extrato-recente", movimentacoes.slice(0, 7).map(linhaDoExtrato).join(""));

// Extrato: todas as movimentações, só as entradas ou só as saídas
function mostrarExtrato(filtro) {
  const lista = movimentacoes.filter(function (mov) {
    if (filtro === "entradas") return mov.valor > 0;
    if (filtro === "saidas") return mov.valor < 0;
    return true;
  });
  preencher("#tabela-extrato", lista.map(linhaDoExtrato).join(""));
}
mostrarExtrato("todas");

// Botões Todas / Entradas / Saídas
function filtrar(botao, filtro) {
  document.querySelector(".filtro.ativo").classList.remove("ativo");
  botao.classList.add("ativo");
  mostrarExtrato(filtro);
}

// Soma das entradas, das saídas e do gasto de cada tipo
let entradas = 0;
let saidas = 0;
const gastos = {}; // ex.: { TED: 1200, Cartão: 500.2 }
movimentacoes.forEach(function (mov) {
  if (mov.valor > 0) {
    entradas += mov.valor;
  } else {
    saidas -= mov.valor;
    gastos[mov.tipo] = (gastos[mov.tipo] || 0) - mov.valor;
  }
});
$("resumo-entradas").textContent = "+ " + reais(entradas);
$("resumo-saidas").textContent = "− " + reais(saidas);

// "Para onde foi seu dinheiro": uma barra por tipo, do maior gasto para o menor
const tipos = Object.entries(gastos).sort((a, b) => b[1] - a[1]);
preencher("#gastos", tipos.map(function ([tipo, valor]) {
  const porcento = Math.round((valor / saidas) * 100);
  return `
    <li>
      <span>${tipo}</span>
      <div class="barra"><span style="width: ${porcento}%"></span></div>
      <span class="texto-fraco">${porcento}%</span>
      <span class="valor">${reais(valor)}</span>
    </li>`;
}).join(""));

// "Renata Lima" → "RL"
const iniciais = (nome) => nome.split(" ").map((parte) => parte[0]).join("");

// Pix rápido (Início e tela Pix): clicar abre o Pix com a chave já preenchida
preencher(".contatos", contatos.map((c, i) => `
  <button type="button" class="contato" onclick="pixPara(${i})">
    <span class="avatar">${iniciais(c.nome)}</span>${c.nome.split(" ")[0]}
  </button>`).join(""));

// Favorecidos (Transferências): clicar preenche banco, agência, conta e nome
preencher("#favorecidos", contatos.map((c, i) => `
  <li>
    <button type="button" class="favorecido" onclick="transferirPara(${i})">
      <span class="avatar">${iniciais(c.nome)}</span>
      <div><strong>${c.nome}</strong><span class="texto-fraco">${c.banco} · Ag. ${c.agencia} · Conta ${c.conta}</span></div>
    </button>
  </li>`).join(""));

// Contas a pagar (Início e Pagar): o botão "Pagar" preenche o boleto
preencher(".lista-contas", contas.map((c, i) => `
  <li>
    <div><strong>${c.nome}</strong><span class="texto-fraco">Vence em ${c.vence}</span></div>
    <div class="lista-direita">
      <span class="valor">${reais(c.valor)}</span>
      <button type="button" class="botao botao-secundario botao-pequeno" onclick="pagarConta(${i})">Pagar</button>
    </div>
  </li>`).join(""));

// Últimas compras do cartão: só as movimentações do tipo "Cartão"
preencher("#lista-compras", movimentacoes.filter((mov) => mov.tipo === "Cartão").map((mov) => `
  <li>
    <div><strong>${mov.nome}</strong><span class="texto-fraco">${mov.data}</span></div>
    <span class="valor">${reais(-mov.valor)}</span>
  </li>`).join(""));

// Saudação de acordo com a hora, e a data de hoje
const hora = new Date().getHours();
$("saudacao").textContent = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
$("data-hoje").textContent = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });


// ===== 3. Trocar de tela =====
// Cada tela é um <main data-tela="nome"> e os links apontam para "#nome".
// Quando o # do endereço muda, só a tela com esse nome fica visível.
function mostrarTela() {
  let nome = location.hash.slice(1);
  if (!document.querySelector(`[data-tela="${nome}"]`)) nome = "inicio"; // # vazio ou errado

  document.querySelectorAll("[data-tela]").forEach(function (tela) {
    tela.hidden = tela.dataset.tela !== nome;
    if (!tela.hidden) document.title = "Prisma Bank | " + tela.dataset.titulo;
  });
  document.querySelectorAll(".menu-link").forEach(function (link) {
    link.classList.toggle("ativo", link.getAttribute("href") === "#" + nome);
  });

  $("sidebar").classList.remove("aberto"); // no celular, fecha o menu
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", mostrarTela);
mostrarTela();

// Abre a tela na hora (sem esperar o "hashchange") para pôr o cursor num campo dela
function abrirTela(nome, campo) {
  location.hash = nome;
  mostrarTela();
  $(campo).focus();
}

function pixPara(i) {
  $("pix-chave").value = contatos[i].chave;
  abrirTela("pix", "pix-valor");
}

function transferirPara(i) {
  const c = contatos[i];
  $("transf-banco").value = c.banco;
  $("transf-agencia").value = c.agencia;
  $("transf-conta").value = c.conta;
  $("transf-favorecido").value = c.nome;
  abrirTela("transferencias", "transf-valor");
}

function pagarConta(i) {
  $("pagar-codigo").value = contas[i].codigo;
  $("pagar-valor").value = contas[i].valor.toFixed(2);
  $("pagar-data").value = new Date().toLocaleDateString("en-CA"); // hoje, no formato do campo: 2026-11-19
  abrirTela("pagar", "pagar-valor");
}


// ===== 4. Topo: menu do celular, saldo e notificações =====
function alternarMenu() {
  $("sidebar").classList.toggle("aberto");
}

// O olho esconde e mostra o saldo (e troca o desenho do olho)
let saldoVisivel = true;
function alternarSaldo() {
  saldoVisivel = !saldoVisivel;
  $("saldo-numero").textContent = saldoVisivel ? "24.860,35" : "••••••";
  $("icone-olho").setAttribute("href", saldoVisivel ? "#i-olho" : "#i-olho-off");
}

let naoLidas = notificacoes.length;

function mostrarNotificacoes() {
  preencher("#lista-notificacoes", notificacoes.length
    ? notificacoes.map((n) => `
        <li><a href="#${n.tela}" class="notificacao">
          <svg class="ico"><use href="#i-${n.icone}"/></svg>
          <div><p>${n.texto}</p><span class="texto-fraco">${n.quando}</span></div>
        </a></li>`).join("")
    : '<li class="texto-fraco">Nenhuma notificação.</li>');

  $("btn-limpar").hidden = notificacoes.length === 0;
  $("badge").textContent = naoLidas;
  $("badge").hidden = naoLidas === 0;
}
mostrarNotificacoes();

// O sino abre e fecha a caixinha. Abrir = ler, então o número some.
function alternarNotificacoes() {
  $("caixa-notificacoes").hidden = !$("caixa-notificacoes").hidden;
  naoLidas = 0;
  mostrarNotificacoes();
}

function limparNotificacoes() {
  notificacoes.length = 0; // esvazia a lista
  mostrarNotificacoes();
}

// Clicar fora da caixinha (ou numa notificação) fecha ela
document.addEventListener("click", function (evento) {
  if (!evento.target.closest(".notificacoes") || evento.target.closest(".notificacao")) {
    $("caixa-notificacoes").hidden = true;
  }
});


// ===== 5. Cartões =====
let numeroVisivel = false;
function alternarNumero(botao) {
  numeroVisivel = !numeroVisivel;
  $("numero-cartao").textContent = numeroVisivel ? "5312 7740 1985 4821" : "•••• •••• •••• 4821";
  botao.querySelector("span").textContent = numeroVisivel ? "Esconder número" : "Mostrar número";
}

function bloquearCartao(botao) {
  const bloqueado = $("cartao").classList.toggle("bloqueado");
  $("status-cartao").textContent = bloqueado ? "Bloqueado" : "Ativo";
  botao.querySelector("span").textContent = bloqueado ? "Desbloquear" : "Bloquear";
}

function alternarAjuste() {
  $("ajuste-limite").hidden = !$("ajuste-limite").hidden;
}

// O limite aparece no Início e em Cartões: mexer na barrinha atualiza os dois
const fatura = 1284.6;
function atualizarLimite() {
  const limite = Number($("limite-total").value);
  $("limite-total-texto").textContent = reais(limite);
  preencher(".limite-disponivel", reais(limite - fatura));
  document.querySelectorAll(".barra-limite").forEach(function (barra) {
    barra.style.width = (fatura / limite) * 100 + "%";
  });
}
atualizarLimite();


// ===== 6. Formulários e comprovante =====
// Pix, Transferência, Pagar e Recarga não recarregam a página:
// o JavaScript monta o comprovante com o que foi preenchido e abre a tela dele.
function enviar(evento) {
  evento.preventDefault();
  const formulario = evento.target;
  const dados = new FormData(formulario);
  const valor = reais(Number(dados.get("valor")));

  $("comp-tipo").textContent = dados.get("tipo");
  $("comp-destino").textContent = dados.get("destino");
  $("comp-valor").textContent = valor;
  $("comp-data").textContent = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  $("comp-codigo").textContent = Math.random().toString(16).slice(2, 10).toUpperCase(); // código inventado

  // Avisa no sino
  notificacoes.unshift({ icone: "check", texto: `${dados.get("tipo")} de <strong>${valor}</strong> · veja o comprovante`, quando: "Agora", tela: "comprovante" });
  naoLidas++;
  mostrarNotificacoes();

  formulario.reset();
  location.hash = "comprovante";
}


// ===== 7. Tema claro ou escuro =====
// A classe "claro" na tag <html> troca as cores (ver o começo do CSS).
// A escolha fica salva no navegador e volta quando o site abre de novo.
function alternarTema() {
  const claro = document.documentElement.classList.toggle("claro");
  localStorage.setItem("prisma-tema", claro ? "claro" : "escuro");
}

if (localStorage.getItem("prisma-tema") === "claro") {
  document.documentElement.classList.add("claro");
}
