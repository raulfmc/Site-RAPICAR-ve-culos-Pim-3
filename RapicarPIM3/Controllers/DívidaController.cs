//TODO: Adicionar relacionamento de chave estrangeira
using Microsoft.AspNetCore.Http;
using System.Runtime.Versioning;
using Microsoft.AspNetCore.Mvc;
using RapicarPIM3.Data;
using RapicarPIM3.Models;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;


[Route("api/[controller]")]
[ApiController]
public class DividaController : ControllerBase
{
    private readonly AppDbContext _context;
    public DividaController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTodos()
    {
        var Dividas = await _context.Dividas.ToListAsync();
        return Ok(Dividas);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPorId(int id)
    {
        var Dividas = await _context.Dividas.FindAsync(id);
        if (Dividas == null)
        {
            return NotFound(new {mensagem = "Dívida não encontrada"});
        }
        return Ok(Dividas);
    }
    [HttpPost]
    public async Task<IActionResult> Criar(Divida Dividas)
    {

        _context.Dividas.Add(Dividas);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPorId", new {id = Dividas.Divida_ID}, Dividas);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, Divida Dividas)
    {
        var DividaExistente = await _context.Dividas.FindAsync(id);
        if (DividaExistente == null)
        {
            return NotFound(new {mensagem = "Divida não encontrado"});
            
        }
        
        DividaExistente.Tipo_Erro = Dividas.Tipo_Erro;
        if (DividaExistente.Valor_Divida != null)
        {
            DividaExistente.Valor_Divida = Dividas.Valor_Divida;
        }
        DividaExistente.Descrição_Erro = Dividas.Descrição_Erro;
    
        


        _context.Dividas.Update(DividaExistente);
        await _context.SaveChangesAsync();
        return Ok(DividaExistente);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var Dividas = await _context.Dividas.FindAsync(id);
        if (Dividas == null)
        {
            return NotFound(new {mensagem = "Divida não encontrado"});
            
        }
        _context.Dividas.Remove(Dividas);
        await _context.SaveChangesAsync();
        return NoContent();
    }

  
}

