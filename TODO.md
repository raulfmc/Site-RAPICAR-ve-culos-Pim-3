# TODO

## Dashboard Financeira (Dashboard Lucro/Aluguel)
- [x] Levantar estado atual da dashboard (`dashboardLucro.*`) e como os dados financeiros são salvos (`rapicar_pendencias_v1` via `pim3.js`).
- [x] Reconstruir `interface PIM 3/dashboardLucro.html` com layout mais simples e compacto, garantindo:
  - [x] Filtros no topo (pesquisa + modelo + placa + categoria + botão limpar)
  - [x] Layout em linhas horizontais (evitar página longa vertical)
  - [x] Gráficos menores lado a lado (diário/mensal/anual)


- [x] Implementar/ajustar `interface PIM 3/dashboardLucro.css` para visual acadêmico:
  - [x] remover excessos de sombras/effects
  - [x] reduzir padding, border-radius e alturas
  - [x] melhorar aproveitamento horizontal (grid mais compacto)

- [x] Ajustar `interface PIM 3/dashboardLucro.js` apenas o necessário para:
  - [x] sincronizar novos filtros (modelo/placa/categoria) com o input/select já existente
  - [x] implementar botão “Limpar”
  - [x] manter todos os cálculos/gráficos existentes
- [ ] Validar manualmente:
  - [ ] abrir `dashboardLucro.html` com base em `pim3.html`
  - [ ] conferir funcionamento dos filtros e ausência de erros no console





