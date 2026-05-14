using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RapicarPIM3.Models
{
    public class Manutencao
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Manutencao_ID { get; set; }
        public required string Descricao_Problema { get; set; }
        public DateTime Data_Prevista_Conclusao { get; set; }

        
        public int Carro_ID { get; set; }
        [ForeignKey("Carro_ID")]
        public required Carro carro { get; set; }

        public required bool Manutencao_Ativo { get; set; }




    }

}
