document.addEventListener('DOMContentLoaded', () => {
    const inputBuscaCliente = document.getElementById('input-busca-cliente');
    const corpoTabelaClientes = document.getElementById('corpo-tabela-clientes');

    // Mock (pode depois virar do backend)
    let listaClientesGlobal = [
        { id: 1, nome: 'João Silva', cpf: '123.456.789-00', telefone: '(11) 99999-1111', email: 'joao@email.com' },
        { id: 2, nome: 'Maria Santos', cpf: '987.654.321-00', telefone: '(11) 99999-2222', email: 'maria@email.com' },
        { id: 3, nome: 'Pedro Oliveira', cpf: '456.789.123-00', telefone: '(11) 99999-3333', email: 'pedro@email.com' },
        { id: 4, nome: 'Ana Costa', cpf: '321.654.987-00', telefone: '(11) 99999-4444', email: 'ana@email.com' },
        { id: 5, nome: 'Carlos Souza', cpf: '789.123.456-00', telefone: '(11) 99999-5555', email: 'carlos@email.com' },
        { id: 6, nome: 'Juliana Pereira', cpf: '111.222.333-44', telefone: '(11) 99999-6666', email: 'juliana@email.com' },
        { id: 7, nome: 'Roberto Alves', cpf: '555.666.777-88', telefone: '(11) 99999-7777', email: 'roberto@email.com' },
        { id: 8, nome: 'Fernanda Lima', cpf: '999.888.777-66', telefone: '(11) 99999-8888', email: 'fernanda@email.com' }
    ];

    const STORAGE_KEY = 'rapicar_pendencias_v1';

    function carregarEstado() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { clientes: {}, alugueis: [], dividas: [] };
            return JSON.parse(raw);
        } catch (e) {
            return { clientes: {}, alugueis: [], dividas: [] };
        }
    }

    // Status: automático com base nas dividas cadastradas no localStorage.
    // Se existir pelo menos 1 dívida para o cliente -> devendo.
    function calcularStatusFinanceiro(clienteId, estado) {
        const dividas = (estado.dividas || []).filter(d => d.clienteId === clienteId);
        const isDevendo = dividas.length > 0;
        return isDevendo ? { label: 'Devendo', color: '#ef4444' } : { label: 'Em dia', color: '#22c55e' };
    }

    function abrirStatusCliente(clienteId) {
        // Passa o cliente via sessionStorage (não deixa depender de querystring)
        sessionStorage.setItem('rapicar_status_cliente_id', String(clienteId));
        window.location.href = 'statusCliente.html';
    }

    function criarIndicadorStatus({ label, color }) {
        return `
            <span style="display:inline-block; padding:10px 18px; border-radius:12px; font-family:Poppins, sans-serif; font-weight:600; background:${color}; color:#fff; box-shadow: 0 0 0 3px rgba(255,255,255,0.15);">
                ${label}
            </span>
        `;
    }

    function renderizarTabelaClientes(dados) {
        corpoTabelaClientes.innerHTML = '';

        if (!dados || dados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="6" style="text-align:center; padding:20px; color:#fff;">Nenhum cliente encontrado</td>`;
            corpoTabelaClientes.appendChild(tr);
            return;
        }

        const estado = carregarEstado();

        dados.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.className = 'linha-cliente';
            tr.style.transition = 'background-color 0.3s ease';

            const status = calcularStatusFinanceiro(cliente.id, estado);

            tr.innerHTML = `
                <td class="texto">${cliente.id}</td>
                <td class="texto">${cliente.nome}</td>
                <td class="texto">${cliente.cpf}</td>
                <td class="texto">${cliente.telefone}</td>
                <td class="texto">${cliente.email}</td>
                <td>
                    <div style="display:flex; gap:10px; align-items:center; justify-content:flex-end;">
                        <button
                            type="button"
                            class="botao-status-cliente"
                            title="Ver status"
                            style="padding:10px 14px; border-radius:12px; border:none; cursor:pointer; background:rgba(255,255,255,0.12); color:#fff; font-family:Poppins, sans-serif; font-weight:600;">
                            Status
                        </button>
                        ${criarIndicadorStatus(status)}
                    </div>
                </td>
            `;

            tr.addEventListener('mouseenter', () => {
                tr.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
            tr.addEventListener('mouseleave', () => {
                tr.style.backgroundColor = 'transparent';
            });

            const btnStatus = tr.querySelector('.botao-status-cliente');
            btnStatus.addEventListener('click', (e) => {
                e.stopPropagation();
                abrirStatusCliente(cliente.id);
            });

            corpoTabelaClientes.appendChild(tr);
        });
    }

    // Busca
    if (inputBuscaCliente) {
        inputBuscaCliente.addEventListener('input', () => {
            const termoBusca = inputBuscaCliente.value.toLowerCase().trim();

            const filtrados = listaClientesGlobal.filter(cliente => {
                if (!termoBusca) return true;
                return (
                    cliente.nome.toLowerCase().includes(termoBusca) ||
                    String(cliente.id).includes(termoBusca) ||
                    (cliente.cpf || '').includes(termoBusca) ||
                    (cliente.email || '').toLowerCase().includes(termoBusca)
                );
            });

            renderizarTabelaClientes(filtrados);
        });
    }

    renderizarTabelaClientes(listaClientesGlobal);
});

