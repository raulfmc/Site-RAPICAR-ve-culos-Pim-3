using System.ComponentModel.DataAnnotations;

namespace RapicarPIM3.Models
{
    public class Cliente
    {
        public int Cliente_ID { get; set; }
        public required string Cliente_Nome {get; set;}
        public required string Cliente_RG {get;set;}
        public required string Cliente_Telefone{get; set;}
        public required string Cliente_Email {get; set;}
        





    }

}
