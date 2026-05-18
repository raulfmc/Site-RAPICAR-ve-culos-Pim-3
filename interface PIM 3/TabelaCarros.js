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
  if (!inputBuscaCarro || !corpoTabelaCarros) return;

  // Dados mock de carros (mesmos campos do pim3.js)
  

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
        <td class="texto">${carro.carro_Cor}</td>
        <td class="texto">${carro.carro_Placa}</td>
        <td>
          <button
            type="button"
            class="toggle-disponibilidade"
            aria-pressed="${carro.disponivel ? 'true' : 'false'}"
            title="Alternar disponibilidade"
          >${carro.disponivel ? 'Disponível' : 'Indisponível'}</button>
        </td>
      `;

      // Botão liga/desliga disponibilidade (verde/vermelho)
      const btnToggle = tr.querySelector('.toggle-disponibilidade');

      function aplicarEstadoDisponibilidade() {
        const disponivel = !!carro.disponivel;
        btnToggle.style.backgroundColor = disponivel ? '#22c55e' : '#ef4444';
        btnToggle.style.color = '#fff';
        btnToggle.style.border = 'none';
        btnToggle.style.padding = '10px 18px';
        btnToggle.style.borderRadius = '12px';
        btnToggle.style.fontFamily = 'Poppins, sans-serif';
        btnToggle.style.fontWeight = '600';
        btnToggle.style.cursor = 'pointer';
        btnToggle.style.boxShadow = disponivel
          ? '0 0 0 3px rgba(34, 197, 94, 0.25)'
          : '0 0 0 3px rgba(239, 68, 68, 0.25)';

        btnToggle.textContent = disponivel ? 'Disponível' : 'Indisponível';
        btnToggle.setAttribute('aria-pressed', disponivel ? 'true' : 'false');
      }

      aplicarEstadoDisponibilidade();

      btnToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        carro.disponivel = !carro.disponivel;
        aplicarEstadoDisponibilidade();
      });

      // Hover
      tr.addEventListener('mouseenter', () => {
        tr.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      });
      tr.addEventListener('mouseleave', () => {
        tr.style.backgroundColor = 'transparent';
      });

      // Clique (mantém comportamento parecido com tabela de clientes)
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
