let diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
let disciplinas = {};

let formDisciplina = document.getElementById("form-disciplina");
formDisciplina.addEventListener("submit", function(event) {
  event.preventDefault();
  let nome = document.getElementById("nome").value;
  let aulas = parseInt(document.getElementById("aulas").value);
  let diasIndisponiveis = obterDiasIndisponiveis();
  adicionarDisciplina(nome, aulas, diasIndisponiveis);
  formDisciplina.reset();
});

let botaoReorganizar = document.getElementById("reorganizar");
botaoReorganizar.addEventListener("click", function(event) {
  event.preventDefault();
  reorganizarDisciplinas();
});

function obterDiasIndisponiveis() {
  let diasIndisponiveis = [];
  let checkboxes = document.getElementsByName("dias");
  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      diasIndisponiveis.push(checkbox.value);
    }
  });
  return diasIndisponiveis;
}

function adicionarDisciplina(nome, aulas, diasIndisponiveis) {
  let diasDisponiveis = [...diasSemana];
  let aulasRestantes = aulas;
  let corDisciplina = getRandomColor(); // Gera uma cor aleatória para a disciplina

  while (aulasRestantes > 0 && diasDisponiveis.length > 0) {
    let diaAleatorio = getRandomDia(diasDisponiveis);
    let periodosDisponiveis = getPeriodosDisponiveis(diaAleatorio, diasIndisponiveis);

    if (periodosDisponiveis.length > 0) {
      let periodoAleatorio = getRandomPeriodo(periodosDisponiveis);
      disciplinas[diaAleatorio][periodoAleatorio] = {
        nome: nome,
        cor: corDisciplina,
        diasIndisponiveis: diasIndisponiveis
      };
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

function getPeriodosDisponiveis(dia, diasIndisponiveis) {
  let periodos = [];
  for (let i = 0; i < 5; i++) {
    if (!disciplinas[dia][i] && !verificarDiaIndisponivel(dia, i, diasIndisponiveis)) {
      periodos.push(i);
    }
  }
  return periodos;
}

function verificarDiaIndisponivel(dia, periodo, diasIndisponiveis) {
  for (let i = 0; i < diasIndisponiveis.length; i++) {
    if (diasIndisponiveis[i] === dia) {
      return true;
    }
  }
  return false;
}

function getRandomPeriodo(periodos) {
  let randomIndex = Math.floor(Math.random() * periodos.length);
  return periodos[randomIndex];
}

function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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
      let disciplina = disciplinas[diasSemana[i]][j];
      if (disciplina) {
        colunaPeriodo.textContent = disciplina.nome;
        colunaPeriodo.style.backgroundColor = disciplina.cor;
      }
      linha.appendChild(colunaPeriodo);
    }

    corpoTabela.appendChild(linha);
  }
}

function reorganizarDisciplinas() {
  let disciplinasArray = [];

  // Converter as disciplinas em um array para facilitar o reajuste
  for (let dia in disciplinas) {
    for (let periodo in disciplinas[dia]) {
      disciplinasArray.push({
        dia: dia,
        periodo: periodo,
        disciplina: disciplinas[dia][periodo]
      });
    }
  }

  disciplinasArray.sort((a, b) => b.disciplina.diasIndisponiveis.length - a.disciplina.diasIndisponiveis.length);

  let index = 0;
  for (let dia of diasSemana) {
    disciplinas[dia] = {};
    let aulasRestantes = disciplinasArray.filter(item => item.dia === dia).length;

    for (let i = 0; i < 5; i++) {
      if (aulasRestantes === 0) {
        break;
      }

      if (!disciplinas[dia][i]) {
        disciplinas[dia][i] = disciplinasArray[index].disciplina;
        index++;
        aulasRestantes--;
      }
    }
  }

  atualizarTabela();
}

// Inicialização da matriz de disciplinas
for (let i = 0; i < diasSemana.length; i++) {
  disciplinas[diasSemana[i]] = {};
}

atualizarTabela();
