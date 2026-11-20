// Prisma Bank: o JavaScript das três páginas.
// A parte 0 serve para todas. As partes 1 a 7 são só do banco (index.html).

function $(id) { return document.getElementById(id); }

// ===== 0. Tema, máscara, login e cadastro =====
// Tema salvo no navegador. Na primeira visita, segue o do computador.
let tema = localStorage.getItem("prisma-tema");
if (tema === null && matchMedia("(prefers-color-scheme: light)").matches) tema = "claro";
if (tema === "claro") document.documentElement.classList.add("claro");

function alternarTema() {
  const claro = document.documentElement.classList.toggle("claro"); // toggle devolve true se ligou
  localStorage.setItem("prisma-tema", claro ? "claro" : "escuro");
}

// Máscara: cada # do molde vira um número digitado. Ex.: formatar(campo, "(##) #####-####")
function formatar(campo, molde) {
  const numeros = campo.value.replace(/\D/g, ""); // só os números
  let resultado = "";
  let i = 0;
  for (let j = 0; j < molde.length && i < numeros.length; j++) {
    if (molde[j] === "#") resultado += numeros[i++];
    else resultado += molde[j];
  }
  campo.value = resultado;
}

// Login e cadastro: cada campo tem a mensagem de erro no data-erro e, embaixo dele, um <p id="CAMPO-msg">.
// Confere um campo: se estiver errado, escreve embaixo dele a mensagem do data-erro
function conferir(campo) {
  if (campo.id === "confirmar") campo.setCustomValidity(campo.value === $("senha").value ? "" : "diferente");
  const certo = campo.checkValidity(); // o navegador usa as regras do HTML (required, minlength...)
  campo.setAttribute("aria-invalid", !certo);
  $(campo.id + "-msg").textContent = certo ? "" : campo.dataset.erro;
  return certo;
}

// Campo que já deu erro é conferido de novo a cada letra: o erro some assim que fica certo
function corrigindo(campo) {
  if (campo.hasAttribute("aria-invalid")) conferir(campo);
}

// "Mostrar" troca a senha por texto (no cadastro, as duas senhas); "Ocultar" volta a esconder
function alternarSenha(botao) {
  const mostrar = botao.textContent === "Mostrar";
  document.querySelectorAll("#senha, #confirmar").forEach(function (campo) { campo.type = mostrar ? "text" : "password"; });
  botao.textContent = mostrar ? "Ocultar" : "Mostrar";
}

function mostrarNoCartao(campo) {
  $("cartao-nome").textContent = campo.value.trim().toUpperCase() || "SEU NOME AQUI";
}

// Cadastro em duas etapas (seus dados → senha): mostra uma, esconde a outra
function trocarEtapa(numero) {
  $("etapa-1").hidden = numero !== 1;
  $("etapa-2").hidden = numero !== 2;
  $("etapas").dataset.atual = numero;
  document.querySelector("#etapa-" + numero + " input").focus();
}

// Enviar: confere todos os campos que estão aparecendo. No cadastro, a 1ª etapa leva à 2ª.
function entrar(evento) {
  evento.preventDefault();
  const form = evento.target;
  let tudoCerto = true;
  form.querySelectorAll("[data-erro]").forEach(function (campo) {
    if (campo.closest("[hidden]")) return; // campo da etapa escondida: fica para depois
    if (!conferir(campo)) tudoCerto = false;
  });
  if (!tudoCerto) return form.querySelector("[aria-invalid='true']").focus(); // vai para o 1º campo errado
  if ($("etapa-2") && $("etapa-2").hidden) return trocarEtapa(2);
  form.submit(); // tudo certo: abre o banco
}

// ===== 1. Ajudantes =====
// 1234.5 → "R$ 1.234,50"
function reais(valor) { return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

// Coloca o HTML em todos os elementos do seletor
function preencher(seletor, html) {
  document.querySelectorAll(seletor).forEach(function (el) { el.innerHTML = html; });
}

// Os dias contam a partir de 25/11, o dia da apresentação: 0 = hoje, -1 = ontem, 4 = daqui a 4 dias
function quando(dias) {
  if (dias === 0) return "Hoje";
  if (dias === -1) return "Ontem";
  if (dias === 1) return "Amanhã";
  const dia = 25 + dias;                    // ex.: -2 → dia 23
  if (dia < 1) return (dia + 31) + " out";  // antes de 1º de novembro: volta para outubro (31 dias)
  return dia + " nov";
}

// "Renata Lima" → "RL" (primeira letra do primeiro e do último nome)
function iniciais(nome) {
  const partes = nome.trim().split(" ");
  const primeiro = partes[0];
  const ultimo = partes[partes.length - 1];
  if (partes.length === 1) return primeiro[0].toUpperCase();
  return (primeiro[0] + ultimo[0]).toUpperCase();
}

// Código do comprovante: 8 números sorteados
function novoCodigo() { return String(Math.floor(Math.random() * 90000000) + 10000000); }

// ===== 2. Dados: tudo o que o banco mostra sai daqui =====
// Valor positivo = entrada, negativo = saída. "dia" conta a partir de hoje.
let dados = {
  saldo: 24860.35, fatura: 1284.6, limite: 8000, naoLidas: 3,
  usuario: { nome: "Ana Souza", email: "ana.souza@email.com", celular: "(11) 98765-4321" },
  movimentacoes: [
    { nome: "Lucas Ferreira",      dia: 0,   tipo: "Pix",           valor: 850 },
    { nome: "Supermercado Aurora", dia: 0,   tipo: "Cartão",        valor: -212.9 },
    { nome: "Conta de gás",        dia: -1,  tipo: "Boleto",        valor: -96.4 },
    { nome: "Renata Lima",         dia: -2,  tipo: "Transferência", valor: -1200 },
    { nome: "(11) 98765-4321",     dia: -4,  tipo: "Recarga",       valor: -30 },
    { nome: "Salário",             dia: -6,  tipo: "Transferência", valor: 5200 },
    { nome: "Farmácia Bem Estar",  dia: -8,  tipo: "Cartão",        valor: -67.4 },
    { nome: "Juliana Costa",       dia: -9,  tipo: "Pix",           valor: 300 },
    { nome: "Posto Central",       dia: -12, tipo: "Cartão",        valor: -180 },
    { nome: "(11) 98765-4321",     dia: -34, tipo: "Recarga",       valor: -20 },
  ],
  // Pix rápido e favorecidos (quem é salvo numa transferência entra aqui sem chave)
  contatos: [
    { nome: "Lucas Ferreira", chave: "lucas.ferreira@email.com", banco: "Prisma Bank", agencia: "0001", conta: "48213-0" },
    { nome: "Renata Lima",    chave: "(11) 97654-3210",          banco: "Itaú",        agencia: "0412", conta: "12345-6" },
    { nome: "Juliana Costa",  chave: "juliana.costa@email.com",  banco: "Bradesco",    agencia: "2231", conta: "77881-2" },
    { nome: "Marcos Alves",   chave: "(21) 98877-6655",          banco: "Caixa",       agencia: "1520", conta: "00321-9" },
  ],
  contas: [
    { nome: "Conta de luz", vence: 1, valor: 184.37, codigo: "83640000001 84370052010 12345678901 34567890123" },
    { nome: "Internet",     vence: 4, valor: 99.9,   codigo: "23793381286 00000999024 81000063307 10000009990" },
    { nome: "Água",         vence: 5, valor: 76.2,   codigo: "82650000000 76200097202 51120230000 00000762002" },
  ],
  // "tela" é para onde a notificação leva
  notificacoes: [
    { icone: "entrada", texto: "Você recebeu um Pix de <strong>R$ 850,00</strong> de Lucas Ferreira", dia: 0, tela: "extrato" },
    { icone: "pagar",   texto: "Sua <strong>conta de luz</strong> vence amanhã", dia: 0, tela: "pagar" },
    { icone: "cartao",  texto: "A fatura do cartão fechou em <strong>R$ 1.284,60</strong>", dia: -3, tela: "cartoes" },
  ],
};

// "Restaurar" (Configurações): apaga o que foi salvo e volta aos dados de exemplo
function restaurar() {
  localStorage.removeItem("prisma-dados");
  location.reload();
}

// ===== 3. Desenhar a tela a partir dos dados =====
// Uma linha de movimentação: entrada em verde com "+". Clicar abre o comprovante.
// A classe "dinheiro" é o que o olho esconde.
function linha(mov, comData) {
  let valor = `<span class="dinheiro">− ${reais(-mov.valor)}</span>`;
  if (mov.valor > 0) valor = `<span class="dinheiro positivo">+ ${reais(mov.valor)}</span>`;
  let data = "";
  if (comData) data = `<td>${quando(mov.dia)}</td>`; // a coluna Data só aparece no Início
  return `<tr tabindex="0" onclick="verComprovante('${mov.codigo}')"><td class="descricao">${mov.nome}</td>
    ${data}<td class="tipo">${mov.tipo}</td><td class="valor">${valor}</td></tr>`;
}

let periodo = 30;            // 7, 30 ou 9999 dias ("Tudo")
let tipoEscolhido = "todas"; // "todas", "entradas" ou "saidas"
let busca = "";

function mostrarExtrato() {
  let entradas = 0, saidas = 0, tabela = "", diaAnterior = null;
  dados.movimentacoes.forEach(function (mov) {
    if (mov.dia <= -periodo) return; // fora do período
    if (mov.valor > 0) entradas += mov.valor;
    else saidas -= mov.valor;

    // A lista respeita Todas/Entradas/Saídas e a busca. Cada dia novo ganha uma linha com a data.
    if (tipoEscolhido === "entradas" && mov.valor < 0) return;
    if (tipoEscolhido === "saidas" && mov.valor > 0) return;
    if (!(mov.nome + " " + mov.tipo).toLowerCase().includes(busca)) return;
    if (mov.dia !== diaAnterior) tabela += `<tr class="dia"><th colspan="3">${quando(mov.dia)}</th></tr>`;
    diaAnterior = mov.dia;
    tabela += linha(mov, false);
  });

  $("resumo-entradas").textContent = "+ " + reais(entradas);
  $("resumo-saidas").textContent = "− " + reais(saidas);
  $("resumo-saldo").textContent = reais(dados.saldo);
  $("tabela-extrato").innerHTML = tabela || '<tr><td colspan="3" class="texto-fraco">Nenhuma movimentação encontrada.</td></tr>';
}

// Botões do Extrato: o clicado fica marcado ("ativo")
function marcar(botao) {
  botao.parentElement.querySelector(".ativo").classList.remove("ativo");
  botao.classList.add("ativo");
}
function filtrarPeriodo(botao, dias) { marcar(botao); periodo = dias; mostrarExtrato(); }
function filtrarTipo(botao, tipo) { marcar(botao); tipoEscolhido = tipo; mostrarExtrato(); }
function buscar(texto) { busca = texto.toLowerCase(); mostrarExtrato(); }

// Redesenha tudo e salva. Roda ao abrir e depois de cada mudança (Pix, fatura, sino...)
function mostrarTudo() {
  $("saldo-numero").textContent = dados.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  preencher(".saldo-disponivel", `Saldo disponível: <span class="dinheiro">${reais(dados.saldo)}</span>`);

  // As 7 movimentações mais recentes (Início) e o Extrato
  let recentes = "";
  dados.movimentacoes.slice(0, 7).forEach(function (mov) { recentes += linha(mov, true); });
  $("extrato-recente").innerHTML = recentes;
  mostrarExtrato();

  // Contas a pagar (Início e Pagar)
  let contas = "";
  dados.contas.forEach(function (conta, i) {
    contas += `<li><div><strong>${conta.nome}</strong><span class="texto-fraco">Vence: ${quando(conta.vence)}</span></div>
      <div class="lista-direita"><span class="valor dinheiro">${reais(conta.valor)}</span>
      <button type="button" class="botao botao-secundario botao-pequeno" onclick="pagarConta(${i})">Pagar</button></div></li>`;
  });
  preencher(".lista-contas", contas || '<li class="texto-fraco">Nenhuma conta para pagar.</li>');

  // Pix rápido (quem tem chave) e Favorecidos (todos)
  let pixRapido = "", favorecidos = "";
  dados.contatos.forEach(function (c, i) {
    if (c.chave) pixRapido += `<button type="button" class="contato" onclick="pixPara(${i})">
      <span class="avatar">${iniciais(c.nome)}</span>${c.nome.split(" ")[0]}</button>`;
    favorecidos += `<li><button type="button" class="favorecido" onclick="transferirPara(${i})"><span class="avatar">${iniciais(c.nome)}</span>
      <div><strong>${c.nome}</strong><span class="texto-fraco">${c.banco} · Ag. ${c.agencia} · Conta ${c.conta}</span></div></button></li>`;
  });
  preencher(".contatos", pixRapido);
  $("favorecidos").innerHTML = favorecidos;

  // Cartão
  preencher(".fatura-valor", reais(dados.fatura));
  preencher(".limite-disponivel", reais(dados.limite - dados.fatura));
  document.querySelectorAll(".barra-limite").forEach(function (b) { b.style.width = (dados.fatura / dados.limite) * 100 + "%"; });
  $("btn-fatura").disabled = dados.fatura === 0;
  $("btn-fatura").textContent = dados.fatura === 0 ? "Fatura paga" : "Pagar fatura";

  // Quem usa o banco
  const u = dados.usuario;
  preencher(".usuario-nome", u.nome);
  preencher(".usuario-primeiro-nome", u.nome.split(" ")[0]);
  preencher(".usuario-iniciais", iniciais(u.nome));
  preencher(".usuario-email", u.email);
  preencher(".usuario-celular", u.celular.slice(0, 6) + "••••" + u.celular.slice(-5)); // (11) 9••••-4321

  // Notificações e o número no sino
  let avisos = "";
  dados.notificacoes.forEach(function (n) {
    avisos += `<li><a href="#${n.tela}" class="notificacao"><svg class="ico"><use href="#i-${n.icone}"/></svg>
      <div><p>${n.texto}</p><span class="texto-fraco">${quando(n.dia)}</span></div></a></li>`;
  });
  $("lista-notificacoes").innerHTML = avisos;
  $("badge").textContent = dados.naoLidas;
  $("badge").hidden = dados.naoLidas === 0;

  // Guarda "dados" no navegador, como texto (JSON). Na próxima vez que o banco abrir, volta daqui.
  localStorage.setItem("prisma-dados", JSON.stringify(dados));
}

// ===== 4. Telas =====
// Cada tela é um <main data-tela="nome">. Só a do # do endereço fica visível.
function mostrarTela() {
  let nome = location.hash.replace("#", "");
  if (!document.querySelector(`[data-tela="${nome}"]`)) nome = "inicio";
  if (nome === "confirmar" && operacao === null) nome = "inicio"; // nada para confirmar
  if (nome === "comprovante" && $("comp-codigo").textContent === "") nome = "inicio";

  document.querySelectorAll("[data-tela]").forEach(function (tela) {
    tela.hidden = tela.getAttribute("data-tela") !== nome;
    if (!tela.hidden) document.title = "Prisma Bank | " + tela.getAttribute("data-titulo");
  });
  document.querySelectorAll(".menu-link").forEach(function (link) {
    link.classList.toggle("ativo", link.getAttribute("href") === "#" + nome); // marca no menu
  });
  fecharMenus();
  window.scrollTo(0, 0);
}

// Atalhos que abrem uma tela já preenchida
function abrirTela(nome, campo) { location.hash = nome; mostrarTela(); $(campo).focus(); }

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
  abrirTela("pagar", "pagar-valor");
}

// ===== 5. Topo e menu =====
function alternarMenu() { $("sidebar").classList.toggle("aberto"); }

// O olho: o CSS troca tudo o que tem a classe "dinheiro" por bolinhas
function alternarValores() {
  const oculto = document.body.classList.toggle("oculto");
  $("icone-olho").setAttribute("href", oculto ? "#i-olho-off" : "#i-olho");
}

// Abrir o sino = ler, então o número some
function alternarNotificacoes() {
  $("caixa-notificacoes").hidden = !$("caixa-notificacoes").hidden;
  dados.naoLidas = 0;
  mostrarTudo();
}

function avisar(texto, tela) {
  dados.notificacoes.unshift({ icone: "check", texto: texto, dia: 0, tela: tela });
  dados.naoLidas++;
}

// Fecha as notificações e o menu do celular (ao trocar de tela ou apertar Esc)
function fecharMenus() {
  $("caixa-notificacoes").hidden = true;
  $("sidebar").classList.remove("aberto");
}

// ===== 6. Enviar dinheiro: formulário → confirmar → comprovante =====
let operacao = null; // o que está esperando o botão "Confirmar"

// Erro no balãozinho do próprio campo; some quando a pessoa digita de novo
function erro(campo, mensagem) {
  campo.setCustomValidity(mensagem);
  campo.reportValidity();
  campo.oninput = function () { campo.setCustomValidity(""); };
}

// Pix, Transferência, Pagar e Recarga: monta a operação e abre "Confira os dados"
function enviar(evento) {
  evento.preventDefault();
  const f = evento.target; // o formulário; cada campo pelo name: f.valor, f.destino...
  const valor = Number(f.valor.value);
  if (valor > dados.saldo) return erro(f.querySelector("[name=valor]"), "Saldo insuficiente. Você tem " + reais(dados.saldo) + ".");

  const mov = { nome: f.destino.value, dia: 0, tipo: f.tipo.value, valor: -valor, detalhe: "" };
  operacao = { mov: mov, formulario: f };

  if (mov.tipo === "Pix") {
    mov.detalhe = "Chave " + f.destino.value;
    dados.contatos.forEach(function (c) { if (c.chave === f.destino.value) mov.nome = c.nome; });
  }
  if (mov.tipo === "Transferência") {
    mov.detalhe = `${f.banco.value} · Ag. ${f.agencia.value} · Conta ${f.conta.value}`;
    if (f.salvar.checked) operacao.favorecido = { nome: mov.nome, chave: "", banco: f.banco.value, agencia: f.agencia.value, conta: f.conta.value };
  }
  if (mov.tipo === "Boleto") {
    mov.detalhe = f.destino.value;
    mov.nome = "Pagamento de boleto";
    dados.contas.forEach(function (c) { if (c.codigo === f.destino.value) { mov.nome = c.nome; operacao.conta = c; } });
  }
  if (mov.tipo === "Recarga") mov.detalhe = "Operadora " + f.operadora.value;

  preencherRecibo("conf", mov);
  location.hash = "confirmar";
}

// "Pagar fatura" também passa pela tela de confirmar
function pagarFatura(botao) {
  if (dados.fatura > dados.saldo) return erro(botao, "Saldo insuficiente.");
  operacao = { mov: { nome: "Fatura do cartão", dia: 0, tipo: "Fatura", valor: -dados.fatura, detalhe: "Cartão final 4821" } };
  preencherRecibo("conf", operacao.mov);
  location.hash = "confirmar";
}

// Botão "Confirmar": agora o dinheiro sai
function concluir() {
  const mov = operacao.mov;
  dados.saldo += mov.valor; // saída é negativa
  if (mov.tipo === "Fatura") dados.fatura = 0;
  if (operacao.conta) dados.contas.splice(dados.contas.indexOf(operacao.conta), 1); // conta paga sai da lista
  if (operacao.favorecido) dados.contatos.push(operacao.favorecido);
  if (operacao.formulario) operacao.formulario.reset();
  registrar(mov);
  avisar(`${mov.tipo} de <strong>${reais(-mov.valor)}</strong> concluído`, "extrato");
  operacao = null;
  mostrarTudo();
  verComprovante(mov.codigo);
}

// Põe a movimentação no topo do extrato, com hora e código
function registrar(mov) {
  mov.hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  mov.codigo = novoCodigo();
  dados.movimentacoes.unshift(mov);
}

// "Confirmar" (ids conf-) e "Comprovante" (ids comp-) mostram o mesmo recibo
function preencherRecibo(prefixo, mov) {
  $(prefixo + "-valor").textContent = reais(Math.abs(mov.valor));
  $(prefixo + "-tipo").textContent = mov.tipo;
  $(prefixo + "-rotulo").textContent = mov.valor > 0 ? "De" : "Para";
  $(prefixo + "-nome").textContent = mov.nome;
  $(prefixo + "-detalhe").textContent = mov.detalhe;
  $(prefixo + "-detalhe").parentElement.hidden = !mov.detalhe; // sem detalhe, a linha some
  $(prefixo + "-data").textContent = quando(mov.dia) + (mov.hora ? " às " + mov.hora : "");
}

function verComprovante(codigo) {
  const mov = dados.movimentacoes.find(function (m) { return m.codigo === codigo; });
  preencherRecibo("comp", mov);
  $("comp-codigo").textContent = mov.codigo;
  location.hash = "comprovante";
}

// ===== 7. Quando o banco abre =====
// O index.html chama esta função no fim do <body>, quando todo o HTML já existe (assim nada pula de lugar).
function iniciarBanco() {
  // Volta o que foi salvo. Se veio do cadastro (index.html?nome=...), usa o nome digitado.
  const salvo = localStorage.getItem("prisma-dados");
  if (salvo) dados = JSON.parse(salvo);
  const cadastro = new URLSearchParams(location.search);
  if (cadastro.get("nome")) {
    dados.usuario = { nome: cadastro.get("nome"), email: cadastro.get("email"), celular: cadastro.get("celular") };
    history.replaceState(null, "", location.pathname); // tira o ?nome=... do endereço
  }
  dados.movimentacoes.forEach(function (mov) { if (!mov.codigo) mov.codigo = novoCodigo(); });

  window.addEventListener("hashchange", mostrarTela); // o # mudou: troca de tela
  // Teclado: Esc fecha os menus; Enter numa movimentação abre o comprovante
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") fecharMenus();
    if (evento.key === "Enter" && evento.target.hasAttribute("tabindex")) evento.target.click();
  });

  // Saudação: muda com a hora
  const hora = new Date().getHours();
  if (hora < 12) $("saudacao").textContent = "Bom dia";
  else if (hora < 18) $("saudacao").textContent = "Boa tarde";
  else $("saudacao").textContent = "Boa noite";

  mostrarTudo();
  mostrarTela();
}
