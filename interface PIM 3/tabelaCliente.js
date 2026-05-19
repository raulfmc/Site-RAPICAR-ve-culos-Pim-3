document.addEventListener('DOMContentLoaded', async () => {
    
    const inputBuscaCliente = document.getElementById('input-busca-cliente');
    const corpoTabelaClientes = document.getElementById('corpo-tabela-clientes');
    await carregarClientes();
    await carregarDividas();
    async function carregarClientes() {

        const resposta = await fetch('http://localhost:5067/api/Cliente');
        
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }


        listaClientesGlobal = await resposta.json();
        renderizarTabelaClientes(listaClientesGlobal);
    }
    async function carregarDividas() {

        const resposta = await fetch('http://localhost:5067/api/Divida');

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }


        listaDividasGlobal = await resposta.json();
    }
    async function atualizarCliente(cliente) {
        const dados = {
            Cliente_ID: cliente.cliente_ID,
            Cliente_Nome: prompt("Novo nome:", cliente.cliente_Nome),
            Cliente_CPF: prompt("Novo CPF:", cliente.cliente_CPF),
            Cliente_Telefone: prompt("Novo telefone:", cliente.cliente_Telefone),
            Cliente_Email: prompt("Novo Email:", cliente.cliente_Email),
            Cliente_Endereco: prompt("Novo Endereço:", cliente.cliente_Endereco),
            Cliente_Ativo: cliente.cliente_Ativo
        };
        if (
            dados.Cliente_Nome === null ||
            dados.Cliente_CPF === null ||
            dados.Cliente_Telefone === null ||
            dados.Cliente_Email === null ||
            dados.Cliente_Endereco === null
        ) {
            return;
        }
        console.log(JSON.stringify(dados, null, 2));
        const resposta = await fetch(`http://localhost:5067/api/Cliente/${cliente.cliente_ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            await carregarClientes();
            alert("Cliente atualizado com sucesso!");
            
        } else {
            const erro = await resposta.text();
            console.error("Erro da API:", erro);
            alert("Erro ao atualizar. Veja o console (F12).");
        }
        
    }

    async function deletarCliente(id) {
        const resposta = await fetch(`http://localhost:5067/api/Cliente/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert("Cliente deletado com sucesso!");
            await carregarClientes();
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
        const dividas = (estado.dividas || []).filter(d => d.cliente_ID === clienteId);
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

            const status = calcularStatusFinanceiro(cliente.cliente_ID, estado);

            tr.innerHTML = `
            
                <td class="texto">${cliente.cliente_ID}</td>
                <td class="texto">${cliente.cliente_Nome}</td>
                <td class="texto">${cliente.cliente_CPF}</td>
                <td class="texto">${cliente.cliente_Telefone}</td>
                <td class="texto">${cliente.cliente_Email}</td>
                <td class="texto">${cliente.cliente_Endereco}</td>
                <td>${criarIndicadorStatus(status)}</td>
                <td>
                    <div style="display:flex; gap:10px; align-items:center; justify-content:center;">
                     
                        <button
                            type="button"
                            class="botao-status-cliente"
                            title="Ver status"
                            style="padding:10px 14px; border-radius:12px; border:none; cursor:pointer; background:rgba(255,255,255,0.12); color:#fff; font-family:Poppins, sans-serif; font-weight:600;">
                            Status
                        </button>
                       
                    </div>
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
                atualizarCliente(cliente);
                carregarClientes();
            });
            const btnDeletar = tr.querySelector('.botao-deletar');
            aplicarEstiloBotao(btnDeletar, '#ef4444');
            btnDeletar.addEventListener('click', (e) => {
                e.stopPropagation();
                const confirmado = confirm(
                    `Deseja realmente excluir o carro?\n\n` +
                    `ID: ${cliente.cliente_ID}\n` +
                    `Nome: ${cliente.cliente_Nome}\n` +
                    `CPF: ${cliente.cliente_CPF}\n` +
                    `Telefone: ${cliente.cliente_Telefone}\n` +
                    `Email: ${cliente.cliente_Email}`
                );

                if (!confirmado) {
                    return;
                }

                deletarCliente(cliente.cliente_ID);

            });
            tr.addEventListener('mouseenter', () => {
                tr.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
            tr.addEventListener('mouseleave', () => {
                tr.style.backgroundColor = 'transparent';
            });

            const btnStatus = tr.querySelector('.botao-status-cliente');
            btnStatus.addEventListener('click', (e) => {
                e.stopPropagation();
                abrirStatusCliente(cliente.cliente_ID);
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
                    cliente.cliente_Nome.toLowerCase().includes(termoBusca) ||
                    String(cliente.cliente_ID).includes(termoBusca) ||
                    (cliente.cliente_CPF || '').includes(termoBusca) ||
                    (cliente.cliente_Email || '').toLowerCase().includes(termoBusca) ||
                    (cliente.cliente_Endereco || '').toLowerCase().includes(termoBusca)
                );
            });

            renderizarTabelaClientes(filtrados);
        });
    }

    renderizarTabelaClientes(listaClientesGlobal);
});
let listaClientesGlobal = [];
