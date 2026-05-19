async function criarDivida() {
    const dados = {
        Tipo_Erro: document.getElementById("Tipo_Erro").value,
        Valor_Divida: parseFloat(document.getElementById("Valor_Divida").value),
        Descricao_Erro: document.getElementById("Descricao_Erro").value,
        Cliente_ID: parseInt(document.getElementById("Cliente_ID").value),
        Divida_Ativo: true
    };

    

    try {
        const resposta = await fetch("http://localhost:5067/api/Divida", {
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
            alert("Dívida cadastrada com sucesso!");
            
        } else {
            alert("Erro ao cadastrar dívida.");
        }
    }
    catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível conectar com a API.");
    }
}