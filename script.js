const scriptURL = "https://script.google.com/macros/s/AKfycbw_SlmPO8PX_2xu7SNdTFhXY5HVSAgO1k36Hu2ba9t-mRea0VMiMZFWwDUR3vZO4MtL/exec";

// Extrai o nome da rifa da URL (?rifa=paulo-a)
const params = new URLSearchParams(window.location.search);
const rifa = params.get("rifa");

function verificarSenha() {
  const senha = document.getElementById("senha").value.trim();
  if (!senha || !rifa) {
    alert("Senha ou link inválido.");
    return;
  }

  fetch(`${scriptURL}?acao=validarSenha&rifa=${rifa}&senha=${senha}`, { method: "POST" })
    .then(res => res.json())
    .then(data => {
      if (data.valido) {
        document.getElementById("formulario").classList.remove("oculto");
        carregarNumeros();
        document.getElementById("mensagem").innerText = "✔️ Senha validada!";
      } else {
        document.getElementById("mensagem").innerText = "❌ Senha inválida.";
      }
    })
    .catch(() => {
      document.getElementById("mensagem").innerText = "❌ Erro ao validar senha.";
    });
}

function carregarNumeros() {
  fetch(`${scriptURL}?acao=getNumerosDisponiveis&rifa=${rifa}`, { method: "POST" })
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("numero");
      select.innerHTML = "";
      data.numeros.forEach(numero => {
        const option = document.createElement("option");
        option.value = numero;
        option.text = `Número ${numero}`;
        select.appendChild(option);
      });
    });
}

function enviar() {
  const numero = document.getElementById("numero").value;
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!numero || !nome || !telefone || !senha) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  fetch(`${scriptURL}?acao=reservar&rifa=${rifa}&numero=${numero}&nome=${nome}&telefone=${telefone}&email=${email}&senha=${senha}`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("mensagem").innerText = data.mensagem;
      document.getElementById("formulario").classList.add("oculto");
    })
    .catch(() => {
      document.getElementById("mensagem").innerText = "❌ Erro ao reservar o número.";
    });
}
