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

    // Dados mock de carros + valor da diária fictício (diferente entre carros, R$90..R$150)
    let listaCarrosGlobal = [
        { id: 1, marca: 'Volkswagen', modelo: 'Gol', cor: 'Preto', placa: 'ABC-1234', diaria: 95 },
        { id: 2, marca: 'Chevrolet', modelo: 'Onix', cor: 'Branco', placa: 'DEF-5678', diaria: 110 },
        { id: 3, marca: 'Ford', modelo: 'Fiesta', cor: 'Prata', placa: 'GHI-9012', diaria: 125 },
        { id: 4, marca: 'Toyota', modelo: 'Corolla', cor: 'Preto', placa: 'JKL-3456', diaria: 145 },
        { id: 5, marca: 'Honda', modelo: 'Civic', cor: 'Vermelho', placa: 'MNO-7891', diaria: 100 },
    ];


    // Inicializa a tabela de carros visível
    renderizarTabelaCarros(listaCarrosGlobal);

    // --- CONTROLE (fictício) DE DÍVIDAS / STATUS via localStorage ---
    const STORAGE_KEY = 'rapicar_pendencias_v1';

    const hojeISO = () => new Date().toISOString().slice(0, 10);
    const toDateMidnight = (iso) => {
        const d = new Date(iso + 'T00:00:00');
        return d;
    };

    function carregarEstado() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return { clientes: {}, alugueis: [], dividas: [] };
            }
            return JSON.parse(raw);
        } catch (e) {
            return { clientes: {}, alugueis: [], dividas: [] };
        }
    }

    function salvarEstado(estado) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    }

    // Garante que todo cliente exista no storage
    function garantirClientesNoStorage() {
        const estado = carregarEstado();
        listaClientesGlobal.forEach(c => {
            if (!estado.clientes[c.id]) {
                estado.clientes[c.id] = { bloqueado: false };
            }
        });
        salvarEstado(estado);
    }

    function contarDividasPorCliente(estado, clienteId) {
        return (estado.dividas || []).filter(d => d.clienteId === clienteId).length;
    }

    function calcularStatusCliente(estado, clienteId) {
        const dividas = (estado.dividas || []).filter(d => d.clienteId === clienteId);
        // regra: se houver pelo menos uma dívida -> Devendo
        return dividas.length > 0;
    }

    function recalcBloqueiosETatus() {
        const estado = carregarEstado();
        listaClientesGlobal.forEach(c => {
            const temDevendo = calcularStatusCliente(estado, c.id);
            const qtd = contarDividasPorCliente(estado, c.id);

            // bloqueia quando chegar em 3 dívidas
            estado.clientes[c.id].bloqueado = qtd >= 3;
            // statusEmDia / devendo é derivado (não precisa armazenar)
        });
        salvarEstado(estado);
    }

    function registrarDividaAtraso({ clienteId, aluguelId, primeiroDia, ultimoDia }) {
        const estado = carregarEstado();
        const dividasCliente = (estado.dividas || []).filter(d => d.clienteId === clienteId);
        if (dividasCliente.length >= 3) return; // limite máximo

        const atrasoEmDias = Math.max(0, Math.ceil((new Date().setHours(0,0,0,0) - toDateMidnight(ultimoDia).getTime()) / (1000*60*60*24)));

        const novaDivida = {
            id: 'd_' + Math.random().toString(16).slice(2),
            clienteId,
            aluguelId,
            valor: 100, // fictício
            dataCriacao: hojeISO(),
            primeiroDia,
            ultimoDia,
            atrasoDias: atrasoEmDias,
            status: atrasoEmDias > 0 ? 'Vencido' : 'Próximo do vencimento'
        };

        estado.dividas = estado.dividas || [];
        estado.dividas.push(novaDivida);

        // gera status e bloqueio imediatamente
        recalcBloqueiosETatus();

        return novaDivida;
    }

    // Inicializa storage + status derivados
    garantirClientesNoStorage();
    recalcBloqueiosETatus();

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
                <td class="texto">R$ ${Number(carro.diaria || 0).toFixed(2).replace('.', ',')}</td>
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
                containerSelecaoCarro.innerHTML = `<span class="texto" style="font-weight: bold; color: #fff;">${modeloFormatado} - ${carro.placa} | Diária: R$ ${Number(carro.diaria || 0).toFixed(2).replace('.', ',')}</span>`;

            secaoCarros.style.display = 'none';
            // recalcular total e mostrar valor total e diária imediatamente
            recalcularValorTotal();
            });



            corpoTabelaSelecaoCarros.appendChild(tr);

        });
    }

    function obterClientesDisponiveisParaSelecao() {
        const estado = carregarEstado();
        return listaClientesGlobal.filter(c => !estado.clientes[c.id]?.bloqueado);
    }

    btnAbrirLista.addEventListener('click', () => {
        secaoClientes.style.display = 'block';
        secaoClientes.scrollIntoView({ behavior: 'smooth' });
        renderizarTabelaClientes(obterClientesDisponiveisParaSelecao());
    });

    inputBuscaCliente.addEventListener('input', () => {
        const termoBusca = inputBuscaCliente.value.toLowerCase();
        const disponiveis = obterClientesDisponiveisParaSelecao();
        const filtrados = disponiveis.filter(c => 
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

    // Dados de aluguel (primeiro/último dia) - fictício
    const inputPrimeiroDia = document.getElementById('primeiro-dia-aluguel');
    const inputUltimoDia = document.getElementById('ultimo-dia-aluguel');
    const btnCotar = document.getElementById('btn-cotar');

    function getClienteSelecionadoId() {
        // containerSelecaoCliente recebe texto: "{id} - {nome}"
        const txt = (containerSelecaoCliente.innerText || '').trim();
        const match = txt.match(/^(\d+)/);
        return match ? Number(match[1]) : null;
    }

    function getUltimoDiaEscolhido() {
        return inputUltimoDia && inputUltimoDia.value ? inputUltimoDia.value : null;
    }

    function getPrimeiroDiaEscolhido() {
        return inputPrimeiroDia && inputPrimeiroDia.value ? inputPrimeiroDia.value : null;
    }

    const resumoValorTotal = document.getElementById('resumo-valor-total');

    function formatBRL(value) {
        return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
    }

    function getCarroSelecionado() {
        const txt = (containerSelecaoCarro.innerText || '').trim();
        // Formato atual no container: "{marca modelo} - {placa} | Diária: R$ ..."
        const match = txt.match(/-\s*([^|]+)\|/);
        const placa = match ? match[1].trim() : null;
        // fallback: tenta pegar tudo após "-" até o fim (caso não exista o "|")
        if (!placa) {
            const matchPlacaFallback = txt.match(/-\s*(.+)$/);
            const placaFallback = matchPlacaFallback ? matchPlacaFallback[1].trim() : null;
            return listaCarrosGlobal.find(c => c.placa === placaFallback) || null;
        }
        return listaCarrosGlobal.find(c => c.placa === placa) || null;
    }

    function diasEntreDatas(primeiroDia, ultimoDia) {
        const a = toDateMidnight(primeiroDia);
        const b = toDateMidnight(ultimoDia);
            // conta dias inclusivos: ex 1..1 => 1 dia
            const diffMs = b.getTime() - a.getTime();
            return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
        }


    const resumoDiaria = document.getElementById('resumo-diaria');

    function recalcularValorTotal() {

        if (!resumoValorTotal) return;
        const primeiroDia = getPrimeiroDiaEscolhido();
        const ultimoDia = getUltimoDiaEscolhido();
        const carro = getCarroSelecionado();

        if (!primeiroDia || !ultimoDia || !carro) {
            // só atualiza quando tiver seleção completa
            return;
        }

        const diaria = Number(carro.diaria || 0);
        if (resumoDiaria) resumoDiaria.textContent = `Diária: ${formatBRL(diaria)}`;

        const dias = diasEntreDatas(primeiroDia, ultimoDia);
        const total = dias * diaria;
        resumoValorTotal.textContent = `Valor total: ${formatBRL(total)}`;
    }


    // Atualização automática sempre que carro/datas mudarem
    // (inclui recalcular total e exibir diária no resumo)
    if (btnCotar) {

        const atualizarPorMudanca = () => recalcularValorTotal();

        if (inputPrimeiroDia) inputPrimeiroDia.addEventListener('change', atualizarPorMudanca);
        if (inputUltimoDia) inputUltimoDia.addEventListener('change', atualizarPorMudanca);

        // também atualiza ao abrir/selecionar carro (containerSelecaoCarro é atualizado no click)
        // então recalcula em seguida após a seleção.
        const observer = new MutationObserver(() => {
            recalcularValorTotal();
        });
        if (containerSelecaoCarro) {
            observer.observe(containerSelecaoCarro, { childList: true, subtree: true, characterData: true });
        }

        btnCotar.addEventListener('click', () => {
            const clienteId = getClienteSelecionadoId();

            if (!clienteId) {
                alert('Escolha um cliente antes de cotar.');
                return;
            }

            const primeiroDia = getPrimeiroDiaEscolhido();
            const ultimoDia = getUltimoDiaEscolhido();
            if (!primeiroDia || !ultimoDia) {
                alert('Selecione o primeiro e o último dia do aluguel.');
                return;
            }

            // Se o último dia já passou, registrar uma dívida fictícia.
            const hoje = new Date().toISOString().slice(0, 10);
            const venceu = ultimoDia < hoje;

            if (venceu) {
                // aluguelId fictício (apenas para referenciar)
                const aluguelId = 'al_' + Math.random().toString(16).slice(2);
                registrarDividaAtraso({
                    clienteId,
                    aluguelId,
                    primeiroDia,
                    ultimoDia
                });
            }

            // Atualiza filtragem de clientes bloqueados imediatamente.
            // Se a seção estiver aberta, re-renderiza com os disponíveis.
            if (secaoClientes.style.display !== 'none') {
                renderizarTabelaClientes(obterClientesDisponiveisParaSelecao());
            }

            alert('Cotação concluída (modo fictício).');
        });
    }


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
