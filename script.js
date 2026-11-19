// Script do painel do banco (index.html).
// Todas as telas ficam no mesmo arquivo HTML e o JavaScript mostra uma por vez.

// Atalho para pegar um elemento pelo id
const $ = (id) => document.getElementById(id);

// Formata um número como dinheiro: 1234.5 → "R$ 1.234,50"
const reais = (valor) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Ícone SVG do "estoque" que fica no começo do index.html: ico("pix")
const ico = (nome) => `<svg class="ico"><use href="#i-${nome}"/></svg>`;


// ===== 1. Movimentações da conta =====
// Os dados ficam só aqui. O JavaScript monta com eles o extrato do Início,
// o extrato completo, o resumo de entradas/saídas e as compras do cartão.
// Valor positivo = entrada, negativo = saída.
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

// Nome do tipo sem acento e em minúsculas, para virar classe do CSS: "Cartão" → "cartao"
const semAcento = (texto) => texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function linhaDoExtrato(mov) {
  const entrada = mov.valor > 0;
  const status = mov.pendente
    ? '<span class="status pendente">◷ Pendente</span>'
    : '<span class="status concluido">✓ Concluído</span>';

  return `
    <tr data-tipo="${entrada ? "entrada" : "saida"}">
      <td class="descricao"><span class="icone-mov tipo-${semAcento(mov.tipo)}">${ico(entrada ? "entrada" : "saida")}</span> ${mov.nome}</td>
      <td>${mov.data}</td>
      <td>${mov.tipo}</td>
      <td>${status}</td>
      <td class="valor ${entrada ? "positivo" : ""}">${entrada ? "+" : "−"} ${reais(Math.abs(mov.valor))}</td>
    </tr>`;
}

$("extrato-recente").innerHTML = movimentacoes.slice(0, 5).map(linhaDoExtrato).join("");

// Extrato completo separado por dia: antes do 1º item de cada dia entra um título.
// "3 nov" vira "3 de novembro"; "Hoje, 09:42" vira "Hoje".
const meses = { out: "outubro", nov: "novembro" };
let diaAnterior = "";
$("tabela-extrato").innerHTML = movimentacoes.map(function (mov) {
  const dia = mov.data.split(",")[0].replace(/(\d+) (\w+)/, (_, d, m) => `${d} de ${meses[m]}`);
  const titulo = dia !== diaAnterior ? `<tr class="grupo-dia"><td colspan="5">${dia}</td></tr>` : "";
  diaAnterior = dia;
  return titulo + linhaDoExtrato(mov);
}).join("");

// Resumo do extrato: soma as entradas e as saídas, e as saídas por tipo
let entradas = 0;
let saidas = 0;
const gastosPorTipo = {}; // ex.: { "Cartão": 500.2, "TED": 1200, ... }
movimentacoes.forEach(function (mov) {
  if (mov.valor > 0) {
    entradas += mov.valor;
  } else {
    saidas -= mov.valor;
    gastosPorTipo[mov.tipo] = (gastosPorTipo[mov.tipo] || 0) - mov.valor;
  }
});
$("resumo-entradas").textContent = "+ " + reais(entradas);
$("resumo-saidas").textContent = "− " + reais(saidas);

// Rosca "Para onde foi seu dinheiro": do maior gasto para o menor
const tiposGasto = Object.entries(gastosPorTipo).sort((a, b) => b[1] - a[1]);

$("legenda-gastos").innerHTML = tiposGasto.map(([tipo, valor]) => `
  <li>
    <div class="compra">
      <span class="icone-mov tipo-${semAcento(tipo)}">${ico("saida")}</span>
      <div><strong>${tipo}</strong><span class="texto-fraco">${Math.round((valor / saidas) * 100)}% dos gastos</span></div>
    </div>
    <span class="valor">${reais(valor)}</span>
  </li>`).join("");

// Cada fatia usa a mesma cor do ícone (lida do CSS, então a cor fica só num lugar)
const icones = $("legenda-gastos").querySelectorAll(".icone-mov");
let inicioFatia = 0;
const fatias = tiposGasto.map(function ([, valor], i) {
  const cor = getComputedStyle(icones[i]).getPropertyValue("--cor").trim();
  const fimFatia = inicioFatia + (valor / saidas) * 100;
  const fatia = `rgb(${cor}) ${inicioFatia}% ${fimFatia}%`;
  inicioFatia = fimFatia;
  return fatia;
});
$("rosca").style.background = `conic-gradient(${fatias.join(", ")})`;
$("rosca-total").textContent = reais(saidas);

// ===== 2. Contatos e contas a pagar =====
// Também ficam só aqui e aparecem em várias telas.
// "cor" é a cor da bolinha do contato, em R G B (usada no CSS como --cor).
const contatos = [
  { nome: "Lucas Ferreira", chave: "lucas.ferreira@email.com", banco: "Prisma Bank", agencia: "0001", conta: "48213-0", cor: "34 224 232" },
  { nome: "Renata Lima",    chave: "(11) 97654-3210",          banco: "Itaú",        agencia: "0412", conta: "12345-6", cor: "167 139 250" },
  { nome: "Juliana Costa",  chave: "juliana.costa@email.com",  banco: "Bradesco",    agencia: "2231", conta: "77881-2", cor: "245 184 75" },
  { nome: "Marcos Alves",   chave: "(21) 98877-6655",          banco: "Caixa",       agencia: "1520", conta: "00321-9", cor: "244 114 182" },
];

const contas = [
  { nome: "Conta de luz", vence: "10 nov", valor: 184.37, codigo: "83640000001 84370052010 12345678901 34567890123" },
  { nome: "Internet",     vence: "15 nov", valor: 99.9,   codigo: "23793381286 00000999024 81000063307 10000009990" },
  { nome: "Água",         vence: "20 nov", valor: 76.2,   codigo: "82650000000 76200097202 51120230000 00000762002" },
];

const saldoConta = 24860.35;

// "Renata Lima" → "RL"
const iniciais = (nome) => nome.split(" ").map((parte) => parte[0]).join("").slice(0, 2);

// Bolinhas de contato (Pix rápido no Início e no formulário de Pix)
document.querySelectorAll(".contatos").forEach(function (lugar) {
  lugar.innerHTML = contatos.map((c, i) => `
    <button type="button" class="contato" data-contato="${i}" data-acao="pix">
      <span class="avatar" style="--cor: ${c.cor}">${iniciais(c.nome)}</span>${c.nome.split(" ")[0]}
    </button>`).join("");
});

// Favorecidos da tela de Transferências
$("favorecidos").innerHTML = contatos.map((c, i) => `
  <li>
    <button type="button" class="favorecido" data-contato="${i}" data-acao="transferir">
      <span class="avatar" style="--cor: ${c.cor}">${iniciais(c.nome)}</span>
      <div><strong>${c.nome}</strong><span class="texto-fraco">${c.banco} · Ag. ${c.agencia} · Conta ${c.conta}</span></div>
    </button>
  </li>`).join("");

// Contas a pagar (Início e tela Pagar)
document.querySelectorAll(".lista-contas").forEach(function (lista) {
  lista.innerHTML = contas.map((c, i) => `
    <li>
      <div><strong>${c.nome}</strong><span class="texto-fraco">Vence em ${c.vence}</span></div>
      <div class="lista-direita">
        <span class="valor">${reais(c.valor)}</span>
        <button type="button" class="botao botao-pequeno" data-conta="${i}">Pagar</button>
      </div>
    </li>`).join("");
});

// QR Code de enfeite em "Receber Pix": uma grade 21×21 com os 3 quadrados
// dos cantos (como num QR de verdade) e o resto "aleatório" com uma conta fixa.
function quadradoQR(linha, coluna) {
  for (const [l0, c0] of [[0, 0], [0, 14], [14, 0]]) {
    const y = linha - l0;
    const x = coluna - c0;
    if (y >= -1 && y <= 7 && x >= -1 && x <= 7) {
      if (y < 0 || y > 6 || x < 0 || x > 6) return false; // espaço em volta do quadrado
      return y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4);
    }
  }
  return (linha * 31 + coluna * 17 + linha * coluna * 7) % 11 < 5;
}

let quadrados = "";
for (let l = 0; l < 21; l++) {
  for (let c = 0; c < 21; c++) {
    if (quadradoQR(l, c)) quadrados += `<rect x="${c}" y="${l}" width="1" height="1"/>`;
  }
}
$("qr-pix").innerHTML = `<svg viewBox="0 0 21 21" shape-rendering="crispEdges">${quadrados}</svg>`;

// Embaixo dos campos de valor: mostra o saldo e não deixa passar dele
document.querySelectorAll(".dica-saldo").forEach((dica) => (dica.textContent = "Saldo disponível: " + reais(saldoConta)));
document.querySelectorAll('input[type="number"][name="valor"]').forEach((campo) => (campo.max = saldoConta));

// Últimas compras do cartão: só as movimentações do tipo "Cartão"
$("lista-compras").innerHTML = movimentacoes
  .filter((mov) => mov.tipo === "Cartão")
  .map((mov) => `
    <li>
      <div class="compra">
        <span class="icone-mov tipo-cartao">${ico("cartao")}</span>
        <div><strong>${mov.nome}</strong><span class="texto-fraco">${mov.data.split(",")[0]}</span></div>
      </div>
      <span class="valor">${reais(-mov.valor)}</span>
    </li>`)
  .join("");


// Saudação do Início de acordo com a hora, e a data de hoje
const hora = new Date().getHours();
$("saudacao-texto").textContent = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
$("data-hoje").textContent = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });


// ===== 3. Trocar de tela =====
// Cada tela é um <main data-tela="nome">. Os links usam "#nome"
// (ex.: href="#extrato"). Quando o # do endereço muda, mostramos a tela certa.
// Usar o # também faz o botão "voltar" do navegador funcionar.
const telas = document.querySelectorAll("[data-tela]");
const linksMenu = document.querySelectorAll(".menu-link");

function mostrarTela() {
  let nome = window.location.hash.slice(1);

  // Se o nome não existir, abre a tela de início
  if (!document.querySelector(`[data-tela="${nome}"]`)) nome = "inicio";

  telas.forEach(function (tela) {
    tela.hidden = tela.dataset.tela !== nome;
    if (!tela.hidden) document.title = "Prisma Bank | " + tela.dataset.titulo;
  });

  // Deixa destacado no menu o link da tela aberta
  linksMenu.forEach(function (link) {
    link.classList.toggle("ativo", link.getAttribute("href") === "#" + nome);
  });

  $("sidebar").classList.remove("aberto"); // no celular, fecha o menu
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", mostrarTela);
mostrarTela();

// Abre uma tela já com campos preenchidos e coloca o cursor em um deles.
// Ex.: abrirPreenchido("pix", { "pix-chave": "ana@email.com" }, "pix-valor")
function abrirPreenchido(tela, campos, focar) {
  Object.entries(campos).forEach(([id, valor]) => ($(id).value = valor));
  window.location.hash = "#" + tela;
  mostrarTela(); // mostra já, para o campo poder receber o foco
  $(focar).focus();
}

// Cliques nos contatos, favorecidos e botões "Pagar"
document.addEventListener("click", function (evento) {
  const contato = evento.target.closest("[data-contato]");
  const conta = evento.target.closest("[data-conta]");

  if (contato) {
    const c = contatos[contato.dataset.contato];

    if (contato.dataset.acao === "pix") {
      abrirPreenchido("pix", { "pix-chave": c.chave }, "pix-valor");
    } else {
      abrirPreenchido("transferencias", {
        "transf-banco": c.banco,
        "transf-agencia": c.agencia,
        "transf-conta": c.conta,
        "transf-favorecido": c.nome,
      }, "transf-valor");
      // Conta do Prisma Bank: já marca "Entre contas Prisma"
      const modalidade = c.banco === "Prisma Bank" ? "Entre contas" : "TED";
      document.querySelector(`input[name="modalidade"][value="${modalidade}"]`).checked = true;
    }
  }

  if (conta) {
    const c = contas[conta.dataset.conta];
    abrirPreenchido("pagar", {
      "pagar-codigo": c.codigo,
      "pagar-valor": c.valor.toFixed(2),
      "pagar-data": new Date().toISOString().slice(0, 10),
    }, "pagar-valor");
  }
});

// Escolher "Entre contas Prisma" já seleciona o banco Prisma Bank
document.querySelectorAll('input[name="modalidade"]').forEach(function (opcao) {
  opcao.addEventListener("change", function () {
    if (opcao.value === "Entre contas") $("transf-banco").value = "Prisma Bank";
  });
});


// ===== 4. Topo: menu do celular, saldo e notificações =====
$("btn-menu").addEventListener("click", function () {
  $("sidebar").classList.toggle("aberto");
});

// O olho (ou clicar no próprio saldo) esconde e mostra o valor
const saldo = $("saldo-valor");
const saldoOriginal = saldo.innerHTML;
saldo.style.cursor = "pointer";

function alternarSaldo() {
  const esconder = saldo.innerHTML === saldoOriginal;
  saldo.innerHTML = esconder ? "<small>R$</small> •••••" : saldoOriginal;
  $("btn-olho").querySelector("use").setAttribute("href", esconder ? "#i-olho-off" : "#i-olho");
  $("btn-olho").setAttribute("aria-label", esconder ? "Mostrar saldo" : "Esconder saldo");
}

saldo.addEventListener("click", alternarSaldo);
$("btn-olho").addEventListener("click", alternarSaldo);

// Notificações: o sino abre uma caixinha com a lista.
// Clicar numa notificação leva para a tela dela.
const notificacoes = [
  { icone: "entrada", texto: "Você recebeu um Pix de <strong>R$ 850,00</strong> de Lucas Ferreira", quando: "Hoje, 09:42", tela: "extrato" },
  { icone: "pagar",   texto: "Sua <strong>conta de luz</strong> vence em 10 nov", quando: "Ontem", tela: "pagar" },
  { icone: "cartao",  texto: "A fatura do cartão fechou em <strong>R$ 1.284,60</strong>", quando: "8 nov", tela: "cartoes" },
];
let naoLidas = notificacoes.length;

function mostrarNotificacoes() {
  $("lista-notificacoes").innerHTML = notificacoes.length
    ? notificacoes.map((n) => `
        <li>
          <a href="#${n.tela}" class="notificacao">
            <span class="icone-mov">${ico(n.icone)}</span>
            <div><p>${n.texto}</p><span class="texto-fraco">${n.quando}</span></div>
          </a>
        </li>`).join("")
    : `<li class="sem-notificacoes"><span>${ico("check")}</span>Tudo em dia! Nenhuma notificação nova.</li>`;

  $("btn-limpar-notificacoes").hidden = notificacoes.length === 0;
  $("badge-notificacoes").textContent = naoLidas;
  $("badge-notificacoes").hidden = naoLidas === 0;
}

// Usada depois de um Pix, transferência etc. (parte 8)
function novaNotificacao(icone, texto, tela) {
  notificacoes.unshift({ icone, texto, quando: "Agora", tela });
  naoLidas++;
  mostrarNotificacoes();
}

function fecharNotificacoes() {
  $("caixa-notificacoes").hidden = true;
  $("btn-notificacao").setAttribute("aria-expanded", "false");
}

$("btn-notificacao").addEventListener("click", function () {
  const caixa = $("caixa-notificacoes");
  caixa.hidden = !caixa.hidden;
  this.setAttribute("aria-expanded", String(!caixa.hidden));

  if (!caixa.hidden) {
    naoLidas = 0; // abriu = leu
    mostrarNotificacoes();
  }
});

$("btn-limpar-notificacoes").addEventListener("click", function () {
  notificacoes.length = 0;
  mostrarNotificacoes();
});

// Fecha ao clicar fora, ao clicar numa notificação ou ao apertar Esc
document.addEventListener("click", function (evento) {
  if (!evento.target.closest(".notificacoes") || evento.target.closest(".notificacao")) fecharNotificacoes();
});
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") fecharNotificacoes();
});

mostrarNotificacoes();


// ===== 5. Modo claro e modo escuro =====
// O tema escolhido fica salvo no navegador, então continua igual
// quando a pessoa fecha e abre o site de novo.
try {
  if (localStorage.getItem("prisma-tema") === "claro") document.body.classList.add("claro");
} catch (erro) {
  // Se o navegador bloquear, o site abre no tema escuro
}

// O botão do topo e o de Configurações fazem a mesma coisa
document.querySelectorAll("#btn-tema, #btn-tema-config").forEach(function (botao) {
  botao.addEventListener("click", function () {
    const claro = document.body.classList.toggle("claro");
    try {
      localStorage.setItem("prisma-tema", claro ? "claro" : "escuro");
    } catch (erro) {
      // Sem salvar: o tema volta ao normal ao recarregar o site
    }
  });
});


// ===== 6. Extrato: filtrar entradas e saídas =====
const botoesFiltro = document.querySelectorAll(".filtro");

botoesFiltro.forEach(function (botao) {
  botao.addEventListener("click", function () {
    const filtro = botao.dataset.filtro; // "todos", "entrada" ou "saida"

    botoesFiltro.forEach((outro) => outro.classList.toggle("ativo", outro === botao));

    document.querySelectorAll("#tabela-extrato tr:not(.grupo-dia)").forEach(function (linha) {
      linha.hidden = filtro !== "todos" && linha.dataset.tipo !== filtro;
    });

    // Esconde o título do dia quando todas as linhas daquele dia sumiram
    document.querySelectorAll("#tabela-extrato .grupo-dia").forEach(function (titulo) {
      let linha = titulo.nextElementSibling;
      let temVisivel = false;
      while (linha && !linha.classList.contains("grupo-dia")) {
        if (!linha.hidden) temVisivel = true;
        linha = linha.nextElementSibling;
      }
      titulo.hidden = !temVisivel;
    });
  });
});


// ===== 7. Cartões =====
// Mostrar e esconder o número
let numeroVisivel = false;
$("btn-mostrar-numero").addEventListener("click", function () {
  numeroVisivel = !numeroVisivel;
  $("numero-cartao").textContent = numeroVisivel ? "5312 7740 1985 4821" : "•••• •••• •••• 4821";
  this.querySelector("small").textContent = numeroVisivel ? "Esconder número" : "Mostrar número";
});

// Bloquear e desbloquear
$("btn-bloquear").addEventListener("click", function () {
  const bloqueado = $("cartao-visual").classList.toggle("bloqueado");
  $("status-cartao").classList.toggle("bloqueado", bloqueado);
  $("status-cartao").textContent = bloqueado ? "Bloqueado" : "Ativo";
  this.querySelector("small").textContent = bloqueado ? "Desbloquear" : "Bloquear";
});

// Ajustar o limite: o botão mostra a barrinha e ela recalcula o disponível.
// O Início também mostra o limite, então atualiza os dois lugares.
const faturaAtual = 1284.6;

function atualizarLimite() {
  const total = Number($("limite-total").value);
  $("limite-total-texto").textContent = reais(total);
  document.querySelectorAll(".limite-disponivel").forEach((el) => (el.textContent = reais(total - faturaAtual)));
  document.querySelectorAll(".barra-limite span").forEach((el) => (el.style.width = (faturaAtual / total) * 100 + "%"));
}

$("btn-limite").addEventListener("click", function () {
  $("ajuste-limite").hidden = !$("ajuste-limite").hidden;
});
$("limite-total").addEventListener("input", atualizarLimite);
atualizarLimite();


// ===== 8. Formulários e comprovante =====
// Pix, Transferência, Pagar e Recarga não trocam de arquivo:
// o JavaScript pega o que foi preenchido, monta o comprovante e abre a tela dele.
document.querySelectorAll("form.formulario").forEach(function (formulario) {
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); // não recarrega a página

    const dados = new FormData(formulario);
    const valor = Number(dados.get("valor"));

    $("comp-tipo").textContent = dados.get("tipo") || "—";
    $("comp-destino").textContent = dados.get("destino") || "—";
    $("comp-valor").textContent = valor > 0 ? reais(valor) : "—";
    $("comp-data").textContent = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
    // Código de autenticação de mentira, só para parecer um recibo de verdade
    $("comp-codigo").textContent = Math.random().toString(16).slice(2, 10).toUpperCase();

    // Avisa no sino. O textContent acima já é seguro; aqui escapamos o que a pessoa digitou.
    const destino = $("comp-destino").textContent.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
    novaNotificacao("check",`${dados.get("tipo")} de <strong>${$("comp-valor").textContent}</strong> para ${destino}`, "comprovante");

    formulario.reset();
    window.location.hash = "#comprovante";
  });
});
