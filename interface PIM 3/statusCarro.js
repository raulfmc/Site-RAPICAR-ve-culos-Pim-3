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
  async function atualizarManutencao(Manutencao) {
    const dados = {
      Manutencao_ID: Manutencao.manutencao_ID,
      Descricao_Problema: prompt("Nova descrição do problema:", Manutencao.descricao_Problema),
      Data_Prevista_Conclusao: prompt("Nova data prevista de conclusão:", Manutencao.data_Prevista_Conclusao),
      Carro_ID: prompt("Novo ID do carro:", Manutencao.carro_ID),
      Manutencao_Ativo: true
    };
    if (
      dados.Descricao_Problema === null ||
      dados.Data_Prevista_Conclusao === null ||
      dados.Carro_ID === null


    ) {
      return;
    }
    console.log(Manutencao);
    const resposta = await fetch(`http://localhost:5067/api/Manutencao/${Manutencao.manutencao_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    if (resposta.ok) {
      await carregarManutencoes();
      alert("Manutenção atualizada com sucesso!");
      await renderizarManutencoes();
    } else {
      const erro = await resposta.text();
      console.error("Erro da API:", erro);
      alert("Erro ao atualizar. Veja o console (F12).");
    }

  }

  async function deletarManutencao(id) {
    const resposta = await fetch(`http://localhost:5067/api/Manutencao/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },

    });

    if (resposta.ok) {
      await carregarManutencoes();
      alert("Manutenção deletada com sucesso!");
      await renderizarManutencoes();

    } else {
      alert("Erro ao deletar.");
    }

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
      const tr = document.createElement('tr');
      tr.className = 'linha-carro';
      tr.style.cursor = 'pointer';
      tr.style.transition = 'background-color 0.3s ease';
      tr.innerHTML = '';

      tr.insertAdjacentHTML('beforeend', `
        <tr>
          <td class="texto">${m.manutencao_ID}</td>
          <td class="texto">${m.descricao_Problema}</td>
          <td class="texto">${new Date(m.data_Prevista_Conclusao).toLocaleDateString('pt-BR') || ''}</td>
          <td>
            <button class="botao-editar">Editar</button>
          </td>
          <td>
            <button class="botao-deletar">X</button>
          </td>
        </tr>
        
      `);
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
      const btnEditar = tr.querySelector('.botao-editar');
      aplicarEstiloBotao(
        btnEditar,
        '#3b82f6'
      );

      btnEditar.addEventListener('click', (e) => {
        e.stopPropagation();
        atualizarManutencao(m);
      });
      const btnDeletar = tr.querySelector('.botao-deletar');
      aplicarEstiloBotao(btnDeletar, '#ef4444');
      btnDeletar.addEventListener('click', (e) => {
        e.stopPropagation();
        const confirmado = confirm(
          `Deseja realmente excluir a Manutenção?\n\n` +
          `ID: ${m.manutencao_ID}\n` +
          `Descrição problema: ${m.descricao_Problema}\n` +
          `Data prevista de conclusão: ${m.data_Prevista_Conclusao}\n` +
          `ID do carro: ${m.carro_ID}\n`
          
          
        );

        if (!confirmado) {
          return;
        }

        deletarManutencao(m.manutencao_ID);

      });
      corpoManutencoes.appendChild(tr);
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