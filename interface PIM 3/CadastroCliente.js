async function criarCliente() {
    const dados = {
        Cliente_Nome: document.getElementById("Cliente_Nome").value,
        Cliente_CPF: document.getElementById("Cliente_CPF").value,
        Cliente_Telefone: document.getElementById("Cliente_Telefone").value,
        Cliente_Email: document.getElementById("Cliente_Email").value,
        Cliente_Endereco: document.getElementById("Cliente_Email").value,
        Cliente_Ativo: true
    };



    try {
        const resposta = await fetch("http://localhost:5067/api/Cliente", {
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
            alert("Cliente cadastrado com sucesso!");

        } else {
            alert("Erro ao cadastrar cliente.");
        }
    }
    catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível conectar com a API.");
    }
    console.log(document.getElementById("Cliente_Nome"));
    console.log(document.getElementById("Cliente_CPF"));
    console.log(document.getElementById("Cliente_Telefone"));
    console.log(document.getElementById("Cliente_Email"));
}