let totalPeriodos = 0;
const disciplinas = [];

function cadastrarDisciplina() {
  const inputPeriodos = document.getElementById('periodos');
  const periodos = parseInt(inputPeriodos.value);
  if (isNaN(periodos) || periodos <= 0) {
    alert('Por favor, insira um número válido de períodos.');
    return;
  }
  
  if (totalPeriodos + periodos > 25) {
    alert('O número total de períodos excede o limite de 25 períodos.');
    return;
  }
  
  totalPeriodos += periodos;
  inputPeriodos.value = '';
  
  const disciplina = prompt('Insira o nome da disciplina:');
  if (!disciplina) {
    return;
  }
  
  const restricoes = [];
  for (let periodo = 1; periodo <= 5; periodo++) {
    const checkbox = document.getElementById(`restricao-${periodo}`);
    if (checkbox.checked) {
      restricoes.push(periodo);
    }
  }
  
  const disciplinaObj = {
    nome: disciplina,
    periodos: periodos,
    restricoes: restricoes
  };
  
  disciplinas.push(disciplinaObj);
  
  if (totalPeriodos === 25) {
    const form = document.getElementById('form');
    form.style.display = 'none';
    organizarDisciplinas();
    exibirDisciplinas();
  } else {
    alert(`Disciplina "${disciplina}" cadastrada com sucesso.`);
  }
}

function organizarDisciplinas() {
  disciplinas.sort((a, b) => b.periodos - a.periodos); // Ordenar disciplinas em ordem decrescente de períodos
  
  const tabela = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => '')); // Tabela de horários (5 dias x 5 períodos)
  
  for (let i = 0; i < disciplinas.length; i++) {
    const disciplina = disciplinas[i];
    const restricoes = disciplina.restricoes;
    
    let periodoInserido = false;
    
    for (let dia = 0; dia < 5; dia++) {
      for (let periodo = 0; periodo < 5; periodo++) {
        if (tabela[dia][periodo] === '') { // Verificar se o horário está vago
          const proximoPeriodo = periodo + 1;
          const proximoDia = dia + Math.floor((periodo + 1) / 5);
          
          if (!restricoes.includes(proximoPeriodo) && (proximoPeriodo < 4 || proximoPeriodo > 4) && tabela[proximoDia][proximoPeriodo] === '') {
            // Verificar se o próximo período está disponível e não possui restrições
            tabela[dia][periodo] = disciplina.nome;
            tabela[proximoDia][proximoPeriodo] = disciplina.nome;
            periodoInserido = true;
            break;
          }
        }
      }
      if (periodoInserido) {
        break;
      }
    }
  }
  
  console.log(tabela);
}

function exibirDisciplinas() {
  const tableBody = document.getElementById('disciplinas-table-body');
  
  for (let i = 0; i < disciplinas.length; i++) {
    const disciplina = disciplinas[i];
    
    const row = document.createElement('tr');
    const nomeCell = document.createElement('td');
    const periodosCell = document.createElement('td');
    
    nomeCell.textContent = disciplina.nome;
    periodosCell.textContent = disciplina.periodos;
    
    row.appendChild(nomeCell);
    row.appendChild(periodosCell);
    tableBody.appendChild(row);
  }
}
