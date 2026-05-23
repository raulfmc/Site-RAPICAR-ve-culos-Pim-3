document.addEventListener('DOMContentLoaded', async () => {
  await carregarClientes();
  await carregarDividas();

  async function carregarClientes() {

    const resposta = await fetch('http://localhost:5067/api/Cliente');

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    
    listaClientesGlobal = await resposta.json();
  }
  async function carregarDividas() {

    const resposta = await fetch('http://localhost:5067/api/Divida');

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }


    listaDividasGlobal = await resposta.json();
  }
  async function atualizarDivida(divida) {
        const dados = {
            Divida_ID: divida.divida_ID,
            Tipo_Erro: prompt("Novo tipo do erro:", divida.tipo_Erro),
            Valor_Divida: prompt("Novo valor:", divida.valor_Divida),
            Descricao_Erro: prompt("Nova descrição do erro:", divida.descricao_Erro),
            Cliente_ID: prompt("Novo ID do cliente:", divida.cliente_ID),
            Divida_Ativo: true
        };
        if (
            dados.Tipo_Erro === null ||
            dados.Valor_Divida === null ||
            dados.Descricao_Erro === null ||
            dados.Cliente_ID === null 
            
        ) {
            return;
        }
        console.log(JSON.stringify(dados, null, 2));
        const resposta = await fetch(`http://localhost:5067/api/Divida/${divida.divida_ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            await carregarDividas();
            alert("Dívida atualizada com sucesso!");
            await renderizarClientes();
            await renderizarDividas();
            
        } else {
            const erro = await resposta.text();
            console.error("Erro da API:", erro);
            alert("Erro ao atualizar. Veja o console (F12).");
        }
        
    }

    async function deletarDivida(id) {
        const resposta = await fetch(`http://localhost:5067/api/Divida/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            
        });

        if (resposta.ok) {
            await carregarDividas();
            alert("Dívida deletada com sucesso!");
            await renderizarDividas();
            
        } else {
            alert("Erro ao deletar.");
        }

    }


  const inputBusca = document.getElementById('input-busca-status');
  const corpoStatusClientes = document.getElementById('corpo-status-clientes');
  const corpoDividas = document.getElementById('corpo-dividas');
  const tituloDividas = document.getElementById('titulo-dividas');

  function contarDividas(clienteId) {
    return (listaDividasGlobal || []).filter(d => d.cliente_ID === clienteId);
  }

  function calcularStatusFinanceiro(clienteId) {

    const dividasCliente = listaDividasGlobal.filter(
      d => Number(d.cliente_ID) === clienteId
    );

    if (dividasCliente.length > 0) {
      return { label: "Devendo", color: "#ef4444" };
    }
    return { label: "Em dia", color: "#22c55e" };
  }


  function renderizarClientes() {

    const termo = (inputBusca.value || '').toLowerCase();

    const filtrados = listaClientesGlobal.filter(c => {
      if (!termo) return true;
      return c.cliente_Nome.toLowerCase().includes(termo) || String(c.cliente_ID).includes(termo);
    });

    corpoStatusClientes.innerHTML = '';

    filtrados.forEach(c => {
      const status = calcularStatusFinanceiro(c.cliente_ID);


      const statusLabel = status.label;
      const statusColor = status.color;
      const emDia = statusLabel === 'Em dia';

      const tr = document.createElement('tr');
      tr.className = 'linha-cliente';
      tr.style.cursor = 'pointer';
      tr.style.transition = 'background-color 0.3s ease';
      tr.innerHTML = `
        <td class="texto">${c.cliente_ID}</td>
        <td class="texto">${c.cliente_Nome}</td>
        <td>
          <span style="display:inline-block; padding:10px 18px; border-radius:12px; font-family:Poppins, sans-serif; font-weight:600; background:${statusColor}; color:#fff; box-shadow: 0 0 0 3px ${emDia ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'};">
            ${statusLabel}
          </span>
        </td>
      `;

      tr.addEventListener('click', () => {
        tituloDividas.textContent = `Dívidas do cliente: ${c.cliente_Nome}`;
        renderizarDividas(c.cliente_ID);
      });

      corpoStatusClientes.appendChild(tr);
    });

    if (filtrados.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="3" style="text-align:center; padding:20px; color:#fff;">Nenhum cliente encontrado</td>`;
      corpoStatusClientes.appendChild(tr);
    }
  }

  function renderizarDividas(clienteId) {
    corpoDividas.innerHTML = '';
    const dividas = contarDividas(clienteId);

    if (!dividas || dividas.length === 0) {
      corpoDividas.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:20px; color:#fff;">Nenhuma dívida para este cliente.</td>
        </tr>
      `;
      return;
    }
    

    dividas.forEach(d => {
      const tr = document.createElement('tr');
      tr.className = 'linha-carro';
      tr.style.cursor = 'pointer';
      tr.style.transition = 'background-color 0.3s ease';
      tr.innerHTML = '';
      

      tr.insertAdjacentHTML('beforeend', `
        <tr>
          <td class="texto">R$ ${Number(d.valor_Divida || 0).toFixed(2)}</td>
          <td class="texto">${new Date(d.data_Criacao).toLocaleDateString('pt-BR') || ''}</td>
          <td class="texto">${d.tipo_Erro}</td>
          <td class="texto">${d.descricao_Erro}</td>
          <td class="texto">${d.status || 'Devendo'}</td>
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
        atualizarDivida(d);
      });
      const btnDeletar = tr.querySelector('.botao-deletar');
      aplicarEstiloBotao(btnDeletar, '#ef4444');
      btnDeletar.addEventListener('click', (e) => {
        e.stopPropagation();
        const confirmado = confirm(
          `Deseja realmente excluir a dívida?\n\n` +
          `ID: ${d.divida_ID}\n` +
          `Valor: ${d.valor_Divida}\n` +
          `Data criação: ${d.data_Criacao}\n` +
          `Tipo erro: ${d.tipo_Erro}` +
          `Descrição erro: ${d.descricao_Erro}`
        );

        if (!confirmado) {
          return;
        }

        deletarDivida(d.divida_ID);

      });
      corpoDividas.appendChild(tr);
    });
    
  }

  if (inputBusca) {
    inputBusca.addEventListener('input', () => renderizarClientes());
  }

  renderizarClientes();

});

let listaClientesGlobal = [];
let listaDividasGlobal = [];
