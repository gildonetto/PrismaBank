// Prisma Bank: JavaScript do index.html.
// Todas as telas estão no mesmo HTML. Este arquivo mostra uma de cada vez,
// monta as listas com os dados abaixo e tem as funções que os botões chamam
// (no HTML: onclick="nomeDaFuncao()"). O tema e a máscara dos campos ficam no comum.js.

const $ = (id) => document.getElementById(id); // pega um elemento pelo id
const reais = (valor) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); // 1234.5 → "R$ 1.234,50"

// Coloca o mesmo HTML em todos os elementos que combinam com o seletor
function preencher(seletor, html) {
  document.querySelectorAll(seletor).forEach(function (elemento) {
    elemento.innerHTML = html;
  });
}

// O mesmo, mas só com texto: para o que a pessoa digitou (nome, e-mail) não virar HTML
function escrever(seletor, texto) {
  document.querySelectorAll(seletor).forEach(function (elemento) {
    elemento.textContent = texto;
  });
}

const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const hoje = new Date().toLocaleDateString("en-CA"); // "2026-11-19", o formato do campo de data

// A data de daqui a alguns dias: dataDe(-1) é ontem, dataDe(4) é daqui a 4 dias
function dataDe(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias); // se passar do fim do mês, o Date acerta sozinho
  return data;
}

// Data curta: quando(0) → "Hoje", quando(-1) → "Ontem", quando(1) → "Amanhã", quando(4) → "23 nov"
function quando(dias) {
  if (dias === 0) return "Hoje";
  if (dias === -1) return "Ontem";
  if (dias === 1) return "Amanhã";
  const data = dataDe(dias);
  return data.getDate() + " " + meses[data.getMonth()].slice(0, 3);
}

// Quantos dias faltam até uma data "aaaa-mm-dd" (negativo se já passou): diasAte("2026-11-24") → 5
const diasAte = (data) => Math.round((new Date(data + "T00:00") - new Date(hoje + "T00:00")) / 86400000);

// Vencimento de uma conta: "Vence hoje", "Vence amanhã", "Vence em 23 nov", "Venceu ontem"...
function vencimento(dias) {
  const data = quando(dias);
  return (dias < 0 ? "Venceu " : "Vence ") + (Math.abs(dias) < 2 ? data.toLowerCase() : "em " + data);
}

// "Renata Lima" → "RL" (primeira letra do primeiro e do último nome)
function iniciais(nome) {
  const partes = nome.trim().split(" ");
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
}

// Código de autenticação inventado, com 8 letras e números ("3FA9C1D2")
const novoCodigo = () => Math.random().toString(16).slice(2, 10).toUpperCase();

// Para a busca: minúsculas e sem acento, assim "salario" acha "Salário"
const simples = (texto) => texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");


// ===== 1. Dados: tudo o que o banco mostra sai daqui =====
// Fica tudo num objeto só ("dados") para ser fácil de salvar no navegador (seção 2).
// Os dias são contados a partir de hoje (0 = hoje, -2 = anteontem, 4 = daqui a 4 dias),
// então as datas ficam certas em qualquer dia que o site for aberto.
let dados = {
  saldo: 24860.35, // diminui a cada Pix, transferência, pagamento ou recarga
  caixinha: 3200,  // dinheiro guardado para a viagem...
  meta: 5000,      // ...que precisa de R$ 5.000
  fatura: 1284.6,  // fatura do cartão de crédito
  limite: 8000,    // limite do cartão
  naoLidas: 3,     // número em cima do sino
  usuario: { nome: "Ana Souza", email: "ana.souza@email.com", celular: "(11) 98765-4321" },

  // Valor positivo = entrada, negativo = saída. A mais recente fica em cima.
  movimentacoes: [
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
  ],

  // Pix rápido e favorecidos. Quem é salvo numa transferência entra aqui sem chave Pix.
  contatos: [
    { nome: "Lucas Ferreira", chave: "lucas.ferreira@email.com", banco: "Prisma Bank", agencia: "0001", conta: "48213-0" },
    { nome: "Renata Lima",    chave: "(11) 97654-3210",          banco: "Itaú",        agencia: "0412", conta: "12345-6" },
    { nome: "Juliana Costa",  chave: "juliana.costa@email.com",  banco: "Bradesco",    agencia: "2231", conta: "77881-2" },
    { nome: "Marcos Alves",   chave: "(21) 98877-6655",          banco: "Caixa",       agencia: "1520", conta: "00321-9" },
  ],

  contas: [
    { nome: "Conta de luz", vence: 1, valor: 184.37, codigo: "83640000001 84370052010 12345678901 34567890123" },
    { nome: "Internet",     vence: 4, valor: 99.9,   codigo: "23793381286 00000999024 81000063307 10000009990" },
    { nome: "Água",         vence: 9, valor: 76.2,   codigo: "82650000000 76200097202 51120230000 00000762002" },
  ],

  // "tela" é para onde a notificação leva quando alguém clica nela
  notificacoes: [
    { icone: "entrada", texto: "Você recebeu um Pix de <strong>R$ 850,00</strong> de Lucas Ferreira", dia: 0, tela: "extrato" },
    { icone: "pagar",   texto: "Sua <strong>conta de luz</strong> vence amanhã", dia: 0, tela: "pagar" },
    { icone: "cartao",  texto: "A fatura do cartão fechou em <strong>R$ 1.284,60</strong>", dia: -3, tela: "cartoes" },
  ],
};


// ===== 2. Guardar no navegador =====
// Quando a página fecha (ou recarrega), o objeto "dados" vai inteiro para o localStorage.
// Quando ela abre de novo, ele volta de lá e tudo continua de onde parou.
function salvar() {
  dados.salvoEm = hoje;
  localStorage.setItem("prisma-dados", JSON.stringify(dados));
}
window.addEventListener("pagehide", salvar);

// "Restaurar" (Configurações): apaga o que foi salvo e abre de novo com os dados de exemplo
function restaurar() {
  window.removeEventListener("pagehide", salvar); // senão, ao recarregar, salvaria tudo de novo
  localStorage.removeItem("prisma-dados");
  location.reload();
}

const salvo = JSON.parse(localStorage.getItem("prisma-dados"));
const cadastro = new URLSearchParams(location.search); // o cadastro.html manda nome, e-mail e celular no endereço

if (cadastro.has("nome")) {
  // Conta nova: os dados de exemplo, com o nome de quem acabou de se cadastrar
  dados.usuario = { nome: cadastro.get("nome"), email: cadastro.get("email"), celular: cadastro.get("celular") };
  history.replaceState(null, "", location.pathname + location.hash); // tira os dados do endereço
} else if (salvo) {
  // Os dias foram contados a partir do dia em que salvou: se passaram 2 dias, o "hoje" de lá vira -2
  const passaram = -diasAte(salvo.salvoEm);
  salvo.movimentacoes.forEach((mov) => mov.dia -= passaram);
  salvo.contas.forEach((conta) => conta.vence -= passaram);
  salvo.notificacoes.forEach((n) => n.dia -= passaram);
  dados = salvo;
}

// Toda movimentação tem um código de autenticação (as de exemplo ganham um agora)
dados.movimentacoes.forEach(function (mov) {
  if (!mov.codigo) mov.codigo = novoCodigo();
});

// Pagamento agendado cujo dia chegou: agora o dinheiro sai do saldo
dados.movimentacoes.forEach(function (mov) {
  if (mov.agendado && mov.dia <= 0) {
    mov.agendado = false;
    dados.saldo += mov.valor; // o valor de uma saída é negativo
    avisar("check", `O pagamento agendado de <strong>${reais(-mov.valor)}</strong> foi feito`, "comprovante", mov.codigo);
  }
});


// ===== 3. Mostrar os dados na tela =====
// Valor com sinal: entrada em verde com "+", saída com "−".
// "dinheiro" é a classe que o olho do topo esconde (ver ".oculto" no CSS).
function valorComSinal(valor) {
  if (valor > 0) return `<span class="valor dinheiro positivo">+ ${reais(valor)}</span>`;
  return `<span class="valor dinheiro">− ${reais(-valor)}</span>`;
}

// Uma linha da tabela de movimentações (no Início, com a coluna Data).
// Clicar nela, ou apertar Enter, abre o comprovante.
function linhaDoExtrato(mov, comData) {
  const situacao = mov.agendado ? "Agendado" : mov.pendente ? "Pendente" : "";
  return `
    <tr tabindex="0" onclick="verComprovante('${mov.codigo}')">
      <td class="descricao">${mov.nome}${situacao && `<small class="pendente">${situacao}</small>`}</td>
      ${comData ? `<td>${quando(mov.dia)}</td>` : ""}
      <td class="tipo">${mov.tipo}</td>
      <td class="valor">${valorComSinal(mov.valor)}</td>
    </tr>`;
}

// Lista com as movimentações de um tipo só (Últimos Pix, Recargas recentes e Últimas compras)
function listaDoTipo(seletor, tipo) {
  preencher(seletor, dados.movimentacoes.filter((mov) => mov.tipo === tipo).map((mov) => `
    <li tabindex="0" onclick="verComprovante('${mov.codigo}')">
      <div><strong>${mov.nome}</strong><span class="texto-fraco">${quando(mov.dia)}</span></div>
      ${valorComSinal(mov.valor)}
    </li>`).join(""));
}

// Extrato. O período (7 dias, 30 dias ou Tudo) vale para a tela toda;
// Todas/Entradas/Saídas e a busca, só para a lista de movimentações.
const filtros = { dias: 30, tipo: "todas", busca: "" };

function mostrarExtrato() {
  const doPeriodo = dados.movimentacoes.filter((mov) => mov.dia > -filtros.dias);

  // Soma das entradas, das saídas e do gasto de cada tipo (agendado ainda não conta)
  let entradas = 0;
  let saidas = 0;
  const gastos = {}; // ex.: { Cartão: 500.2, Recarga: 50 }
  doPeriodo.forEach(function (mov) {
    if (mov.agendado) return;
    if (mov.valor > 0) {
      entradas += mov.valor;
    } else {
      saidas -= mov.valor;
      gastos[mov.tipo] = (gastos[mov.tipo] || 0) - mov.valor;
    }
  });
  $("resumo-entradas").textContent = "+ " + reais(entradas);
  $("resumo-saidas").textContent = "− " + reais(saidas);
  $("resumo-saldo").textContent = reais(dados.saldo);

  // "Para onde foi seu dinheiro": uma barra por tipo, do maior gasto para o menor
  const tipos = Object.entries(gastos).sort((a, b) => b[1] - a[1]);
  preencher("#gastos", tipos.map(function ([tipo, valor]) {
    const porcento = Math.round((valor / saidas) * 100);
    return `
      <li>
        <span>${tipo}</span>
        <div class="barra"><span style="width: ${porcento}%"></span></div>
        <span class="texto-fraco">${porcento}%</span>
        <span class="valor dinheiro">${reais(valor)}</span>
      </li>`;
  }).join("") || '<li class="texto-fraco">Nenhum gasto no período.</li>');

  // Movimentações separadas por dia: antes da primeira de cada dia entra uma linha com a data
  const lista = doPeriodo.filter(function (mov) {
    if (filtros.tipo === "entradas" && mov.valor < 0) return false;
    if (filtros.tipo === "saidas" && mov.valor > 0) return false;
    return simples(mov.nome + " " + mov.tipo).includes(filtros.busca);
  });
  let diaAnterior;
  preencher("#tabela-extrato", lista.map(function (mov) {
    const data = mov.dia !== diaAnterior ? `<tr class="dia"><th colspan="3">${quando(mov.dia)}</th></tr>` : "";
    diaAnterior = mov.dia;
    return data + linhaDoExtrato(mov, false);
  }).join("") || '<tr><td colspan="3" class="texto-fraco">Nenhuma movimentação encontrada.</td></tr>');
}

// Botões 7 dias/30 dias/Tudo e Todas/Entradas/Saídas. Ex.: filtrar(this, 'dias', 7)
function filtrar(botao, filtro, valor) {
  botao.parentElement.querySelector(".ativo").classList.remove("ativo");
  botao.classList.add("ativo");
  filtros[filtro] = valor;
  mostrarExtrato();
}

// Campo de busca do Extrato
function buscar(texto) {
  filtros.busca = simples(texto);
  mostrarExtrato();
}

// Desenha tudo o que depende dos dados. Roda quando o site abre
// e de novo a cada mudança (Pix, pagamento, caixinha, limite, meus dados...).
function mostrarTudo() {
  // Saldo: no topo ("24.860,35"; o "R$" fica no HTML, menor) e embaixo dos campos de valor
  $("saldo-numero").textContent = dados.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  preencher(".saldo-disponivel", `Saldo disponível: <span class="dinheiro">${reais(dados.saldo)}</span>`);

  // Movimentações: as 7 mais recentes no Início, o Extrato e as listas de Pix, Recargas e Compras
  preencher("#extrato-recente", dados.movimentacoes.slice(0, 7).map((mov) => linhaDoExtrato(mov, true)).join(""));
  mostrarExtrato();
  listaDoTipo("#lista-pix", "Pix");
  listaDoTipo("#lista-recargas", "Recarga");
  listaDoTipo("#lista-compras", "Cartão");

  // Contas a pagar (Início e Pagar): o botão "Pagar" preenche o boleto.
  // Se todas forem pagas, a lista fica vazia ("") e aparece o aviso.
  preencher(".lista-contas", dados.contas.map((c, i) => `
    <li>
      <div><strong>${c.nome}</strong><span class="texto-fraco">${vencimento(c.vence)}</span></div>
      <div class="lista-direita">
        <span class="valor dinheiro">${reais(c.valor)}</span>
        <button type="button" class="botao botao-secundario botao-pequeno" onclick="pagarConta(${i})">Pagar</button>
      </div>
    </li>`).join("") || '<li class="texto-fraco">Nenhuma conta para pagar.</li>');

  // Pix rápido (só quem tem chave Pix): clicar abre o Pix com a chave já preenchida
  preencher(".contatos", dados.contatos.map((c, i) => c.chave ? `
    <button type="button" class="contato" onclick="pixPara(${i})">
      <span class="avatar">${iniciais(c.nome)}</span>${c.nome.split(" ")[0]}
    </button>` : "").join(""));

  // Favorecidos (Transferências): clicar preenche banco, agência, conta e nome
  preencher("#favorecidos", dados.contatos.map((c, i) => `
    <li>
      <button type="button" class="favorecido" onclick="transferirPara(${i})">
        <span class="avatar">${iniciais(c.nome)}</span>
        <div><strong>${c.nome}</strong><span class="texto-fraco">${c.banco} · Ag. ${c.agencia} · Conta ${c.conta}</span></div>
      </button>
    </li>`).join(""));

  // Cartão: a fatura e o limite aparecem no Início e em Cartões
  escrever(".fatura-valor", reais(dados.fatura));
  escrever(".limite-disponivel", reais(dados.limite - dados.fatura));
  $("limite-total-texto").textContent = reais(dados.limite);
  document.querySelectorAll(".barra-limite").forEach(function (barra) {
    barra.style.width = (dados.fatura / dados.limite) * 100 + "%";
  });
  $("btn-fatura").disabled = dados.fatura === 0;
  $("btn-fatura").textContent = dados.fatura ? "Pagar fatura" : "Fatura paga";

  // Caixinha: quanto tem e quanto já tem da meta
  const porcento = Math.min(Math.round((dados.caixinha / dados.meta) * 100), 100);
  $("caixinha-valor").textContent = reais(dados.caixinha);
  $("caixinha-barra").style.width = porcento + "%";
  preencher("#caixinha-meta", `${porcento}% da meta de <span class="dinheiro">${reais(dados.meta)}</span>`);

  // Gráfico: a barra tracejada é o gasto deste mês, do dia 1º até hoje
  // (sem a caixinha, que é dinheiro guardado, e não gasto)
  const gastoDoMes = dados.movimentacoes
    .filter((mov) => mov.valor < 0 && mov.dia <= 0 && mov.dia > -new Date().getDate() && mov.tipo !== "Caixinha")
    .reduce((soma, mov) => soma - mov.valor, 0);
  const barraDoMes = document.querySelector(".grafico-barras .parcial");
  barraDoMes.style.height = Math.min(gastoDoMes / 4000, 1) * 100 + "%"; // 100% = R$ 4 mil, o topo
  barraDoMes.dataset.valor = reais(gastoDoMes) + " até hoje";

  // Quem usa o banco: nome, iniciais, e-mail e celular (com o meio escondido)
  const u = dados.usuario;
  escrever(".usuario-nome", u.nome);
  escrever(".usuario-primeiro-nome", u.nome.split(" ")[0]);
  escrever(".usuario-iniciais", iniciais(u.nome));
  escrever(".usuario-email", u.email);
  escrever(".usuario-celular", u.celular.slice(0, 6) + "••••" + u.celular.slice(-5)); // (11) 9••••-4321

  mostrarNotificacoes();
}


// ===== 4. Trocar de tela =====
// Cada tela é um <main data-tela="nome"> e os links apontam para "#nome".
// Quando o # do endereço muda, só a tela com esse nome fica visível.
function mostrarTela() {
  let nome = location.hash.slice(1);
  if (!document.querySelector(`[data-tela="${nome}"]`)) nome = "inicio"; // # vazio ou errado
  // "confirmar" e "comprovante" só abrem preenchidos (se a página recarregar, vai para o Início)
  if (nome === "confirmar" && !operacao) nome = "inicio";
  if (nome === "comprovante" && !$("comp-codigo").textContent) nome = "inicio";

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

// Abre a tela na hora (sem esperar o "hashchange") para pôr o cursor num campo dela
function abrirTela(nome, campo) {
  location.hash = nome;
  mostrarTela();
  $(campo).focus();
}

function pixPara(i) {
  $("pix-chave").value = dados.contatos[i].chave;
  abrirTela("pix", "pix-valor");
}

function transferirPara(i) {
  const c = dados.contatos[i];
  $("transf-banco").value = c.banco;
  $("transf-agencia").value = c.agencia;
  $("transf-conta").value = c.conta;
  $("transf-favorecido").value = c.nome;
  abrirTela("transferencias", "transf-valor");
}

function pagarConta(i) {
  $("pagar-codigo").value = dados.contas[i].codigo;
  $("pagar-valor").value = dados.contas[i].valor.toFixed(2);
  $("pagar-data").value = hoje;
  abrirTela("pagar", "pagar-valor");
}


// ===== 5. Topo, menu do celular e teclado =====
// "Mais", na barra de baixo do celular, abre e fecha o menu
function alternarMenu() {
  $("sidebar").classList.toggle("aberto");
}

// O olho esconde e mostra todos os valores: o CSS troca o que tem a classe "dinheiro" por bolinhas
function alternarValores() {
  const oculto = document.body.classList.toggle("oculto");
  $("icone-olho").setAttribute("href", oculto ? "#i-olho-off" : "#i-olho");
}

function mostrarNotificacoes() {
  // As de um Pix, pagamento etc. têm o código da movimentação e abrem o comprovante dela
  preencher("#lista-notificacoes", dados.notificacoes.map((n) => `
    <li><a href="#${n.tela}" class="notificacao"${n.codigo ? ` onclick="verComprovante('${n.codigo}')"` : ""}>
      <svg class="ico"><use href="#i-${n.icone}"/></svg>
      <div><p>${n.texto}</p><span class="texto-fraco">${quando(n.dia)}</span></div>
    </a></li>`).join("") || '<li class="texto-fraco">Nenhuma notificação.</li>');

  $("btn-limpar").hidden = dados.notificacoes.length === 0;
  $("badge").textContent = dados.naoLidas;
  $("badge").hidden = dados.naoLidas === 0;
  // Quem usa leitor de tela ouve o número também
  $("sino").setAttribute("aria-label", dados.naoLidas ? `Notificações, não lidas: ${dados.naoLidas}` : "Notificações");
}

// Nova notificação no sino (depois de um Pix, de mudar os dados...)
function avisar(icone, texto, tela, codigo) {
  dados.notificacoes.unshift({ icone: icone, texto: texto, dia: 0, tela: tela, codigo: codigo });
  dados.naoLidas++;
}

// O sino abre e fecha a caixinha. Abrir = ler, então o número some.
function alternarNotificacoes() {
  $("caixa-notificacoes").hidden = !$("caixa-notificacoes").hidden;
  dados.naoLidas = 0;
  mostrarNotificacoes();
}

function limparNotificacoes() {
  dados.notificacoes = [];
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

// Teclado: Esc fecha as notificações e o menu; Enter numa movimentação abre o comprovante
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    $("caixa-notificacoes").hidden = true;
    $("sidebar").classList.remove("aberto");
  }
  if (evento.key === "Enter" && evento.target.matches("[tabindex]")) evento.target.click();
});


// ===== 6. Botões das telas: cartão, caixinha, chave Pix e meus dados =====
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

// Barrinha do "Ajustar limite"
function atualizarLimite() {
  dados.limite = Number($("limite-total").value);
  mostrarTudo();
}

// "Pagar fatura": passa pela tela de confirmar, como o Pix (seção 7)
function pagarFatura(botao) {
  if (dados.fatura > dados.saldo) return erro(botao, "Saldo insuficiente. Você tem " + reais(dados.saldo) + ".");
  operacao = { mov: { nome: "Fatura do cartão", dia: 0, tipo: "Fatura", valor: -dados.fatura, detalhe: "Cartão final 4821" } };
  preencherRecibo("conf", operacao.mov);
  location.hash = "confirmar";
}

// Caixinha (Início): "Guardar" tira do saldo e põe na caixinha; "Resgatar" faz o contrário
function moverCaixinha(evento) {
  evento.preventDefault();
  const campo = evento.target.valor;
  const valor = Number(campo.value);
  const guardar = evento.submitter.value === "guardar"; // qual dos dois botões foi clicado
  if (guardar && valor > dados.saldo) return erro(campo, "Saldo insuficiente. Você tem " + reais(dados.saldo) + ".");
  if (!guardar && valor > dados.caixinha) return erro(campo, "A caixinha só tem " + reais(dados.caixinha) + ".");

  const entra = guardar ? -valor : valor; // quanto entra no saldo (negativo = sai)
  dados.saldo += entra;
  dados.caixinha -= entra;
  registrar({ nome: guardar ? "Guardado na caixinha" : "Resgate da caixinha", dia: 0, tipo: "Caixinha", valor: entra });
  evento.target.reset();
  mostrarTudo();
}

// Copia a chave Pix (o e-mail) para a pessoa colar onde quiser
function copiarChave(botao) {
  navigator.clipboard.writeText(dados.usuario.email).then(function () {
    botao.textContent = "Chave copiada";
  });
}

// Meus dados (Configurações): o nome novo aparece na saudação, nas iniciais, no perfil e no cartão
function salvarDados(evento) {
  evento.preventDefault();
  const campos = new FormData(evento.target);
  dados.usuario = { nome: campos.get("nome").trim(), email: campos.get("email"), celular: campos.get("celular") };
  avisar("check", "Seus dados foram atualizados", "configuracoes");
  mostrarTudo();
}


// ===== 7. Enviar dinheiro: formulário → confirmar → comprovante =====
// Pix, Transferência, Pagar e Recarga chamam enviar() no onsubmit. Nada sai do saldo ainda:
// primeiro abre a tela "confirmar" com o resumo, e só o botão "Confirmar" tira o dinheiro.
let operacao = null; // o que está esperando o "Confirmar"

// Mostra um erro no próprio campo, no balãozinho do navegador (ex.: "Saldo insuficiente").
// A mensagem some quando a pessoa mexe no campo ou sai dele.
function erro(campo, mensagem) {
  campo.setCustomValidity(mensagem);
  campo.reportValidity();
  const limpar = () => campo.setCustomValidity("");
  campo.addEventListener("input", limpar, { once: true });
  campo.addEventListener("blur", limpar, { once: true });
}

function enviar(evento) {
  evento.preventDefault(); // não recarrega a página
  const formulario = evento.target;
  const campos = new FormData(formulario);
  const tipo = campos.get("tipo");
  const destino = campos.get("destino");
  const valor = Number(campos.get("valor"));

  if (valor > dados.saldo) {
    return erro(formulario.querySelector("[name=valor]"), "Saldo insuficiente. Você tem " + reais(dados.saldo) + ".");
  }

  // O que vai para o extrato. "detalhe" aparece no recibo: chave, conta, código ou operadora.
  const mov = { nome: destino, dia: 0, tipo: tipo, valor: -valor };
  operacao = { mov: mov, formulario: formulario };

  if (tipo === "Pix") {
    const contato = dados.contatos.find((c) => c.chave === destino);
    if (contato) mov.nome = contato.nome; // no extrato aparece o nome, não a chave
    mov.detalhe = "Chave " + destino;
  }
  if (tipo === "Transferência") {
    const conta = campos.get("conta");
    mov.detalhe = `${campos.get("banco")} · Ag. ${campos.get("agencia")} · Conta ${conta} · ${campos.get("modalidade")}`;
    // "Salvar nos favorecidos" marcado, e essa conta ainda não está na lista
    if (campos.get("salvar") && !dados.contatos.some((c) => c.conta === conta)) {
      operacao.favorecido = { nome: destino, chave: "", banco: campos.get("banco"), agencia: campos.get("agencia"), conta: conta };
    }
  }
  if (tipo === "Boleto") {
    operacao.conta = dados.contas.find((c) => c.codigo === destino); // conta da lista? sai dela depois de paga
    mov.nome = operacao.conta ? operacao.conta.nome : "Pagamento de boleto";
    mov.detalhe = destino;
    // Data no futuro: fica agendado, e o dinheiro só sai no dia (ver a seção 2)
    mov.dia = diasAte(campos.get("data"));
    if (mov.dia > 0) mov.agendado = true;
  }
  if (tipo === "Recarga") mov.detalhe = "Operadora " + campos.get("operadora");

  preencherRecibo("conf", mov);
  location.hash = "confirmar";
}

// Botão "Confirmar": agora o dinheiro sai de verdade
function concluir() {
  const mov = operacao.mov;
  if (!mov.agendado) dados.saldo += mov.valor; // o valor de uma saída é negativo
  if (mov.tipo === "Fatura") dados.fatura = 0;
  if (operacao.conta) dados.contas.splice(dados.contas.indexOf(operacao.conta), 1); // conta paga sai da lista
  if (operacao.favorecido) dados.contatos.push(operacao.favorecido);
  if (operacao.formulario) operacao.formulario.reset();
  registrar(mov);

  const agendado = mov.agendado ? " agendado para " + quando(mov.dia).toLowerCase() : "";
  avisar("check", `${mov.tipo} de <strong>${reais(-mov.valor)}</strong>${agendado} · veja o comprovante`, "comprovante", mov.codigo);
  operacao = null;
  mostrarTudo();
  verComprovante(mov.codigo);
}

// Põe uma movimentação nova no extrato, com a hora e um código de autenticação
function registrar(mov) {
  mov.hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  mov.codigo = novoCodigo();
  dados.movimentacoes.unshift(mov);
  dados.movimentacoes.sort((a, b) => b.dia - a.dia); // os agendados (no futuro) ficam em cima
}

// As telas "confirmar" e "comprovante" mostram o mesmo recibo.
// Os ids começam com "conf-" numa e "comp-" na outra: o prefixo diz qual preencher.
function preencherRecibo(prefixo, mov) {
  $(prefixo + "-valor").textContent = reais(Math.abs(mov.valor));
  $(prefixo + "-tipo").textContent = mov.tipo;
  $(prefixo + "-rotulo").textContent = mov.valor > 0 ? "De" : "Para";
  $(prefixo + "-nome").textContent = mov.nome;
  $(prefixo + "-detalhe").textContent = mov.detalhe || "";
  $(prefixo + "-detalhe").parentElement.hidden = !mov.detalhe; // sem detalhe, a linha some

  let data = dataDe(mov.dia).toLocaleDateString("pt-BR"); // "19/11/2026"
  if (mov.hora) data += " às " + mov.hora;
  if (mov.agendado) data += " (agendado)";
  if (mov.pendente) data += " (pendente)";
  $(prefixo + "-data").textContent = data;
}

// Abre o comprovante de uma movimentação: no extrato, numa notificação ou depois do "Confirmar"
function verComprovante(codigo) {
  const mov = dados.movimentacoes.find((m) => m.codigo === codigo);
  preencherRecibo("comp", mov);
  $("comp-codigo").textContent = mov.codigo;
  location.hash = "comprovante";
}


// ===== 8. Quando a página abre =====
// Saudação de acordo com a hora, e a data de hoje
const hora = new Date().getHours();
$("saudacao").textContent = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
$("data-hoje").textContent = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

// Nomes dos meses no gráfico: os 6 meses antes deste e, na barra tracejada, este
const mesAtual = new Date().getMonth(); // 0 = janeiro ... 11 = dezembro
const mesAntes = (n) => meses[(mesAtual - n + 12) % 12]; // mesAntes(1) = mês passado
document.querySelectorAll(".grafico-barras span").forEach(function (rotulo, i) {
  rotulo.textContent = mesAntes(6 - i).slice(0, 3); // "mai", "jun"... (o CSS põe a maiúscula)
});
$("mes-passado").textContent = mesAntes(1);
$("mes-retrasado").textContent = mesAntes(2);

// A fatura fechou há 3 dias e vence daqui a 4
preencher(".fatura-fechou", quando(-3));
preencher(".fatura-vence", quando(4));

// Pagar: a data começa em hoje e não aceita dias que já passaram
$("pagar-data").min = hoje;
$("pagar-data").defaultValue = hoje; // o valor que volta quando o formulário é limpo

// O formulário "Meus dados" e a barrinha do limite começam com o que está salvo
$("dados-nome").value = dados.usuario.nome;
$("dados-email").value = dados.usuario.email;
$("dados-celular").value = dados.usuario.celular;
$("limite-total").value = dados.limite;

mostrarTudo();
mostrarTela();
