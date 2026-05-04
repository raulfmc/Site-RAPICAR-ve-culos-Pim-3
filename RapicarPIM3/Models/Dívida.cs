using System.ComponentModel.DataAnnotations.Schema;
namespace RapicarPIM3.Models
{
    public class Divida
    {
        public required int Divida_ID {get; set;}
        public required string Tipo_Erro { get; set; }
        public float? Valor_Divida { get; set; }
        public required string Descrição_Erro { get; set; }
        [ForeignKey("Cliente_ID")]
        public required Cliente cliente {get;set;}





    }

}
