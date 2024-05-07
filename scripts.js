const button = document.querySelector('.button-add-task');
const input = document.querySelector('.input-task');
const listaCompleta = document.querySelector('.list-tasks');
const filterButtonsContainer = document.querySelector('.filter-buttons');
const filterButtonToggle = document.querySelector('.button-toggle-filter');
const filterButtons = document.querySelectorAll('.button-filter');
let minhaListaDeItens = [];

// Função para salvar a lista no localStorage
function salvarListaNoLocalStorage() {
  localStorage.setItem('lista', JSON.stringify(minhaListaDeItens));
}

// Função para adicionar uma nova tarefa
function adicionarNovaTarefa() {
  minhaListaDeItens.push({
    tarefa: input.value,
    concluida: false,
    editando: false
  });

  input.value = '';

  mostrarTarefas(minhaListaDeItens);
  
  // Salvar a lista no localStorage após adicionar uma nova tarefa
  salvarListaNoLocalStorage();
}

// Função para mostrar as tarefas na tela
function mostrarTarefas(lista) {
  let novaLi = '';

  lista.forEach((item, posicao) => {
    const concluidaClass = item.concluida ? 'done' : '';
    const editandoClass = item.editando ? 'editando' : '';

    if (item.editando) {
      // Se o item está em modo de edição, mostra o campo de edição
      novaLi += `
        <li class="task ${concluidaClass} ${editandoClass}">
          <div class="botoes">
            <img src="./img/checked.png" alt="check-na-tarefa" onclick="concluirTarefa(${posicao})">
            <img src="./img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem(${posicao})">
            <img src="./img/editar.png" alt="editar-tarefa" onclick="editarTarefa(${posicao})">
          </div>
          <input type="text" class="editar-tarefa" value="${item.tarefa}" onkeydown="salvarEdicaoTecla(event, ${posicao})">
        </li>
      `;
    } else {
      // Caso contrário, mostra apenas o texto da tarefa
      novaLi += `
        <li class="task ${concluidaClass} ${editandoClass}">
          <p>${item.tarefa}</p>
          <div class="botoes">
            <img src="./img/checked.png" alt="check-na-tarefa" onclick="concluirTarefa(${posicao})">
            <img src="./img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem(${posicao})">
            <img src="./img/editar.png" alt="editar-tarefa" onclick="editarTarefa(${posicao})">
          </div>
        </li>
      `;
    }
  });

  listaCompleta.innerHTML = novaLi;
}

// Função para concluir uma tarefa
function concluirTarefa(posicao) {
  minhaListaDeItens[posicao].concluida = !minhaListaDeItens[posicao].concluida;
  mostrarTarefas(minhaListaDeItens);
  
  // Salvar a lista no localStorage após concluir uma tarefa
  salvarListaNoLocalStorage();
}

// Função para deletar uma tarefa
function deletarItem(posicao) {
  minhaListaDeItens.splice(posicao, 1);
  mostrarTarefas(minhaListaDeItens);
  
  // Salvar a lista no localStorage após deletar uma tarefa
  salvarListaNoLocalStorage();
}

// Função para recarregar as tarefas do localStorage
function recarregarTarefas() {
  const tarefasDoLocalStorage = localStorage.getItem('lista');
  if (tarefasDoLocalStorage) {
    minhaListaDeItens = JSON.parse(tarefasDoLocalStorage);
  }
  mostrarTarefas(minhaListaDeItens);
}

// Função para editar uma tarefa
function editarTarefa(posicao) {
  // Primeiro, desativa o modo de edição para todos os itens
  minhaListaDeItens.forEach(item => {
    item.editando = false;
  });

  // Em seguida, ativa o modo de edição apenas para o item clicado
  minhaListaDeItens[posicao].editando = true;

  mostrarTarefas(minhaListaDeItens);
}

// Função para salvar a edição de uma tarefa
function salvarEdicao(posicao) {
  const novoTexto = document.querySelector(`.list-tasks li:nth-child(${posicao + 1}) input.editar-tarefa`).value;
  minhaListaDeItens[posicao].tarefa = novoTexto;
  minhaListaDeItens[posicao].editando = false;
  mostrarTarefas(minhaListaDeItens);
}

// Função para salvar a edição de uma tarefa ao pressionar Enter
function salvarEdicaoTecla(event, posicao) {
  if (event.key === 'Enter') {
    const novoTexto = event.target.value;
    minhaListaDeItens[posicao].tarefa = novoTexto;
    minhaListaDeItens[posicao].editando = false;
    mostrarTarefas(minhaListaDeItens);
    
    // Salvar a lista no localStorage após salvar a edição
    salvarListaNoLocalStorage();
  }
}

// Função para filtrar as tarefas
function filtrarTarefas(filtro) {
  let listaFiltrada = [];

  switch (filtro) {
    case 'todas':
      listaFiltrada = minhaListaDeItens;
      break;
    case 'a-fazer':
      listaFiltrada = minhaListaDeItens.filter(item => !item.concluida);
      break;
    case 'concluidas':
      listaFiltrada = minhaListaDeItens.filter(item => item.concluida);
      break;
  }

  mostrarTarefas(listaFiltrada);
}

// Recarregar as tarefas do localStorage ao iniciar a página
recarregarTarefas();

// Adicionar evento de clique no botão de adicionar tarefa
button.addEventListener('click', adicionarNovaTarefa);

// Adicionar evento de pressionar Enter no input para adicionar tarefa
input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    adicionarNovaTarefa();
  }
});

// Adicionar evento de clique no botão de toggle dos filtros
filterButtonToggle.addEventListener('click', () => {
  const currentDisplay = filterButtonsContainer.style.display;
  filterButtonsContainer.style.display = currentDisplay === 'none' ? 'block' : 'none';
});

// Adicionar evento de clique nos botões de filtro
filterButtons.forEach(button => {
  button.addEventListener('click', function() {
    const filtro = this.dataset.filtro;
    filtrarTarefas(filtro);
  });
});
