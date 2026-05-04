using System.ComponentModel.DataAnnotations;

namespace RapicarPIM3.Models
{
    public class Carro
    {
        public int Carro_ID { get; set; } 
        public int Carro_Placa { get; set; } 
        public required string Carro_Marca { get; set; }
        public required string Carro_Modelo { get; set; }
        public required string Carro_Ano_Fabricação { get; set; }
        public required string Carro_Cor { get; set; }
        public int Carro_Número { get; set; }
        public required string Carro_Versão { get; set; }
        public required string Carro_Status { get; set; }
        public required string Carro_Câmbio { get; set; }
        public required string Carro_Qtd_Aluguéis { get; set; }
        public float Carro_Valor_Diária { get; set; }







    }

}
