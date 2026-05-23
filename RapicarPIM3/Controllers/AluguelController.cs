using Microsoft.AspNetCore.Http;
using System.Runtime.Versioning;
using Microsoft.AspNetCore.Mvc;
using RapicarPIM3.Data;
using RapicarPIM3.Models;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using System.Globalization;


[Route("api/[controller]")]
[ApiController]
public class AluguelController : ControllerBase
{
    private readonly AppDbContext _context;
    public AluguelController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTodos()
    {
        var Alugueis = await _context.Aluguel
        .Include(Aluguel => Aluguel.cliente)
        .Include(Aluguel => Aluguel.carro)
        .ToListAsync();
        return Ok(Alugueis);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPorId(int id)
    {
        var Aluguel = await _context.Aluguel
        .Include(Aluguel => Aluguel.cliente)
        .Include(Aluguel => Aluguel.carro)
        .FirstOrDefaultAsync(Aluguel => Aluguel.Aluguel_ID == id);
        if (Aluguel == null)
        {
            return NotFound(new { mensagem = "Aluguel não encontrado" });
        }
        if (Aluguel.Aluguel_Ativo == true)
        {
            return Ok(Aluguel);
        }
        return NotFound(new { mensagem = "Aluguel não encontrado" });
    }
    [HttpPost]
    public async Task<IActionResult> Criar(Aluguel Aluguel)
    {
        var cliente = _context.Cliente.Find(Aluguel.Cliente_ID);
        var carro = _context.Carro.Find(Aluguel.Carro_ID);
        if (cliente == null)
        {
            return NotFound(new { mensagem = "Cliente não encontrado." });
        }
        if (carro == null)
        {
            return NotFound(new { mensagem = "Carro não encontrado." });
        }
        

        Aluguel.cliente = cliente;
        Aluguel.carro = carro;
        
        _context.Aluguel.Add(Aluguel);

        carro.Carro_Qtd_Aluguéis =
        _context.Aluguel.Count(a => a.Carro_ID == carro.Carro_ID);

        await _context.SaveChangesAsync();
        return CreatedAtAction("GetPorId", new { id = Aluguel.Aluguel_ID }, Aluguel);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, Aluguel Alugueis)
    {

        var AluguelExistente = await _context.Aluguel.FindAsync(id);
        if (AluguelExistente == null)
        {
            return NotFound(new { mensagem = "Aluguel não encontrado" });

        }


        AluguelExistente.Aluguel_Data_Inicio = Alugueis.Aluguel_Data_Inicio;
        AluguelExistente.Aluguel_Data_Fim = Alugueis.Aluguel_Data_Fim;
        AluguelExistente.Cliente_ID = Alugueis.Cliente_ID;
        AluguelExistente.Carro_ID = Alugueis.Carro_ID;
        AluguelExistente.Aluguel_Valor_Total = Alugueis.Aluguel_Valor_Total;

        _context.Aluguel.Update(AluguelExistente);
        await _context.SaveChangesAsync();
        return Ok(AluguelExistente);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var Aluguel = await _context.Aluguel.FindAsync(id);
       
        if (Aluguel == null)
        {
            return NotFound(new { mensagem = "Aluguel não encontrado" });

        }
        Aluguel.Aluguel_Ativo = false;
        _context.Aluguel.Update(Aluguel);

        await _context.SaveChangesAsync();
        return Ok(Aluguel);
    }
    


}

