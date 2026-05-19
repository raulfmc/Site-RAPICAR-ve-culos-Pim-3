document.addEventListener('DOMContentLoaded', async () => {
  // Elementos do DOM
  const inputBuscaCarro = document.getElementById('input-busca-carro');
  const corpoTabelaCarros = document.getElementById('corpo-tabela-carros');
  await carregarCarros();
  async function carregarCarros() {

    const resposta = await fetch('http://localhost:5067/api/Carro');

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    // Converte o JSON recebido em array JavaScript
    listaCarrosGlobal = await resposta.json();

    console.log('Carros recebidos da API:', listaCarrosGlobal);

    // Exibe os carros na tabela
    renderizarTabelaCarros(listaCarrosGlobal);


  }
  async function atualizarCarro(id) {
    const dados = {
      Carro_Marca: prompt("Nova marca:"),
      Carro_Modelo: prompt("Novo modelo:")
    };

    const resposta = await fetch(`http://localhost:5067/api/Carro/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    if (resposta.ok) {
      alert("Carro atualizado com sucesso!");
      await carregarCarros();
    } else {
      alert("Erro ao atualizar.");
    }
  }

  async function deletarCarro(id) {
    const resposta = await fetch(`http://localhost:5067/api/Carro/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      
    });

    if (resposta.ok) {
      await carregarCarros();
      alert("Carro deletado com sucesso!");
      
    } else {
      alert("Erro ao deletar.");
    }

  }
  function aplicarEstiloBotao(botao, cor) {
    botao.style.backgroundColor = cor;
    botao.style.color = '#fff';
    botao.style.border = 'none';
    botao.style.padding = '10px 18px';
    botao.style.borderRadius = '12px';
    botao.style.fontFamily = 'Poppins, sans-serif';
    botao.style.fontWeight = '600';
    botao.style.cursor = 'pointer';
  }
  if (!inputBuscaCarro || !corpoTabelaCarros) return;




  // Inicializa a tabela
  renderizarTabelaCarros(listaCarrosGlobal);

  function renderizarTabelaCarros(dados) {
    corpoTabelaCarros.innerHTML = '';

    if (!dados || dados.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="6" style="text-align: center; padding: 20px; color: #fff;">Nenhum carro encontrado</td>`;
      corpoTabelaCarros.appendChild(tr);
      return;
    }

    dados.forEach((carro) => {

      const tr = document.createElement('tr');
      tr.className = 'linha-carro';
      tr.style.cursor = 'pointer';
      tr.style.transition = 'background-color 0.3s ease';

      tr.innerHTML = `
        <td class="texto">${carro.carro_ID}</td> 
        <td class="texto">${carro.carro_Marca}</td>
        <td class="texto">${carro.carro_Modelo}</td>
        <td class="texto">${carro.carro_Ano_Fabricação}</td>
        <td class="texto">${carro.carro_Número}</td>
        <td class="texto">${carro.carro_Versão}</td>
        <td class="texto">${carro.carro_Câmbio}</td>
        <td class="texto">${carro.carro_Placa}</td>
        <td class="texto">${carro.carro_Cor}</td>
        <td class="texto">${carro.carro_Qtd_Aluguéis}</td>
        <td class="texto">R$ ${carro.carro_Valor_Diária}</td>
        <td>
          <button
            type="button"
            class="toggle-disponibilidade"
            aria-pressed="${carro.carro_Status ? 'true' : 'false'}"
            title="Alternar disponibilidade"
          >${carro.carro_Status ? 'Disponível' : 'Indisponível'}</button>
        </td>
        <td>
          <button class="botao-editar">Editar</button>
        </td>
        <td>
          <button class="botao-deletar">X</button>
        </td>
      `;
      const btnEditar = tr.querySelector('.botao-editar');
      aplicarEstiloBotao(
        btnEditar,
        '#3b82f6'
      );

      btnEditar.addEventListener('click', (e) => {
        e.stopPropagation();
        atualizarCarro(carro.carro_ID);
      });
      const btnDeletar = tr.querySelector('.botao-deletar');
      aplicarEstiloBotao(btnDeletar, '#ef4444');
      btnDeletar.addEventListener('click', (e) => {
        e.stopPropagation();
        const confirmado = confirm(
          `Deseja realmente excluir o carro?\n\n` +
          `ID: ${carro.carro_ID}\n` +
          `Marca: ${carro.carro_Marca}\n` +
          `Modelo: ${carro.carro_Modelo}\n` +
          `Placa: ${carro.carro_Placa}`
        );

        if (!confirmado) {
          return;
        }

        deletarCarro(carro.carro_ID);
        
      });
      // Botão liga/desliga disponibilidade (verde/vermelho)
      const btnToggle = tr.querySelector('.toggle-disponibilidade');

      function aplicarEstadoDisponibilidade() {
        const disponivel = carro.carro_Status;

        btnToggle.textContent = disponivel ? 'Disponível' : 'Indisponível';

        aplicarEstiloBotao(
          btnToggle,
          disponivel ? '#22c55e' : '#ef4444'
        );
        btnToggle.textContent = disponivel ? 'Disponível' : 'Indisponível';
        btnToggle.setAttribute('aria-pressed', disponivel ? 'true' : 'false');
      }

      aplicarEstadoDisponibilidade();

      btnToggle.addEventListener('click', async (e) => {
        e.stopPropagation();

        const novoStatus = !carro.carro_Status;

        const resposta = await fetch(
          `http://localhost:5067/api/Carro/${carro.carro_ID}/status`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoStatus)
          }
        );

        if (resposta.ok) {
          carro.carro_Status = novoStatus;
          aplicarEstadoDisponibilidade();
        } else {
          alert('Erro ao atualizar status do carro.');
        }


        aplicarEstadoDisponibilidade();
      });


      tr.addEventListener('mouseenter', () => {
        tr.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      });
      tr.addEventListener('mouseleave', () => {
        tr.style.backgroundColor = 'transparent';
      });


      tr.addEventListener('click', () => {
        alert(
          `Carro selecionado:\n\nID: ${carro.carro_ID}\nMarca: ${carro.carro_Marca}\nModelo: ${carro.carro_Modelo}\nCor: ${carro.carro_Cor}\nPlaca: ${carro.carro_Placa}`
        );
      });

      corpoTabelaCarros.appendChild(tr);
    });
  }

  // Filtro por marca/modelo/cor/placa/id
  inputBuscaCarro.addEventListener('input', () => {
    const termoBusca = inputBuscaCarro.value.trim().toLowerCase();

    const filtrados = listaCarrosGlobal.filter((carro) => {
      return (
        carro.carro_ID.toString().includes(termoBusca) ||
        carro.carro_Marca.toLowerCase().includes(termoBusca) ||
        carro.carro_Modelo.toLowerCase().includes(termoBusca) ||
        (carro.carro_Cor || '').toLowerCase().includes(termoBusca) ||
        carro.carro_Placa.toLowerCase().includes(termoBusca)
      );
    });

    renderizarTabelaCarros(filtrados);
  });
});
let listaCarrosGlobal = [];
