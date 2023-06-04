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
      // Verifica se já existem disciplinas consecutivas no mesmo dia
      let periodosConsecutivos = encontrarPeriodosConsecutivos(disciplinas[diaAleatorio]);
      let periodoAleatorio = getRandomPeriodo(periodosDisponiveis);

      if (periodosConsecutivos.length > 0) {
        // Verifica se a disciplina atual pode ser colocada na sequência
        let podeColocarNaSequencia = verificarSePodeColocarNaSequencia(periodosConsecutivos, periodoAleatorio);

        if (!podeColocarNaSequencia) {
          // Se não pode colocar na sequência, remove os períodos consecutivos
          periodosConsecutivos.forEach(periodo => {
            delete disciplinas[diaAleatorio][periodo];
          });
        }
      }

      disciplinas[diaAleatorio][periodoAleatorio] = {
        nome: nome,
        cor: corDisciplina
      };
      aulasRestantes--;
    } else {
      diasDisponiveis = diasDisponiveis.filter(dia => dia !== diaAleatorio);
    }
  }

  atualizarTabela();
}

function encontrarPeriodosConsecutivos(diaDisciplina) {
  let periodosConsecutivos = [];
  let periodoAnterior = null;

  for (let i = 0; i < 5; i++) {
    if (diaDisciplina[i]) {
      if (periodoAnterior !== null && i === periodoAnterior + 1) {
        periodosConsecutivos.push(i);
      }
      periodoAnterior = i;
    }
  }

  return periodosConsecutivos;
}

function verificarSePodeColocarNaSequencia(periodosConsecutivos, periodoAtual) {
  return periodosConsecutivos.includes(periodoAtual - 1) || periodosConsecutivos.includes(periodoAtual + 1);
}

function getRandomDia(dias) {
  let randomIndex = Math.floor(Math.random() * dias.length);
  return dias[randomIndex];
}

function getPeriodosDisponiveis(dia, diasIndisponiveis) {
  let periodos = [];
  for (let i = 0; i < 5; i++) {
    if (!disciplinas[dia][i] && !diasIndisponiveis.includes(dia)) {
      periodos.push(i);
    }
  }
  return periodos;
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

// Inicialização da matriz de disciplinas
for (let i = 0; i < diasSemana.length; i++) {
  disciplinas[diasSemana[i]] = {};
}

atualizarTabela();
