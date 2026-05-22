async function criarManutencao() {
    const dados = {
        Descricao_Problema: document.getElementById("Descricao_Problema").value,
        Data_Prevista_Conclusao: new Date(document.getElementById("Data_Prevista_Conclusao").value),
        Carro_ID: parseInt(document.getElementById("Carro_ID").value),
        Manutencao_Ativo: true
    };

    

    try {
        const resposta = await fetch("http://localhost:5067/api/Manutencao", {
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
            alert("Manutenção cadastrada com sucesso!");
            
        } else {
            alert("Erro ao cadastrar manutenção.");
        }
    }
    catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível conectar com a API.");
    }
}