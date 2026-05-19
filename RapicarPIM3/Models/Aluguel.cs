using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RapicarPIM3.Models
{
    [Table("Aluguel")]
    public class Aluguel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Aluguel_ID { get; set; }
        public DateTime Aluguel_Data_Inicio {get; set;}
        public DateTime Aluguel_Data_Fim {get; set;}
        public double Aluguel_Valor_Total {get; set;}
        public required bool Aluguel_Ativo { get; set; }

        public int Carro_ID {get; set;}
        public int Cliente_ID { get; set; }

        [ForeignKey("Carro_ID")]
        public Carro? carro { get; set; }
        [ForeignKey("Cliente_ID")]
        public Cliente? cliente { get; set; }









    }

}
