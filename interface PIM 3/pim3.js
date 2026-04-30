document.addEventListener('DOMContentLoaded', () => {
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

    // Dados mock de clientes
    let listaClientesGlobal = [
        { id: 1, nome: 'João Silva', cpf: '123.456.789-00' },
        { id: 2, nome: 'Maria Santos', cpf: '987.654.321-00' },
        { id: 3, nome: 'Pedro Oliveira', cpf: '456.789.123-00' },
        { id: 4, nome: 'Ana Costa', cpf: '321.654.987-00' },
        { id: 5, nome: 'Carlos Souza', cpf: '789.123.456-00' }
    ];

    // Dados mock de carros
    let listaCarrosGlobal = [
        { id: 1, marca: 'Volkswagen', modelo: 'Gol', cor: 'Preto', placa: 'ABC-1234' },
        { id: 2, marca: 'Chevrolet', modelo: 'Onix', cor: 'Branco', placa: 'DEF-5678' },
        { id: 3, marca: 'Ford', modelo: 'Fiesta', cor: 'Prata', placa: 'GHI-9012' },
        { id: 4, marca: 'Toyota', modelo: 'Corolla', cor: 'Preto', placa: 'JKL-3456' },
        { id: 5, marca: 'Honda', modelo: 'Civic', cor: 'Vermelho', placa: 'MNO-7891' },
    ];

    // Inicializa a tabela de carros visível
    renderizarTabelaCarros(listaCarrosGlobal);

    // --- FUNÇÕES DE CLIENTES ---
    function renderizarTabelaClientes(dados) {
        corpoTabelaClientes.innerHTML = "";
        dados.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.className = 'linha-cliente';
            const idNomeFormatado = `${cliente.id} - ${cliente.nome}`;
            
            tr.innerHTML = `
                <td class="texto">${idNomeFormatado}</td>
                <td class="texto">${cliente.cpf}</td>
            `;

            tr.addEventListener('click', () => {
                containerSelecaoCliente.innerHTML = `<span class="texto" style="font-weight: bold; color: #fff;">${idNomeFormatado}</span>`;
                secaoClientes.style.display = 'none';
            });

            corpoTabelaClientes.appendChild(tr);
        });
    }

    // --- FUNÇÕES DE CARROS ---
    function renderizarTabelaCarros(dados) {
        corpoTabelaCarros.innerHTML = "";
        dados.forEach(carro => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="texto">${carro.id}</td>
                <td class="texto">${carro.marca}</td>
                <td class="texto">${carro.modelo}</td>
                <td class="texto">${carro.cor}</td>
                <td class="texto">${carro.placa}</td>
            `;
            corpoTabelaCarros.appendChild(tr);
        });
    }

    function renderizarTabelaSelecaoCarros(dados) {
        corpoTabelaSelecaoCarros.innerHTML = "";
        dados.forEach(carro => {
            const tr = document.createElement('tr');
            const modeloFormatado = `${carro.marca} ${carro.modelo}`;
            
            tr.innerHTML = `
                <td class="texto">${modeloFormatado}</td>
                <td class="texto">${carro.cor}</td>
                <td class="texto">${carro.placa}</td>
            `;

            tr.addEventListener('click', () => {
                containerSelecaoCarro.innerHTML = `<span class="texto" style="font-weight: bold; color: #fff;">${modeloFormatado} - ${carro.placa}</span>`;
                secaoCarros.style.display = 'none';
            });

            corpoTabelaSelecaoCarros.appendChild(tr);
        });
    }

    btnAbrirLista.addEventListener('click', () => {
        secaoClientes.style.display = 'block';
        secaoClientes.scrollIntoView({ behavior: 'smooth' });
        renderizarTabelaClientes(listaClientesGlobal);
    });

    inputBuscaCliente.addEventListener('input', () => {
        const termoBusca = inputBuscaCliente.value.toLowerCase();
        const filtrados = listaClientesGlobal.filter(c => 
            c.nome.toLowerCase().includes(termoBusca) || 
            c.id.toString().includes(termoBusca)
        );
        renderizarTabelaClientes(filtrados);
    });
    btnAbrirListaCarros.addEventListener('click', () => {
        secaoCarros.style.display = 'block';
        secaoCarros.scrollIntoView({ behavior: 'smooth' });
        renderizarTabelaSelecaoCarros(listaCarrosGlobal);
    });

    inputBuscaCarro.addEventListener('input', () => {
        const termoBusca = inputBuscaCarro.value.toLowerCase();
        const filtrados = listaCarrosGlobal.filter(c => 
            c.marca.toLowerCase().includes(termoBusca) || 
            c.modelo.toLowerCase().includes(termoBusca) ||
            c.placa.toLowerCase().includes(termoBusca)
        );
        renderizarTabelaSelecaoCarros(filtrados);
    });
});
