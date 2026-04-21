document.addEventListener('DOMContentLoaded', () => {
    const btnAbrir = document.getElementById('btn-abrir-lista');
    const secaoClientes = document.getElementById('secao-clientes');
    const containerSelecao = document.getElementById('container-selecao-cliente');
    const inputBusca = document.getElementById('input-busca-cliente');
    const corpoTabela = document.getElementById('corpo-tabela-clientes');

    let listaClientesGlobal = []; // Para armazenar os dados vindos do SQL

    // Função para buscar dados da tabela 'cliente' via API (PHP, Node, etc)
    async function carregarClientesDoBanco() {
        try {
            // Substitua 'buscar_clientes.php' pelo caminho do seu script de backend
            const resposta = await fetch('buscar_clientes.php'); 
            const clientes = await resposta.json();
            
            listaClientesGlobal = clientes;
            renderizarTabela(clientes);
        } catch (erro) {
            console.error("Erro ao conectar com o banco de dados:", erro);
            corpoTabela.innerHTML = `<tr><td colspan="2" class="texto">Erro ao carregar dados do banco de dados.</td></tr>`;
        }
    }

    function renderizarTabela(dados) {
        corpoTabela.innerHTML = "";
        dados.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.className = 'linha-cliente';
            // Ajuste os nomes 'cliente.id', 'cliente.nome' e 'cliente.cpf' de acordo com as colunas do seu SQL
            const idNomeFormatado = `${cliente.id} - ${cliente.nome}`;
            
            tr.innerHTML = `
                <td class="texto">${idNomeFormatado}</td>
                <td class="texto">${cliente.cpf || cliente.documento}</td>
            `;

            tr.addEventListener('click', () => {
                containerSelecao.innerHTML = `<span class="texto" style="font-weight: bold; color: #fff;">${idNomeFormatado}</span>`;
                secaoClientes.style.display = 'none';
            });

            corpoTabela.appendChild(tr);
        });
    }

    // 1. Botão que abre a lista e dispara a consulta ao banco
    btnAbrir.addEventListener('click', () => {
        secaoClientes.style.display = 'block';
        secaoClientes.scrollIntoView({ behavior: 'smooth' });
        carregarClientesDoBanco(); // Chama o SQL toda vez que abrir ou você pode chamar uma vez só no load
    });

    // 2. Lógica de busca em tempo real (filtra o que já foi baixado do banco)
    inputBusca.addEventListener('input', () => {
        const termoBusca = inputBusca.value.toLowerCase();
        const filtrados = listaClientesGlobal.filter(c => 
            c.nome.toLowerCase().includes(termoBusca) || 
            c.id.toString().includes(termoBusca)
        );
        renderizarTabela(filtrados);
    });
});