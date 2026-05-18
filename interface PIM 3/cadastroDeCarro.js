async function criarCarro() {
    const dados = {
        Carro_Marca: document.getElementById("Carro_Marca").value,
        Carro_Modelo: document.getElementById("Carro_Modelo").value,
        Carro_Ano_Fabricação: parseInt(document.getElementById("Carro_Ano_Fabricação").value),
        Carro_Número: parseInt(document.getElementById("Carro_Número").value),
        Carro_Versão: document.getElementById("Carro_Versão").value,
        Carro_Câmbio: document.getElementById("Carro_Cãmbio").value,
        Carro_Placa: document.getElementById("Carro_Placa").value,
        Carro_Cor: document.getElementById("Carro_Cor").value,
        Carro_Status: document.getElementById("Carro_Status").value,
        Carro_Qtd_Aluguéis: parseInt(document.getElementById("Carro_Qtd_Aluguéis").value),
        Carro_Valor_Diária: parseFloat(document.getElementById("Carro_Valor_Diária").value),
        Carro_Ativo: true
    };



    try {
        const resposta = await fetch("http://localhost:5067/api/Carro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
        console.log(resposta.status);
        const texto = await resposta.text();

        console.log("Status:", resposta.status);
        console.log("Resposta:", texto);

        if (resposta.ok) {
            alert("Carro cadastrado com sucesso!");

        } else {
            alert("Erro ao cadastrar carro.");
        }
    }
    catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível conectar com a API.");
    }

}