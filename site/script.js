let diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
let disciplinas = {};

let formDisciplina = document.getElementById("form-disciplina");
formDisciplina.addEventListener("submit", function(event) {
  event.preventDefault();
  let nome = document.getElementById("nome").value;
  let aulas = parseInt(document.getElementById("aulas").value);
  adicionarDisciplina(nome, aulas);
  formDisciplina.reset();
});

function adicionarDisciplina(nome, aulas) {
  let diasDisponiveis = [...diasSemana];
  let aulasRestantes = aulas;

  while (aulasRestantes > 0 && diasDisponiveis.length > 0) {
    let diaAleatorio = getRandomDia(diasDisponiveis);
    let periodosDisponiveis = getPeriodosDisponiveis(diaAleatorio);

    if (periodosDisponiveis.length > 0) {
      let periodoAleatorio = getRandomPeriodo(periodosDisponiveis);
      disciplinas[diaAleatorio][periodoAleatorio] = nome;
      aulasRestantes--;
    } else {
      diasDisponiveis = diasDisponiveis.filter(dia => dia !== diaAleatorio);
    }
  }

  atualizarTabela();
}

function getRandomDia(dias) {
  let randomIndex = Math.floor(Math.random() * dias.length);
  return dias[randomIndex];
}

function getPeriodosDisponiveis(dia) {
  let periodos = [];
  for (let i = 0; i < 5; i++) {
    if (!disciplinas[dia][i]) {
      periodos.push(i);
    }
  }
  return periodos;
}

function getRandomPeriodo(periodos) {
  let randomIndex = Math.floor(Math.random() * periodos.length);
  return periodos[randomIndex];
}

function atualizarTabela() {
  let corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let linha = document.createElement("tr");
    let colunaDia = document.createElement("td");
    colunaDia.textContent = diasSemana[i];
    linha.appendChild(colunaDia);

    for (let j = 0; j < 5; j++) {
      let colunaPeriodo = document.createElement("td");
      colunaPeriodo.textContent = disciplinas[diasSemana[i]][j] || "";
      linha.appendChild(colunaPeriodo);
    }

    corpoTabela.appendChild(linha);
  }
}

// Inicialização da matriz de disciplinas
for (let i = 0; i < diasSemana.length; i++) {
  disciplinas[diasSemana[i]] = {};
}

atualizarTabela();
