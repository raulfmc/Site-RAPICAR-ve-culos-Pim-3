using RapicarPIM3.Models;
using Microsoft.EntityFrameworkCore;

namespace RapicarPIM3.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Carro> Carro { get; set; }
        public DbSet<Cliente> Cliente { get; set; }
        public DbSet<Divida> Divida { get; set; }
        public DbSet<Manutencao> Manutencao { get; set; }
    }
}
