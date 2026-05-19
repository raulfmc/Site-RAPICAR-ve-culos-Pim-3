document.addEventListener('DOMContentLoaded', async () => {

    await carregarCarros();
    await carregarClientes();

    renderizarTabelaCarros(listaCarrosGlobal);

    async function carregarCarros() {
        try {
            const resposta = await fetch('http://localhost:5067/api/Carro');
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

            listaCarrosGlobal = await resposta.json();
        } catch (erro) {
            console.error('Erro ao carregar carros:', erro);
        }
    }

    async function carregarClientes() {
        try {
            const resposta = await fetch('http://localhost:5067/api/Cliente');
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

            listaClientesGlobal = await resposta.json();
        } catch (erro) {
            console.error('Erro ao carregar clientes:', erro);
        }
    }

    function renderizarTabelaClientes(dados) {
        corpoTabelaClientes.innerHTML = "";

        dados.forEach(cliente => {
            const tr = document.createElement('tr');

            const idNome = `${cliente.cliente_ID} - ${cliente.cliente_Nome}`;

            tr.innerHTML = `
                <td class="texto">${cliente.cliente_ID}</td>
                <td class="texto">${cliente.cliente_Nome}</td>
                <td class="texto">${cliente.cliente_CPF}</td>
                <td>
                    <button class="botao-carro">Escolher</button>
                </td>
            `;

            tr.addEventListener('click', () => {
                clienteSelecionado = cliente;
                containerSelecaoCliente.innerHTML =
                    `<span class="texto">${idNome}</span>`;

                secaoClientes.style.display = 'none';
            });

            corpoTabelaClientes.appendChild(tr);
        });
    }

    function obterClientesDisponiveisParaSelecao() {
        return listaClientesGlobal;
    }

    btnAbrirLista.addEventListener('click', () => {
        secaoClientes.style.display = 'block';
        renderizarTabelaClientes(listaClientesGlobal);
    });

    inputBuscaCliente.addEventListener('input', () => {
        const termo = inputBuscaCliente.value.toLowerCase();

        const filtrados = listaClientesGlobal.filter(c =>
            c.cliente_Nome.toLowerCase().includes(termo) ||
            String(c.cliente_ID).includes(termo)
        );

        renderizarTabelaClientes(filtrados);
    });

    // ================= CARROS =================

    function renderizarTabelaCarros(dados) {
        corpoTabelaCarros.innerHTML = "";

        dados.forEach(carro => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td class="texto">${carro.carro_ID}</td>
                <td class="texto">${carro.carro_Marca}</td>
                <td class="texto">${carro.carro_Modelo}</td>
                <td class="texto">${carro.carro_Placa}</td>
                <td class="texto">R$ ${Number(carro.carro_Valor_Diária || 0).toFixed(2)}</td>
                <td>
                    <button class="botao-carro">Escolher</button>
                </td>
            `;

            tr.querySelector('.botao-carro').addEventListener('click', () => {
                carroSelecionado = carro;
                containerSelecaoCarro.innerHTML =
                
                    `<span class="texto">
                        ${carro.carro_Marca} ${carro.carro_Modelo} - ${carro.carro_Placa}
                    </span>`;

                secaoCarros.style.display = 'none';
            });

            corpoTabelaCarros.appendChild(tr);
        });
    }

    btnAbrirListaCarros.addEventListener('click', () => {
        secaoCarros.style.display = 'block';
        renderizarTabelaCarros(listaCarrosGlobal);
    });

    inputBuscaCarro.addEventListener('input', () => {
        const termo = inputBuscaCarro.value.toLowerCase();

        const filtrados = listaCarrosGlobal.filter(c =>
            c.carro_Marca.toLowerCase().includes(termo) ||
            c.carro_Modelo.toLowerCase().includes(termo) ||
            c.carro_Placa.toLowerCase().includes(termo)
        );

        renderizarTabelaCarros(filtrados);
    });

});

// ================= GLOBAIS =================

let listaClientesGlobal = [];
let listaCarrosGlobal = [];
let clienteSelecionado = null;
let carroSelecionado = null;
 // Elementos do cliente
    const btnAbrirLista = document.getElementById('btn-abrir-lista');
    const secaoClientes = document.getElementById('secao-clientes');
    const containerSelecaoCliente = document.getElementById('container-selecao-cliente');
    const inputBuscaCliente = document.getElementById('input-busca-cliente');
    const corpoTabelaClientes = document.getElementById('corpo-tabela-clientes');

    // Elementos do carro
    const btnAbrirListaCarros = document.getElementById('btn-abrir-lista-carros');
    const secaoCarros = document.getElementById('secao-carros');
    const containerSelecaoCarro = document.getElementById('container-selecao-carro');
    const inputBuscaCarro = document.getElementById('input-busca-carro');
    const corpoTabelaSelecaoCarros = document.getElementById('corpo-tabela-selecao-carros');
    const corpoTabelaCarros = document.getElementById('corpo-tabela-carros');