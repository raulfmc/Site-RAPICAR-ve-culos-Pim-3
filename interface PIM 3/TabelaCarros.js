document.addEventListener('DOMContentLoaded', async () => {
  // Elementos do DOM
  const inputBuscaCarro = document.getElementById('input-busca-carro');
  const corpoTabelaCarros = document.getElementById('corpo-tabela-carros');
  await carregarCarros();
  async function carregarCarros() {

    const resposta = await fetch('http://localhost:5067/api/Carro');

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }


    listaCarrosGlobal = await resposta.json();

    console.log('Carros recebidos da API:', listaCarrosGlobal);

    // Exibe os carros na tabela
    renderizarTabelaCarros(listaCarrosGlobal);


  }
  async function atualizarCarro(carro) {
    const dados = {
      Carro_Marca: prompt("Nova marca:"),
      Carro_Modelo: prompt("Novo modelo:"),
      Carro_Ano_Fabricação: prompt("Novo ano de fabricação:"),
      Carro_Número: prompt("Novo número do chassi:"),
      Carro_Versão: prompt("Nova versão:"),
      Carro_Câmbio: prompt("Novo câmbio:"),
      Carro_Placa: prompt("Nova placa:"),
      Carro_Cor: prompt("Nova cor:"),
      Carro_Valor_Diária: prompt("Novo valor da diária:"),
      Carro_Ativo: true
    };

    const resposta = await fetch(`http://localhost:5067/api/Carro/${carro.carro_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });
    const texto = await resposta.text();


    if (resposta.ok) {
      await carregarCarros();
      alert("Carro atualizado com sucesso!");
      await renderizarTabelaCarros();

    } else {
      alert("Erro ao atualizar.");
    }
  }

  async function deletarCarro(id) {
    const resposta = await fetch(`http://localhost:5067/api/Carro/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },

    });


    if (resposta.ok) {
      await carregarCarros();
      alert("Carro deletado com sucesso!");
      await renderizarTabelaCarros();

    } else {
      const erro = await resposta.text();
      console.log(erro);
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
  if (!inputBuscaCarro || !corpoTabelaCarros) return;






  function renderizarTabelaCarros(dados) {
    corpoTabelaCarros.innerHTML = '';

    if (!dados || dados.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="6" style="padding: 20px; color: #fff;">Nenhum carro encontrado</td>`;
      corpoTabelaCarros.appendChild(tr);
      return;
    }

    dados.forEach((carro) => {

      const tr = document.createElement('tr');
      tr.className = 'linha-carro';
      tr.style.cursor = 'pointer';
      tr.style.transition = 'background-color 0.3s ease';

      tr.innerHTML = `
        <td class="texto">${carro.carro_ID}</td> 
        <td class="texto">${carro.carro_Marca}</td>
        <td class="texto">${carro.carro_Modelo}</td>
        <td class="texto">${carro.carro_Ano_Fabricação}</td>
        <td class="texto">${carro.carro_Número}</td>
        <td class="texto">${carro.carro_Versão}</td>
        <td class="texto">${carro.carro_Câmbio}</td>
        <td class="texto">${carro.carro_Placa}</td>
        <td class="texto">${carro.carro_Cor}</td>
        <td class="texto">${carro.carro_Qtd_Aluguéis}</td>
        <td class="texto">R$ ${carro.carro_Valor_Diária}</td>
        <td>
          <span class="status-carro">
            ${carro.carro_Status}
          </span>
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
        atualizarCarro(carro);
      });
      const btnDeletar = tr.querySelector('.botao-deletar');
      aplicarEstiloBotao(btnDeletar, '#ef4444');
      btnDeletar.addEventListener('click', (e) => {
        e.stopPropagation();
        const confirmado = confirm(
          `Deseja realmente excluir o carro?\n\n` +
          `ID: ${carro.carro_ID}\n` +
          `Marca: ${carro.carro_Marca}\n` +
          `Modelo: ${carro.carro_Modelo}\n` +
          `Placa: ${carro.carro_Placa}`
        );

        if (!confirmado) {
          return;
        }

        deletarCarro(carro.carro_ID);

      });
      
      const statusSpan = tr.querySelector('.status-carro');
      const status = carro.carro_Status;

        let cor = '#22c55e';

        if (status === 'Alugado') {
          cor = '#f59e0b';
        }

        if (status === 'Em manutenção') {
          cor = '#ef4444';
        }

        aplicarEstiloBotao(statusSpan, cor);

        statusSpan.textContent = status;
        
      

      

      tr.addEventListener('mouseenter', () => {
        tr.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      });
      tr.addEventListener('mouseleave', () => {
        tr.style.backgroundColor = 'transparent';
      });


      tr.addEventListener('click', () => {
        alert(
          `Carro selecionado:\n\nID: ${carro.carro_ID}\nMarca: ${carro.carro_Marca}\nModelo: ${carro.carro_Modelo}\nCor: ${carro.carro_Cor}\nPlaca: ${carro.carro_Placa}`
        );
      });

      corpoTabelaCarros.appendChild(tr);
    });
  }

  // Filtro por marca/modelo/cor/placa/id
  inputBuscaCarro.addEventListener('input', () => {
    const termoBusca = inputBuscaCarro.value.trim().toLowerCase();

    const filtrados = listaCarrosGlobal.filter((carro) => {
      return (
        carro.carro_ID.toString().includes(termoBusca) ||
        carro.carro_Marca.toLowerCase().includes(termoBusca) ||
        carro.carro_Modelo.toLowerCase().includes(termoBusca) ||
        (carro.carro_Cor || '').toLowerCase().includes(termoBusca) ||
        carro.carro_Placa.toLowerCase().includes(termoBusca)
      );
    });

    renderizarTabelaCarros(filtrados);
  });
});
let listaCarrosGlobal = [

];
