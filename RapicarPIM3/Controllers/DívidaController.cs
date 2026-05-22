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
        .Include(d => d.cliente)
        .Where(d => d.Divida_Ativo)
        .ToListAsync();
        
        return Ok(Dividas);
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
            return Ok(divida);
        }
        return NotFound(new { mensagem = "Dívida não encontrada/inativa" });
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
        divida.Data_Criacao = DateTime.Now;
        Console.WriteLine(divida.Data_Criacao);
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
            return NotFound(new { mensagem = "Dívida não encontrada" });

        }

        DividaExistente.Tipo_Erro = Dividas.Tipo_Erro;
        DividaExistente.Valor_Divida = Dividas.Valor_Divida;
       
        DividaExistente.Cliente_ID = Dividas.Cliente_ID;
        

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
            return NotFound(new { mensagem = "Dívida não encontrada" });

        }
        divida.Divida_Ativo = false;
        _context.Divida.Update(divida);

        await _context.SaveChangesAsync();
        return Ok(divida);
    }
    


}

