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
        var Dividas = await _context.Divida
        .Include(divida => divida.cliente)
        .ToListAsync();
        return Ok(_context.Divida
        .Where(c => c.Divida_Ativo)
        .ToList());
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPorId(int id)
    {
        var divida = await _context.Divida.Include(d => d.cliente).FirstOrDefaultAsync(divida => divida.Divida_ID == id);
        if (divida == null)
        {
            return NotFound(new { mensagem = "Dívida não encontrada" });
        }
        if (divida.Divida_Ativo == true)
        {
            return Ok(_context.Divida
        .Where(c => c.Divida_Ativo)
        .ToList());
        }
        return NotFound(new { mensagem = "Divida não encontrada/inativa" });
    }
    [HttpPost]
    public async Task<IActionResult> Criar(Divida divida)
    {
        var cliente = _context.Cliente.Find(divida.Cliente_ID);
        if (cliente == null)
        {
            return NotFound(new { mensagem = "Cliente não encontrado." });
        }

        divida.cliente = cliente;

        _context.Divida.Add(divida);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPorId", new { id = divida.Divida_ID }, divida);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, Divida Dividas)
    {
        var DividaExistente = await _context.Divida.FindAsync(id);
        if (DividaExistente == null)
        {
            return NotFound(new { mensagem = "Divida não encontrada" });

        }

        DividaExistente.Tipo_Erro = Dividas.Tipo_Erro;
        if (DividaExistente.Valor_Divida != null)
        {
            DividaExistente.Valor_Divida = Dividas.Valor_Divida;
        }
        DividaExistente.Descrição_Erro = Dividas.Descrição_Erro;

        _context.Divida.Update(DividaExistente);
        await _context.SaveChangesAsync();
        return Ok(DividaExistente);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var divida = await _context.Divida.FindAsync(id);
        if (divida == null)
        {
            return NotFound(new { mensagem = "Divida não encontrado" });

        }
        divida.Divida_Ativo = false;
        _context.Divida.Update(divida);

        await _context.SaveChangesAsync();
        return Ok(divida);
    }
    


}

