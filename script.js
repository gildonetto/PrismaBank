// ===== 1. Abrir e fechar o menu no celular =====
const btnMenu = document.getElementById("btn-menu");
const sidebar = document.getElementById("sidebar");

btnMenu.addEventListener("click", function () {
  sidebar.classList.toggle("aberto");
});


// ===== 2. Mostrar e esconder o saldo =====
const saldoValor = document.getElementById("saldo-valor");
const saldoOriginal = saldoValor.innerHTML;
let saldoVisivel = true;

saldoValor.style.cursor = "pointer";

saldoValor.addEventListener("click", function () {
  if (saldoVisivel) {
    saldoValor.innerHTML = "<small>R$</small> •••••";
    saldoVisivel = false;
  } else {
    saldoValor.innerHTML = saldoOriginal;
    saldoVisivel = true;
  }
});


// ===== 3. Notificações =====
const btnNotificacao = document.getElementById("btn-notificacao");

btnNotificacao.addEventListener("click", function () {
  const badge = btnNotificacao.querySelector(".badge");

  if (badge) {
    alert("Você tem " + badge.textContent + " notificações novas!");
    badge.remove();
  } else {
    alert("Nenhuma notificação nova.");
  }
});


// ===== 4. Botão do Pix =====
const btnPix = document.getElementById("btn-pix");

btnPix.addEventListener("click", function (evento) {
  evento.preventDefault();

  const valor = prompt("Quanto você quer enviar por Pix?");

  if (valor) {
    alert("Pix de R$ " + valor + " enviado com sucesso! (é de mentira)");
  }
});


// ===== 5. Marcar o item do menu que foi clicado =====
const linksMenu = document.querySelectorAll(".menu .menu-link");

linksMenu.forEach(function (link) {
  link.addEventListener("click", function (evento) {
    evento.preventDefault();

    linksMenu.forEach(function (outroLink) {
      outroLink.classList.remove("ativo");
    });

    link.classList.add("ativo");
    sidebar.classList.remove("aberto");
  });
});


// ===== 6. Modo claro e modo escuro =====
// Precisa do botão com id="btn-tema" no HTML
const btnTema = document.getElementById("btn-tema");

if (btnTema) {
  btnTema.addEventListener("click", function () {
    document.body.classList.toggle("claro");
  });
}