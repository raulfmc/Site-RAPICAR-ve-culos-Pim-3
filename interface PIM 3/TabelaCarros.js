document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const inputBuscaCarro = document.getElementById('input-busca-carro');
  const corpoTabelaCarros = document.getElementById('corpo-tabela-carros');

  if (!inputBuscaCarro || !corpoTabelaCarros) return;

  // Dados mock de carros (mesmos campos do pim3.js)
  let listaCarrosGlobal = [
    { id: 1, marca: 'Volkswagen', modelo: 'Gol', cor: 'Preto', placa: 'ABC-1234', disponivel: true },
    { id: 2, marca: 'Chevrolet', modelo: 'Onix', cor: 'Branco', placa: 'DEF-5678', disponivel: false },
    { id: 3, marca: 'Ford', modelo: 'Fiesta', cor: 'Prata', placa: 'GHI-9012', disponivel: true },
    { id: 4, marca: 'Toyota', modelo: 'Corolla', cor: 'Preto', placa: 'JKL-3456', disponivel: false },
    { id: 5, marca: 'Honda', modelo: 'Civic', cor: 'Vermelho', placa: 'MNO-7891', disponivel: true },
  ];

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
        <td class="texto">${carro.id}</td>
        <td class="texto">${carro.marca}</td>
        <td class="texto">${carro.modelo}</td>
        <td class="texto">${carro.cor}</td>
        <td class="texto">${carro.placa}</td>
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
          `Carro selecionado:\n\nID: ${carro.id}\nMarca: ${carro.marca}\nModelo: ${carro.modelo}\nCor: ${carro.cor}\nPlaca: ${carro.placa}`
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
        carro.id.toString().includes(termoBusca) ||
        carro.marca.toLowerCase().includes(termoBusca) ||
        carro.modelo.toLowerCase().includes(termoBusca) ||
        (carro.cor || '').toLowerCase().includes(termoBusca) ||
        carro.placa.toLowerCase().includes(termoBusca)
      );
    });

    renderizarTabelaCarros(filtrados);
  });
});

