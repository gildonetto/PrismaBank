// Prisma Bank: o que as três páginas usam (index.html, login.html e cadastro.html).
// Este arquivo fica no <head>, então o tema entra antes de a página aparecer (sem piscar).

// ===== Tema claro ou escuro =====
// A classe "claro" na tag <html> troca as cores (ver o começo do style-1.css).
// A escolha fica salva no navegador. Na primeira visita, segue o tema do computador ou do celular.
const temaSalvo = localStorage.getItem("prisma-tema");
if (temaSalvo === "claro" || (!temaSalvo && matchMedia("(prefers-color-scheme: light)").matches)) {
  document.documentElement.classList.add("claro");
}

function alternarTema() {
  const claro = document.documentElement.classList.toggle("claro");
  localStorage.setItem("prisma-tema", claro ? "claro" : "escuro");
}


// ===== Máscara dos campos =====
// Vai encaixando os números digitados no molde, onde cada # é um número:
// formatar(campo, "(##) #####-####") deixa "11987654321" como "(11) 98765-4321".
// No HTML: oninput="formatar(this, '####')"
function formatar(campo, molde) {
  const numeros = campo.value.replace(/\D/g, ""); // tira tudo o que não é número
  let resultado = "";
  let i = 0; // quantos números já entraram
  for (const letra of molde) {
    if (i === numeros.length) break; // acabaram os números
    if (letra === "#") {
      resultado += numeros[i];
      i++;
    } else {
      resultado += letra; // parêntese, espaço ou traço do molde
    }
  }
  campo.value = resultado;
}


// ===== Cadastro: as duas senhas precisam ser iguais =====
// Enquanto forem diferentes, "Confirmar senha" fica inválido e o navegador não deixa enviar.
function conferirSenhas() {
  const confirmar = document.getElementById("confirmar");
  const iguais = confirmar.value === document.getElementById("senha").value;
  confirmar.setCustomValidity(iguais ? "" : "As senhas não são iguais.");
}
