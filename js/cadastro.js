// Cadastro de mentira: não salva nada de verdade, só guarda o nome
// durante a sessão e leva o usuário para o painel (index.html).

const formCadastro = document.getElementById("form-cadastro");
const campoSenha = document.getElementById("senha");
const campoConfirmar = document.getElementById("confirmar");

// Avisa na hora se as senhas forem diferentes
function conferirSenhas() {
  if (campoConfirmar.value !== campoSenha.value) {
    campoConfirmar.setCustomValidity("As senhas não são iguais.");
  } else {
    campoConfirmar.setCustomValidity("");
  }
}

campoSenha.addEventListener("input", conferirSenhas);
campoConfirmar.addEventListener("input", conferirSenhas);

formCadastro.addEventListener("submit", function (evento) {
  evento.preventDefault(); // não envia o formulário para lugar nenhum

  const nome = document.getElementById("nome").value.trim();

  try {
    sessionStorage.setItem("prisma-usuario", nome);
  } catch (erro) {
    // Se o navegador bloquear, o cadastro segue mesmo assim
  }

  window.location.href = "index.html";
});
