document.addEventListener('DOMContentLoaded', async () => {

    const inputBuscaCliente = document.getElementById('input-busca-cliente');
    const corpoTabelaAlugueis = document.getElementById('corpo-tabela-alugueis');
    await carregarClientes();
    await carregarCarros();
    await carregarAlugueis();
    async function carregarClientes() {

        const resposta = await fetch('http://localhost:5067/api/Cliente');

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }


        listaClientesGlobal = await resposta.json();
    }
    async function carregarCarros() {
        try {
            const resposta = await fetch('http://localhost:5067/api/Carro');
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

            listaCarrosGlobal = await resposta.json();
        } catch (erro) {
            console.error('Erro ao carregar carros:', erro);
        }
    }
    async function carregarAlugueis() {

        const resposta = await fetch('http://localhost:5067/api/Aluguel');

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }


        listaAlugueisGlobal = await resposta.json();
        renderizarTabelaAluguéis(listaAlugueisGlobal);
    }
    async function atualizarAluguel(aluguel) {
        const dados = {
            Aluguel_ID: aluguel.aluguel_ID,
            Aluguel_Data_Inicio: prompt("Novo nome:", aluguel.aluguel_Nome),
            Aluguel_Data_Fim: prompt("Novo CPF:", aluguel.aluguel_CPF),
            Aluguel_Ativo: aluguel.aluguel_Ativo
        };
        if (
            dados.Aluguel_Data_Inicio === null ||
            dados.Aluguel_Data_Fim === null
           
        ) {
            return;
        }
        console.log(JSON.stringify(dados, null, 2));
        const resposta = await fetch(`http://localhost:5067/api/Aluguel/${aluguel.aluguel_ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            await carregarAlugueis();
            alert("Aluguel atualizado com sucesso!");

        } else {
            const erro = await resposta.text();
            console.error("Erro da API:", erro);
            alert("Erro ao atualizar. Veja o console (F12).");
        }

    }

    async function deletarAluguel(id) {
        const resposta = await fetch(`http://localhost:5067/api/Aluguel/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            
        });

        if (resposta.ok) {
            await carregarAlugueis();
            alert("Aluguel deletado com sucesso!");
            
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

    function renderizarTabelaAluguéis(dados){
        if (!dados || dados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="6" style="text-align:center; padding:20px; color:#fff;">Nenhum aluguel encontrado</td>`;
            corpoTabelaAlugueis.appendChild(tr);
            return;
        }

        dados.forEach(aluguel => {
            const tr = document.createElement('tr');
            tr.className = 'linha-cliente';
            tr.style.transition = 'background-color 0.3s ease';


            tr.innerHTML = `
            
                <td class="texto">${aluguel.aluguel_ID}</td>
                <td class="texto">${new Date(aluguel.aluguel_Data_Inicio).toLocaleDateString('pt-BR')}</td>
                <td class="texto">${new Date(aluguel.aluguel_Data_Fim).toLocaleDateString('pt-BR')}</td>
                <td class="texto">${aluguel.aluguel_Valor_Total}</td>
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
                atualizarAluguel(aluguel);
                carregarAlugueis();
            });
            const btnDeletar = tr.querySelector('.botao-deletar');
            aplicarEstiloBotao(btnDeletar, '#ef4444');
            btnDeletar.addEventListener('click', (e) => {
                e.stopPropagation();
                const confirmado = confirm(
                    `Deseja realmente excluir o aluguel?\n\n` +
                    `ID: ${aluguel.aluguel_ID}\n` +
                    `Data início: ${aluguel.aluguel_Data_Inicio}\n` +
                    `Data fim: ${aluguel.aluguel_Data_Fim}\n` +
                    `Valor total: ${aluguel.aluguel_Valor_Total}\n`

                );

                if (!confirmado) {
                    return;
                }

                deletarAluguel(aluguel.aluguel_ID);

            });
            tr.addEventListener('mouseenter', () => {
                tr.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
            tr.addEventListener('mouseleave', () => {
                tr.style.backgroundColor = 'transparent';
            });

            

            corpoTabelaAlugueis.appendChild(tr);
        });
    }




   
});
let listaClientesGlobal = [];
let listaCarrosGlobal = [];
let listaAlugueisGlobal = [];
