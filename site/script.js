document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-disciplina');
  const tabela = document.getElementById('tabela-disciplinas');

  // Criação das matrizes para controle de status das células
  const statusMatriz = [];
  const bloqueioMatriz = [];

  for (let i = 0; i < 5; i++) {
    statusMatriz[i] = [];
    bloqueioMatriz[i] = [];
    for (let j = 0; j < 5; j++) {
      statusMatriz[i][j] = '';
      bloqueioMatriz[i][j] = false;
    }
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const aulas = parseInt(document.getElementById('aulas').value);

    // Verifica se há células suficientes disponíveis para alocar as aulas
    let celulasDisponiveis = 0;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (statusMatriz[i][j] === '') {
          celulasDisponiveis++;
        }
      }
    }

    if (celulasDisponiveis < aulas) {
      alert('Não há células suficientes disponíveis para alocar todas as aulas.');
      return;
    }

    // Distribui as aulas nas células disponíveis
    let aulasDistribuidas = 0;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (statusMatriz[i][j] === '') {
          if (!bloqueioMatriz[i][j]) {
            statusMatriz[i][j] = nome;
            aulasDistribuidas++;
            if (aulasDistribuidas === aulas) {
              break;
            }
          }
        }
      }
      if (aulasDistribuidas === aulas) {
        break;
      }
    }

    // Atualiza a tabela com as aulas distribuídas
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        tabela.rows[i + 1].cells[j + 1].textContent = statusMatriz[i][j];
      }
    }

    // Limpa os campos do formulário
    form.reset();
  });

  // Atualiza o bloqueio das células quando há alterações nas indisponibilidades
  const checkboxes = document.querySelectorAll('input[name="indisponibilidades"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      const value = checkbox.value;
      const [dia, periodo] = value.split('-');
      const indiceDia = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'].indexOf(dia);
      const indicePeriodo = parseInt(periodo);

      bloqueioMatriz[indiceDia][indicePeriodo] = checkbox.checked;

      // Limpa o conteúdo das células bloqueadas
      if (checkbox.checked) {
        if (statusMatriz[indiceDia][indicePeriodo] !== '') {
          statusMatriz[indiceDia][indicePeriodo] = '';
          tabela.rows[indiceDia + 1].cells[indicePeriodo + 1].textContent = '';
        }
      }
    });
  });
});
