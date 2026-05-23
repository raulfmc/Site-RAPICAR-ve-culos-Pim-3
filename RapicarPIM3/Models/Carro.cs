using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RapicarPIM3.Models
{
    public class Carro
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Carro_ID { get; set; } 
        
        public required string Carro_Marca { get; set; }
        public required string Carro_Modelo { get; set; }
        public int Carro_Ano_Fabricação { get; set; }
        
        public int Carro_Número { get; set; }
        public required string Carro_Versão { get; set; }
        public required string Carro_Câmbio { get; set; }
        public required string Carro_Placa { get; set; } 
        public required string Carro_Cor { get; set; }
        public string Carro_Status { get; set; } = "Disponível";
        
        public int Carro_Qtd_Aluguéis { get; set; }
        public required double Carro_Valor_Diária { get; set; }
        public required bool Carro_Ativo { get; set; }







    }

}
