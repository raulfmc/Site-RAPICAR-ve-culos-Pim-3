using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RapicarPIM3.Models
{
    public class Divida
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Divida_ID { get; set; }
        public required string Tipo_Erro { get; set; }
        public double? Valor_Divida { get; set; }
        public required string Descrição_Erro { get; set; }
        public required bool Divida_Ativo { get; set; }
        public int Cliente_ID { get; set; }
        [ForeignKey("Cliente_ID")]
        public required Cliente cliente { get; set; }





    }

}
