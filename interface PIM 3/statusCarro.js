document.addEventListener('DOMContentLoaded', async () => {
  await carregarCarros();
  await carregarManutencoes();
  async function carregarCarros() {
        try {
            const resposta = await fetch('http://localhost:5067/api/Carro');
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

            listaCarrosGlobal = await resposta.json();
        } catch (erro) {
            console.error('Erro ao carregar carros:', erro);
        }
    }
  
  async function carregarManutencoes() {

    const resposta = await fetch('http://localhost:5067/api/Manutencao');

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }


    listaManutencoesGlobal = await resposta.json();

  }


  const inputBusca = document.getElementById('input-busca-status');
  const corpoStatuscarros = document.getElementById('corpo-status-carros');
  const corpoManutencoes = document.getElementById('corpo-manutencoes');
  const tituloManutencoes = document.getElementById('titulo-manutencoes');

  function contarManutencoes(carroId) {
    return (listaManutencoesGlobal || []).filter(d => d.carro_ID === carroId);
  }

  function definirStatus(carroId) {
    const hoje = new Date().toISOString().slice(0, 10);

    const manutencoesCarro = listaManutencoesGlobal.filter(m =>
        m.carro_ID === carroId
    );
   if (manutencoesCarro.length > 0) {
      return { label: "Em manutenção", color: "#ef4444" };
    }
    return { label: "Disponível", color: "#22c55e" };

    
  }


  function renderizarCarros() {
    
    const termo = (inputBusca.value || '').toLowerCase();

    const filtrados = listaCarrosGlobal.filter(c => {
      if (!termo) return true;
      return c.carro_Marca.toLowerCase().includes(termo) || String(c.carro_ID).includes(termo);
    });

    corpoStatuscarros.innerHTML = '';

    filtrados.forEach(c => {
      const status = definirStatus(c.carro_ID);
     

      const statusLabel = status.label;
      const statusColor = status.color;
      const emDia = statusLabel === 'Em dia';

      const tr = document.createElement('tr');
      tr.className = 'linha-carro';
      tr.style.cursor = 'pointer';
      tr.style.transition = 'background-color 0.3s ease';
      tr.innerHTML = `
        <td class="texto">${c.carro_ID}</td>
        <td class="texto">${c.carro_Marca} ${c.carro_Modelo} ${c.carro_Placa}</td>
        <td>
          <span style="display:inline-block; padding:10px 18px; border-radius:12px; font-family:Poppins, sans-serif; font-weight:600; background:${statusColor}; color:#fff; box-shadow: 0 0 0 3px ${emDia ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'};">
            ${statusLabel}
          </span>
        </td>
      `;

      tr.addEventListener('click', () => {
        tituloManutencoes.textContent = `Manutenções do carro: ${c.carro_Marca} ${c.carro_Modelo} ${c.carro_Placa}`;
        renderizarManutencoes(c.carro_ID);
      });

      corpoStatuscarros.appendChild(tr);
    });

    if (filtrados.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="3" style="text-align:center; padding:20px; color:#fff;">Nenhum carro encontrado</td>`;
      corpoStatuscarros.appendChild(tr);
    }
  }

  function renderizarManutencoes(carroId) {
   
    const Manutencoes = contarManutencoes(carroId);

    if (!Manutencoes || Manutencoes.length === 0) {
      corpoManutencoes.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:20px; color:#fff;">Nenhuma manutenção para este carro.</td>
        </tr>
      `;
      return;
    }

    corpoManutencoes.innerHTML = '';
    Manutencoes.forEach(m => {
      
      corpoManutencoes.insertAdjacentHTML('beforeend', `
        <tr>
          <td class="texto">${m.descricao_Problema}</td>
          <td class="texto">${new Date(m.data_Prevista_Conclusao).toLocaleDateString('pt-BR') || ''}</td>
        </tr>
      `);
    });
    
  }

  if (inputBusca) {
    inputBusca.addEventListener('input', () => renderizarCarros());
  }

  renderizarCarros();
  renderizarManutencoes();
});

let listaCarrosGlobal = [];
let listaManutencoesGlobal = [];