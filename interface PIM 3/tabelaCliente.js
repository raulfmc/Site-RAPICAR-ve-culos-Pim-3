document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const inputBuscaCliente = document.getElementById('input-busca-cliente');
    const corpoTabelaClientes = document.getElementById('corpo-tabela-clientes');

    // Dados mock de clientes
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

    // Renderiza a tabela de clientes inicialmente
    renderizarTabelaClientes(listaClientesGlobal);

    // Função para renderizar a tabela de clientes
    function renderizarTabelaClientes(dados) {
        corpoTabelaClientes.innerHTML = "";

        if (dados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="6" style="text-align: center; padding: 20px; color: #fff;">Nenhum cliente encontrado</td>`;
            corpoTabelaClientes.appendChild(tr);

            return;
        }

        dados.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.className = 'linha-cliente';
            tr.style.cursor = 'pointer';
            tr.style.transition = 'background-color 0.3s ease';

<<<<<<< HEAD
            // status do cliente (mock): se id for par -> em dia, se ímpar -> devendo
            // (ajuste aqui depois se você tiver um campo real no backend)
            const statusEmDia = (cliente.id % 2 === 0);

=======
>>>>>>> a20bc14762e770d3ba5ce26a08e69073a5a94bce
            tr.innerHTML = `
                <td class="texto">${cliente.id}</td>
                <td class="texto">${cliente.nome}</td>
                <td class="texto">${cliente.cpf}</td>
                <td class="texto">${cliente.telefone}</td>
                <td class="texto">${cliente.email}</td>
                <td>
                    <button
                        type="button"
                        class="toggle-status-cliente"
                        aria-pressed="${statusEmDia ? 'true' : 'false'}"
                        title="Alternar status do cliente"
                    >${statusEmDia ? 'Em dia' : 'Devendo'}</button>
                </td>
            `;


            // Efeito hover
            tr.addEventListener('mouseenter', () => {
                tr.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
            tr.addEventListener('mouseleave', () => {
                tr.style.backgroundColor = 'transparent';
            });

            // Clique para selecionar o cliente
            tr.addEventListener('click', () => {
                // Remove seleção anterior
                document.querySelectorAll('.linha-cliente').forEach(linha => {
                    linha.style.backgroundColor = 'transparent';
                });

                // Destaca a linha selecionada
                tr.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';

                // Exibe alerta com informações do cliente
                alert(`Cliente selecionado:\n\nID: ${cliente.id}\nNome: ${cliente.nome}\nCPF: ${cliente.cpf}\nTelefone: ${cliente.telefone}\nEmail: ${cliente.email}`);
            });

            // Botão de status (dia/devendo)
            const btnStatus = tr.querySelector('.toggle-status-cliente');

            function aplicarEstadoCliente(statusAtual) {
                const emDia = !!statusAtual;
                btnStatus.style.backgroundColor = emDia ? '#22c55e' : '#ef4444';
                btnStatus.style.color = '#fff';
                btnStatus.style.border = 'none';
                btnStatus.style.padding = '10px 18px';
                btnStatus.style.borderRadius = '12px';
                btnStatus.style.fontFamily = 'Poppins, sans-serif';
                btnStatus.style.fontWeight = '600';
                btnStatus.style.cursor = 'pointer';
                btnStatus.style.boxShadow = emDia
                    ? '0 0 0 3px rgba(34, 197, 94, 0.25)'
                    : '0 0 0 3px rgba(239, 68, 68, 0.25)';

                btnStatus.textContent = emDia ? 'Em dia' : 'Devendo';
                btnStatus.setAttribute('aria-pressed', emDia ? 'true' : 'false');
            }

            aplicarEstadoCliente(statusEmDia);

            btnStatus.addEventListener('click', (e) => {
                e.stopPropagation();
                // alterna
                cliente.__statusEmDia = !cliente.__statusEmDia;
                // se não existir ainda, usa statusEmDia inicial
                if (typeof cliente.__statusEmDia !== 'boolean') {
                    cliente.__statusEmDia = !statusEmDia;
                }
                aplicarEstadoCliente(cliente.__statusEmDia);
            });

            corpoTabelaClientes.appendChild(tr);
        });
    }


    // Função de busca/filtro
    inputBuscaCliente.addEventListener('input', () => {
        const termoBusca = inputBuscaCliente.value.toLowerCase();

        const filtrados = listaClientesGlobal.filter(cliente =>
            cliente.nome.toLowerCase().includes(termoBusca) ||
            cliente.id.toString().includes(termoBusca) ||
            cliente.cpf.includes(termoBusca) ||
            cliente.email.toLowerCase().includes(termoBusca)
        );

        renderizarTabelaClientes(filtrados);
    });
});
