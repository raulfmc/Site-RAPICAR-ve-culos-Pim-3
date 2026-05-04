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
        var Manutencoes = await _context.Manutencoes.ToListAsync();
        return Ok(Manutencoes);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPorId(int id)
    {
        var Manutencoes = await _context.Manutencoes.FindAsync(id);
        if (Manutencoes == null)
        {
            return NotFound(new {mensagem = "Manutenção não encontrada"});
        }
        return Ok(Manutencoes);
    }
    [HttpPost]
    public async Task<IActionResult> Criar(Manutencao Manutencaos)
    {

        _context.Manutencoes.Add(Manutencaos);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPorId", new {id = Manutencaos.Manutencao_ID}, Manutencaos);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, Manutencao Manutencaos)
    {
        var ManutencaoExistente = await _context.Manutencoes.FindAsync(id);
        if (ManutencaoExistente == null)
        {
            return NotFound(new {mensagem = "Manutencao não encontrado"});
            
        }
        
        ManutencaoExistente.Descricao_Problema = Manutencaos.Descricao_Problema;
        ManutencaoExistente.Data_Prevista_Conclusao = Manutencaos.Data_Prevista_Conclusao;
            
        


        _context.Manutencoes.Update(ManutencaoExistente);
        await _context.SaveChangesAsync();
        return Ok(ManutencaoExistente);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var Manutencoes = await _context.Manutencoes.FindAsync(id);
        if (Manutencoes == null)
        {
            return NotFound(new {mensagem = "Manutencao não encontrado"});
            
        }
        _context.Manutencoes.Remove(Manutencoes);
        await _context.SaveChangesAsync();
        return NoContent();
    }

  
}

