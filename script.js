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

const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

// Data contada a partir de hoje: quando(0) → "Hoje", quando(-1) → "Ontem", quando(4) → "23 nov"
function quando(dias) {
  if (dias === 0) return "Hoje";
  if (dias === -1) return "Ontem";
  const data = new Date();
  data.setDate(data.getDate() + dias); // se passar do fim do mês, o Date acerta sozinho
  return data.getDate() + " " + meses[data.getMonth()].slice(0, 3);
}


// ===== 1. Dados: as listas do site saem daqui =====
// Os dias são contados a partir de hoje (0 = hoje, -2 = anteontem, 4 = daqui a 4 dias),
// então as datas ficam certas em qualquer dia que o site for aberto.
let saldo = 24860.35; // diminui a cada Pix, transferência, pagamento ou recarga

// Valor positivo = entrada, negativo = saída. A mais recente fica em cima.
const movimentacoes = [
  { nome: "Lucas Ferreira",      dia: 0,   tipo: "Pix",           valor: 850 },
  { nome: "Supermercado Aurora", dia: 0,   tipo: "Cartão",        valor: -212.9 },
  { nome: "Conta de gás",        dia: -1,  tipo: "Boleto",        valor: -96.4, pendente: true },
  { nome: "Renata Lima",         dia: -2,  tipo: "Transferência", valor: -1200 },
  { nome: "(11) 98765-4321",     dia: -4,  tipo: "Recarga",       valor: -30 },
  { nome: "Salário",             dia: -6,  tipo: "Transferência", valor: 5200 },
  { nome: "Farmácia Bem Estar",  dia: -8,  tipo: "Cartão",        valor: -67.4 },
  { nome: "Juliana Costa",       dia: -9,  tipo: "Pix",           valor: 300 },
  { nome: "Streaming",           dia: -11, tipo: "Cartão",        valor: -39.9 },
  { nome: "Posto Central",       dia: -12, tipo: "Cartão",        valor: -180 },
  { nome: "(11) 98765-4321",     dia: -34, tipo: "Recarga",       valor: -20 },
];

const contatos = [
  { nome: "Lucas Ferreira", chave: "lucas.ferreira@email.com", banco: "Prisma Bank", agencia: "0001", conta: "48213-0" },
  { nome: "Renata Lima",    chave: "(11) 97654-3210",          banco: "Itaú",        agencia: "0412", conta: "12345-6" },
  { nome: "Juliana Costa",  chave: "juliana.costa@email.com",  banco: "Bradesco",    agencia: "2231", conta: "77881-2" },
  { nome: "Marcos Alves",   chave: "(21) 98877-6655",          banco: "Caixa",       agencia: "1520", conta: "00321-9" },
];

const contas = [
  { nome: "Conta de luz", vence: 1, valor: 184.37, codigo: "83640000001 84370052010 12345678901 34567890123" },
  { nome: "Internet",     vence: 4, valor: 99.9,   codigo: "23793381286 00000999024 81000063307 10000009990" },
  { nome: "Água",         vence: 9, valor: 76.2,   codigo: "82650000000 76200097202 51120230000 00000762002" },
];

// "tela" é para onde a notificação leva quando alguém clica nela
const notificacoes = [
  { icone: "entrada", texto: "Você recebeu um Pix de <strong>R$ 850,00</strong> de Lucas Ferreira", dia: 0, tela: "extrato" },
  { icone: "pagar",   texto: "Sua <strong>conta de luz</strong> vence amanhã", dia: 0, tela: "pagar" },
  { icone: "cartao",  texto: "A fatura do cartão fechou em <strong>R$ 1.284,60</strong>", dia: -3, tela: "cartoes" },
];


// ===== 2. Listas montadas com os dados =====
// Valor com sinal: entrada em verde com "+", saída com "−"
function valorComSinal(valor) {
  if (valor > 0) return `<span class="valor positivo">+ ${reais(valor)}</span>`;
  return `<span class="valor">− ${reais(-valor)}</span>`;
}

// Uma linha da tabela de movimentações
function linhaDoExtrato(mov) {
  return `
    <tr>
      <td class="descricao">${mov.nome}${mov.pendente ? '<small class="pendente">Pendente</small>' : ""}</td>
      <td>${quando(mov.dia)}</td>
      <td>${mov.tipo}</td>
      <td class="valor">${valorComSinal(mov.valor)}</td>
    </tr>`;
}

// Extrato: todas as movimentações, só as entradas ou só as saídas
let filtroAtual = "todas";
function mostrarExtrato() {
  const lista = movimentacoes.filter(function (mov) {
    if (filtroAtual === "entradas") return mov.valor > 0;
    if (filtroAtual === "saidas") return mov.valor < 0;
    return true;
  });
  preencher("#tabela-extrato", lista.map(linhaDoExtrato).join(""));
}

// Botões Todas / Entradas / Saídas
function filtrar(botao, filtro) {
  document.querySelector(".filtro.ativo").classList.remove("ativo");
  botao.classList.add("ativo");
  filtroAtual = filtro;
  mostrarExtrato();
}

// Lista com as movimentações de um tipo só (Últimos Pix, Recargas e Últimas compras)
function listaDoTipo(seletor, tipo) {
  preencher(seletor, movimentacoes.filter((mov) => mov.tipo === tipo).map((mov) => `
    <li>
      <div><strong>${mov.nome}</strong><span class="texto-fraco">${quando(mov.dia)}</span></div>
      ${valorComSinal(mov.valor)}
    </li>`).join(""));
}

// Tudo o que muda quando o dinheiro sai: saldo, extrato, gastos e contas.
// Roda quando o site abre e de novo a cada Pix, transferência, pagamento ou recarga.
function mostrarConta() {
  // Saldo no Extrato e embaixo dos campos de valor, que não aceitam mais do que ele
  $("resumo-saldo").textContent = reais(saldo);
  preencher(".saldo-disponivel", "Saldo disponível: " + reais(saldo));
  document.querySelectorAll('input[type="number"]').forEach(function (campo) {
    campo.max = saldo.toFixed(2);
  });

  // Início: as 7 mais recentes. Extrato: todas, com o filtro escolhido.
  preencher("#extrato-recente", movimentacoes.slice(0, 7).map(linhaDoExtrato).join(""));
  mostrarExtrato();
  listaDoTipo("#lista-pix", "Pix");
  listaDoTipo("#lista-recargas", "Recarga");
  listaDoTipo("#lista-compras", "Cartão");

  // Soma das entradas, das saídas e do gasto de cada tipo
  let entradas = 0;
  let saidas = 0;
  const gastos = {}; // ex.: { Cartão: 500.2, Recarga: 50 }
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

  // Contas a pagar (Início e Pagar): o botão "Pagar" preenche o boleto.
  // Se todas forem pagas, a lista fica vazia ("") e aparece o aviso.
  preencher(".lista-contas", contas.map((c, i) => `
    <li>
      <div><strong>${c.nome}</strong><span class="texto-fraco">Vence em ${quando(c.vence)}</span></div>
      <div class="lista-direita">
        <span class="valor">${reais(c.valor)}</span>
        <button type="button" class="botao botao-secundario botao-pequeno" onclick="pagarConta(${i})">Pagar</button>
      </div>
    </li>`).join("") || '<li class="texto-fraco">Nenhuma conta para pagar.</li>');
}
mostrarConta();

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

// Saudação de acordo com a hora, e a data de hoje
const hora = new Date().getHours();
$("saudacao").textContent = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
$("data-hoje").textContent = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

// Gráfico do Início: os 6 meses antes deste (o mês atual ainda não acabou)
const mesAtual = new Date().getMonth(); // 0 = janeiro ... 11 = dezembro
const mesAntes = (n) => meses[(mesAtual - n + 12) % 12]; // mesAntes(1) = mês passado
document.querySelectorAll(".grafico-barras span").forEach(function (rotulo, i) {
  rotulo.textContent = mesAntes(6 - i).slice(0, 3); // "mai", "jun"... (o CSS põe a maiúscula)
});
$("mes-passado").textContent = mesAntes(1);
$("mes-retrasado").textContent = mesAntes(2);


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
  // Marca a tela aberta no menu e na barra de baixo do celular
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


// ===== 4. Topo e menu do celular =====
// "Mais", na barra de baixo do celular, abre e fecha o menu
function alternarMenu() {
  $("sidebar").classList.toggle("aberto");
}

// O olho esconde e mostra o saldo (e troca o desenho do olho)
let saldoVisivel = true;
function mostrarSaldo() {
  // 24860.35 → "24.860,35" (o "R$" fica no HTML, menor)
  $("saldo-numero").textContent = saldoVisivel ? saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "••••••";
  $("icone-olho").setAttribute("href", saldoVisivel ? "#i-olho" : "#i-olho-off");
}
mostrarSaldo();

function alternarSaldo() {
  saldoVisivel = !saldoVisivel;
  mostrarSaldo();
}

let naoLidas = notificacoes.length;

function mostrarNotificacoes() {
  preencher("#lista-notificacoes", notificacoes.length
    ? notificacoes.map((n) => `
        <li><a href="#${n.tela}" class="notificacao">
          <svg class="ico"><use href="#i-${n.icone}"/></svg>
          <div><p>${n.texto}</p><span class="texto-fraco">${quando(n.dia)}</span></div>
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

// Clicar fora fecha a caixinha de notificações (clicar numa notificação também)
// e o menu do celular
document.addEventListener("click", function (evento) {
  if (!evento.target.closest(".notificacoes") || evento.target.closest(".notificacao")) {
    $("caixa-notificacoes").hidden = true;
  }
  if (!evento.target.closest(".sidebar, .barra-celular")) {
    $("sidebar").classList.remove("aberto");
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

// A fatura fechou há 3 dias e vence daqui a 4
preencher(".fatura-fechou", quando(-3));
preencher(".fatura-vence", quando(4));


// ===== 6. Formulários e comprovante =====
// Pix, Transferência, Pagar e Recarga não recarregam a página: o valor sai do saldo,
// entra no extrato e o comprovante abre com o que foi preenchido.
function enviar(evento) {
  evento.preventDefault();
  const formulario = evento.target;
  const dados = new FormData(formulario);
  const tipo = dados.get("tipo");
  const destino = dados.get("destino");
  const valor = Number(dados.get("valor"));

  // No extrato aparece o nome do contato ou da conta, quando é um deles
  let nome = destino;
  const contato = contatos.find((c) => c.chave === destino);
  if (contato) nome = contato.nome;
  const conta = contas.find((c) => c.codigo === destino);
  if (conta) {
    nome = conta.nome;
    contas.splice(contas.indexOf(conta), 1); // conta paga sai da lista
  }

  // O dinheiro sai: o saldo diminui e a movimentação entra no topo do extrato
  saldo -= valor;
  movimentacoes.unshift({ nome: nome, dia: 0, tipo: tipo, valor: -valor });
  mostrarConta();
  mostrarSaldo();

  $("comp-tipo").textContent = tipo;
  $("comp-destino").textContent = nome;
  $("comp-valor").textContent = reais(valor);
  $("comp-data").textContent = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  $("comp-codigo").textContent = Math.random().toString(16).slice(2, 10).toUpperCase(); // código inventado

  // Avisa no sino
  notificacoes.unshift({ icone: "check", texto: `${tipo} de <strong>${reais(valor)}</strong> · veja o comprovante`, dia: 0, tela: "comprovante" });
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
