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
public class ManutencaoController : ControllerBase
{
    private readonly AppDbContext _context;
    public ManutencaoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTodos()
    {
        var Manutencoes = await _context.Manutencao
         .Include(manutencao => manutencao.carro)
         .ToListAsync();
        return Ok(_context.Manutencao
        .Where(c => c.Manutencao_Ativo)
        .ToList());
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPorId(int id)
    {
        var manutencao = await _context.Manutencao.Include(manutencao => manutencao.carro).FirstOrDefaultAsync(manutencao => manutencao.Manutencao_ID == id);
        if (manutencao == null)
        {
            return NotFound(new { mensagem = "Dívida não encontrada" });
        }
        if (manutencao.Manutencao_Ativo == true)
        {
            return Ok(_context.Manutencao
        .Where(c => c.Manutencao_Ativo)
        .ToList());
        }
        return NotFound(new { mensagem = "Manutenção não encontrada/inativa" });
    }
    [HttpPost]
    public async Task<IActionResult> Criar(Manutencao manutencao)
    {
        var carro = _context.Carro.Find(manutencao.Carro_ID);
        if (carro == null)
        {
            return NotFound(new { mensagem = "Carro não encontrado." });
        }

        manutencao.carro = carro;

        _context.Manutencao.Add(manutencao);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPorId", new { id = manutencao.Manutencao_ID }, manutencao);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, Manutencao manutencao)
    {
        var ManutencaoExistente = await _context.Manutencao.FindAsync(id);
        if (ManutencaoExistente == null)
        {
            return NotFound(new { mensagem = "Manutencao não encontrado" });

        }

        ManutencaoExistente.Descricao_Problema = manutencao.Descricao_Problema;
        ManutencaoExistente.Data_Prevista_Conclusao = manutencao.Data_Prevista_Conclusao;


        _context.Manutencao.Update(ManutencaoExistente);
        await _context.SaveChangesAsync();
        return Ok(ManutencaoExistente);
    }
    [HttpDelete("{id}")]
    //Fiz "soft delete" porque lidar com deleção em relacionamento de chave estrangeira não compensa
    public async Task<IActionResult> Deletar(int id)
    {
        var manutencao = await _context.Manutencao.FindAsync(id);
        if (manutencao == null)
        {
            return NotFound(new { mensagem = "Manutenção não encontrada" });

        }
        manutencao.Manutencao_Ativo = false;
        _context.Manutencao.Update(manutencao); //isso aqui seria o soft delete

        await _context.SaveChangesAsync();
        return Ok(manutencao);
    }


}

