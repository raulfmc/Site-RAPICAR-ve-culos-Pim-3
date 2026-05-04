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
        var Clientes = await _context.Clientes.ToListAsync();
        return Ok(Clientes);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPorId(int id)
    {
        var Clientes = await _context.Clientes.FindAsync(id);
        if (Clientes == null)
        {
            return NotFound(new {mensagem = "Clientes não encontrado"});
        }
        return Ok(Clientes);
    }
    [HttpPost]
    public async Task<IActionResult> Criar(Cliente Clientes)
    {

        _context.Clientes.Add(Clientes);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPorId", new {id = Clientes.Cliente_ID}, Clientes);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, Cliente Clientes)
    {
        var ClienteExistente = await _context.Clientes.FindAsync(id);
        if (ClienteExistente == null)
        {
            return NotFound(new {mensagem = "Cliente não encontrado"});
            
        }
        
        ClienteExistente.Cliente_Nome = Clientes.Cliente_Nome;
        ClienteExistente.Cliente_RG = Clientes.Cliente_RG;
        ClienteExistente.Cliente_Telefone = Clientes.Cliente_Telefone;
        ClienteExistente.Cliente_Email = Clientes.Cliente_Email;     
        


        _context.Clientes.Update(ClienteExistente);
        await _context.SaveChangesAsync();
        return Ok(ClienteExistente);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var Clientes = await _context.Clientes.FindAsync(id);
        if (Clientes == null)
        {
            return NotFound(new {mensagem = "Cliente não encontrado"});
            
        }
        _context.Clientes.Remove(Clientes);
        await _context.SaveChangesAsync();
        return NoContent();
    }

  
}

