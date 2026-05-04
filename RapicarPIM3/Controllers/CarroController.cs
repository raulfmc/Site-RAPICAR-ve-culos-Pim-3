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
        var carros = await _context.Carros.ToListAsync();
        return Ok(carros);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPorId(int id)
    {
        var carros = await _context.Carros.FindAsync(id);
        if (carros == null)
        {
            return NotFound(new {mensagem = "Carros não encontrado"});
        }
        return Ok(carros);
    }
    [HttpPost]
    public async Task<IActionResult> Criar(Carro carros)
    {

        _context.Carros.Add(carros);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPorId", new {id = carros.Carro_ID}, carros);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, Carro Carros)
    {
        var CarroExistente = await _context.Carros.FindAsync(id);
        if (CarroExistente == null)
        {
            return NotFound(new {mensagem = "Carro não encontrado"});
            
        }
        
        CarroExistente.Carro_Placa = Carros.Carro_Placa;
        CarroExistente.Carro_Marca = Carros.Carro_Marca;
        CarroExistente.Carro_Modelo = Carros.Carro_Modelo;
        CarroExistente.Carro_Ano_Fabricação = Carros.Carro_Ano_Fabricação;
        CarroExistente.Carro_Cor = Carros.Carro_Cor;
        CarroExistente.Carro_Número = Carros.Carro_Número;
        CarroExistente.Carro_Versão = Carros.Carro_Versão;
        CarroExistente.Carro_Status = Carros.Carro_Status;
        CarroExistente.Carro_Câmbio = Carros.Carro_Câmbio;
        CarroExistente.Carro_Qtd_Aluguéis = Carros.Carro_Qtd_Aluguéis;
        CarroExistente.Carro_Valor_Diária = Carros.Carro_Valor_Diária;
        


        _context.Carros.Update(CarroExistente);
        await _context.SaveChangesAsync();
        return Ok(CarroExistente);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var Carros = await _context.Carros.FindAsync(id);
        if (Carros == null)
        {
            return NotFound(new {mensagem = "Carro não encontrado"});
            
        }
        _context.Carros.Remove(Carros);
        await _context.SaveChangesAsync();
        return NoContent();
    }

  
}

