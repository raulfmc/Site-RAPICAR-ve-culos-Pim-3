using RapicarPIM3.Models;
using Microsoft.EntityFrameworkCore;

namespace RapicarPIM3.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Carro> Carros { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Divida> Dividas { get; set; }
        public DbSet<Manutencao> Manutencoes { get; set; }
    }
}
