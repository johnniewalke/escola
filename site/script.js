let totalPeriodos = 0;
let periodosRestantes = 0;
let disciplinas = [];

function cadastrarPeriodos() {
  const inputPeriodos = document.getElementById('periodos');
  totalPeriodos = parseInt(inputPeriodos.value);
  periodosRestantes = totalPeriodos;
  
  inputPeriodos.setAttribute('disabled', 'disabled');
  
  const formPeriodos = document.getElementById('form-periodos');
  formPeriodos.style.display = 'none';
  
  const formDisciplinas = document.getElementById('form-disciplinas');
  formDisciplinas.style.display = 'block';
}

function cadastrarDisciplina() {
  const inputNome = document.getElementById('nome');
  const inputPeriodos = document.getElementById('periodos-disciplina');
  
  const disciplina = {
    nome: inputNome.value,
    periodos: parseInt(inputPeriodos.value),
    restricoes: [],
  };
  
  for (let dia = 0; dia < 5; dia++) {
    for (let periodo = 0; periodo < 3; periodo++) {
      const checkboxId = `restricao-${dia}-${periodo}`;
      const checkbox = document.getElementById(checkboxId);
      
      if (checkbox.checked) {
        disciplina.restricoes.push({ dia, periodo });
      }
    }
  }
  
  disciplinas.push(disciplina);
  periodosRestantes -= disciplina.periodos;
  
  inputNome.value = '';
  inputPeriodos.value = '';
  
  exibirDisciplinas();
  
  if (periodosRestantes === 0) {
    const formDisciplinas = document.getElementById('form-disciplinas');
    formDisciplinas.style.display = 'none';
    
    organizarDisciplinas();
  }
}

function organizarDisciplinas() {
  const tabela = [];
  for (let dia = 0; dia < 5; dia++) {
    tabela[dia] = ['', '', '', '', ''];
  }
  
  for (let i = 0; i < disciplinas.length; i++) {
    const disciplina = disciplinas[i];
    
    for (let dia = 0; dia < 5; dia++) {
      if (disciplina.periodos === 0) {
        break;
      }
      
      for (let periodo = 0; periodo < 5; periodo++) {
        if (disciplina.periodos === 0) {
          break;
        }
        
        if (tabela[dia][periodo] === '' && !temRestricao(disciplina.restricoes, dia, periodo)) {
          tabela[dia][periodo] = disciplina.nome;
          disciplina.periodos--;
        }
      }
    }
  }
  
  exibirTabela(tabela);
}

function temRestricao(restricoes, dia, periodo) {
  for (let i = 0; i < restricoes.length; i++) {
    const restricao = restricoes[i];
    
    if (restricao.dia === dia && restricao.periodo === periodo) {
      return true;
    }
  }
  
  return false;
}

function exibirDisciplinas() {
  const tableBody = document.getElementById('disciplinas-table-body');
  tableBody.innerHTML = '';
  
  for (let i = 0; i < disciplinas.length; i++) {
    const disciplina = disciplinas[i];
    
    const row = document.createElement('tr');
    
    const nomeCell = document.createElement('td');
    nomeCell.textContent = disciplina.nome;
    
    const periodosCell = document.createElement('td');
    periodosCell.textContent = disciplina.periodos;
    
    row.appendChild(nomeCell);
    row.appendChild(periodosCell);
    
    tableBody.appendChild(row);
  }
}


