using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RapicarPIM3.Models
{
    [Table("Cliente")]
    public class Cliente
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Cliente_ID { get; set; }
        public required string Cliente_Nome {get; set;}
        public required string Cliente_RG {get;set;}
        public required string Cliente_Telefone{get; set;}
        public required string Cliente_Email {get; set;}

        public required bool Cliente_Ativo { get; set; }

        
        





    }

}
