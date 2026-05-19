using Microsoft.AspNetCore.Http;
using System.Runtime.Versioning;
using Microsoft.AspNetCore.Mvc;
using RapicarPIM3.Data;
using RapicarPIM3.Models;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;


[Route("api/[controller]")]
[ApiController]
public class CarroController : ControllerBase
{
    private readonly AppDbContext _context;
    public CarroController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTodos()
    {
        var carros = await _context.Carro.ToListAsync();
        return Ok(carros);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPorId(int id)
    {
        var carros = await _context.Carro.FindAsync(id);
        if (carros == null)
        {
            return NotFound(new {mensagem = "Carros não encontrado"});
        }
        return Ok(carros);
    }
    [HttpPost]
    public async Task<IActionResult> Criar(Carro carros)
    {

        _context.Carro.Add(carros);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPorId", new {id = carros.Carro_ID}, carros);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, Carro Carro)
    {
        var CarroExistente = await _context.Carro.FindAsync(id);
        if (CarroExistente == null)
        {
            return NotFound(new {mensagem = "Carro não encontrado"});
            
        }
        
        CarroExistente.Carro_Placa = Carro.Carro_Placa;
        CarroExistente.Carro_Marca = Carro.Carro_Marca;
        CarroExistente.Carro_Modelo = Carro.Carro_Modelo;
        CarroExistente.Carro_Ano_Fabricação = Carro.Carro_Ano_Fabricação;
        CarroExistente.Carro_Cor = Carro.Carro_Cor;
        CarroExistente.Carro_Número = Carro.Carro_Número;
        CarroExistente.Carro_Versão = Carro.Carro_Versão;
    
        CarroExistente.Carro_Câmbio = Carro.Carro_Câmbio;
        CarroExistente.Carro_Qtd_Aluguéis = Carro.Carro_Qtd_Aluguéis;
        CarroExistente.Carro_Valor_Diária = Carro.Carro_Valor_Diária;
        


        _context.Carro.Update(CarroExistente);
        await _context.SaveChangesAsync();
        return Ok(CarroExistente);
    }
    [HttpDelete("{id}")]
    //Fiz "soft delete" porque lidar com deleção em relacionamento de chave estrangeira não compensa
    public async Task<IActionResult> Deletar(int id)
    {
        var carro = await _context.Carro.FindAsync(id);
        if (carro == null)
        {
            return NotFound(new { mensagem = "Carro não encontrado" });

        }
        carro.Carro_Ativo = false;
        _context.Carro.Update(carro); //isso aqui seria o soft delete

        await _context.SaveChangesAsync();
        return Ok(carro);
    }
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> AtualizarStatus(int id, [FromBody] bool novo_status)
    {
       var carro = await _context.Carro.FindAsync(id);
       if (carro == null)
       {
            return NotFound(new {mensagem = "Carro não encontrado"});
       }
       carro.Carro_Status = novo_status;
       _context.Carro.Update(carro);
       await _context.SaveChangesAsync();
       return Ok(carro);
    }
  
}

