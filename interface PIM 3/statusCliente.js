document.addEventListener('DOMContentLoaded', () => {
  // Lista de clientes (mock compatível com pim3.js)
  const listaClientesGlobal = [
    { id: 1, nome: 'João Silva' },
    { id: 2, nome: 'Maria Santos' },
    { id: 3, nome: 'Pedro Oliveira' },
    { id: 4, nome: 'Ana Costa' },
    { id: 5, nome: 'Carlos Souza' }
  ];

  const STORAGE_KEY = 'rapicar_pendencias_v1';

  const inputBusca = document.getElementById('input-busca-status');
  const corpoStatusClientes = document.getElementById('corpo-status-clientes');
  const corpoDividas = document.getElementById('corpo-dividas');
  const tituloDividas = document.getElementById('titulo-dividas');

  function carregarEstado() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { clientes: {}, alugueis: [], dividas: [] };
      return JSON.parse(raw);
    } catch (e) {
      return { clientes: {}, alugueis: [], dividas: [] };
    }
  }

  function contarDividas(clienteId, estado) {
    return (estado.dividas || []).filter(d => d.clienteId === clienteId);
  }

  function calcularStatusFinanceiro(clienteId, estado) {
    const dividas = contarDividas(clienteId, estado);
    // em dia se não tiver dívida
    return dividas.length > 0;
  }

  function renderizarClientes() {
    const estado = carregarEstado();
    const termo = (inputBusca.value || '').toLowerCase();

    const filtrados = listaClientesGlobal.filter(c => {
      if (!termo) return true;
      return c.nome.toLowerCase().includes(termo) || String(c.id).includes(termo);
    });

    corpoStatusClientes.innerHTML = '';

    filtrados.forEach(c => {
      const statusDevendo = calcularStatusFinanceiro(c.id, estado);
      const emDia = !statusDevendo;

      const statusLabel = emDia ? 'Em dia' : 'Devendo';
      const statusColor = emDia ? '#22c55e' : '#ef4444';

      const tr = document.createElement('tr');
      tr.className = 'linha-cliente';
      tr.style.cursor = 'pointer';
      tr.style.transition = 'background-color 0.3s ease';
      tr.innerHTML = `
        <td class="texto">${c.id}</td>
        <td class="texto">${c.nome}</td>
        <td>
          <span style="display:inline-block; padding:10px 18px; border-radius:12px; font-family:Poppins, sans-serif; font-weight:600; background:${statusColor}; color:#fff; box-shadow: 0 0 0 3px ${emDia ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'};">
            ${statusLabel}
          </span>
        </td>
      `;

      tr.addEventListener('click', () => {
        tituloDividas.textContent = `Dívidas do cliente: ${c.nome}`;
        renderizarDividas(c.id);
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
    const estado = carregarEstado();
    const dividas = contarDividas(clienteId, estado);

    if (!dividas || dividas.length === 0) {
      corpoDividas.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:20px; color:#fff;">Nenhuma dívida para este cliente.</td>
        </tr>
      `;
      return;
    }

    corpoDividas.innerHTML = '';

    dividas.forEach(d => {
      const atrasoTexto = (d.atrasoDias || 0) > 0
        ? `${d.atrasoDias} dia(s) de atraso`
        : 'Dentro do prazo';

      corpoDividas.insertAdjacentHTML('beforeend', `
        <tr>
          <td class="texto">R$ ${Number(d.valor || 0).toFixed(2)}</td>
          <td class="texto">${d.dataCriacao || ''}</td>
          <td class="texto">${d.primeiroDia || ''}</td>
          <td class="texto">${d.ultimoDia || ''}</td>
          <td class="texto">${atrasoTexto}</td>
          <td class="texto">${d.status || 'Devendo'}</td>
        </tr>
      `);
    });
  }

  if (inputBusca) {
    inputBusca.addEventListener('input', () => renderizarClientes());
  }

  renderizarClientes();
});

