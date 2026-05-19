async function criarAluguel() {

    const inicio = document.getElementById("Aluguel_Data_Inicio").value;
    const fim = document.getElementById("Aluguel_Data_Fim").value;

    if (!clienteSelecionado || !carroSelecionado || !inicio || !fim) {
        alert("Selecione cliente, carro e datas.");
        return;
    }

    const diaria = Number(carroSelecionado.carro_Valor_Diária || 0);

    const dias = Math.max(1,
        (new Date(fim) - new Date(inicio)) / (1000 * 60 * 60 * 24)
    );

    const dados = {
        Aluguel_Data_Inicio: inicio,
        Aluguel_Data_Fim: fim,
        Aluguel_Valor_Total: dias * diaria,
        Cliente_ID: clienteSelecionado.cliente_ID,
        Carro_ID: carroSelecionado.carro_ID,
        Aluguel_Ativo: true
    };

    try {
        const resposta = await fetch("http://localhost:5067/api/Aluguel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const texto = await resposta.text();

        console.log(resposta.status, texto);

        if (resposta.ok) {
            alert("Aluguel criado!");
        } else {
            alert("Erro ao criar aluguel");
        }

    } catch (erro) {
        console.error(erro);
    }
}