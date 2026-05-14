using Microsoft.AspNetCore.Http;
using System.Runtime.Versioning;
using Microsoft.AspNetCore.Mvc;
using RapicarPIM3.Data;
using RapicarPIM3.Models;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;


[Route("api/[controller]")]
[ApiController]
public class ClienteController : ControllerBase
{
    private readonly AppDbContext _context;
    public ClienteController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTodos()
    {
        var Clientes = await _context.Cliente.ToListAsync();
        return Ok(Clientes);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPorId(int id)
    {
        var Clientes = await _context.Cliente.FindAsync(id);
        if (Clientes == null)
        {
            return NotFound(new {mensagem = "Cliente não encontrado"});
        }
        return Ok(Clientes);
    }
    [HttpPost]
    public async Task<IActionResult> Criar(Cliente Clientes)
    {

        _context.Cliente.Add(Clientes);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPorId", new {id = Clientes.Cliente_ID}, Clientes);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, Cliente Clientes)
    {
        var ClienteExistente = await _context.Cliente.FindAsync(id);
        if (ClienteExistente == null)
        {
            return NotFound(new {mensagem = "Cliente não encontrado"});
            
        }
        
        ClienteExistente.Cliente_Nome = Clientes.Cliente_Nome;
        ClienteExistente.Cliente_RG = Clientes.Cliente_RG;
        ClienteExistente.Cliente_Telefone = Clientes.Cliente_Telefone;
        ClienteExistente.Cliente_Email = Clientes.Cliente_Email;     
        


        _context.Cliente.Update(ClienteExistente);
        await _context.SaveChangesAsync();
        return Ok(ClienteExistente);
    }
    [HttpDelete("{id}")]
    //Fiz "soft delete" porque lidar com deleção em relacionamento de chave estrangeira não compensa
    public async Task<IActionResult> Deletar(int id)
    {
        var cliente = await _context.Cliente.FindAsync(id);
        if (cliente == null)
        {
            return NotFound(new { mensagem = "cliente não encontrado" });

        }
        cliente.Cliente_Ativo = false;
        _context.Cliente.Update(cliente); //isso aqui seria o soft delete

        await _context.SaveChangesAsync();
        return Ok(cliente);
    }

  
}

