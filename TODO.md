# TODO - Ajustes do Status do Cliente

- [ ] Atualizar `interface PIM 3/tabelaCliente.html` e `interface PIM 3/tabelaCliente.js`:

  - [ ] Remover marcadores de merge (`<<<<<<<`, `=======`, `>>>>>>>`).
  - [ ] Criar coluna “Status” como **indicador** (sem botão “toggle”).
  - [ ] Adicionar botão/ação “Status” apenas para abrir `statusCliente.html`.
- [ ] Atualizar `interface PIM 3/statusCliente.html` e `interface PIM 3/statusCliente.js`:
  - [ ] Garantir que a página só seja navegada/aberta via clique do botão na tabela.
  - [ ] Implementar indicador automático: `Em dia/Devendo` muda quando o `ultimoDia` ultrapassar.
  - [ ] Remover/ignorar alternância manual do status (botões).
- [ ] Testar fluxo:
  - [ ] Abrir `tabelaCliente.html`.
  - [ ] Clicar “Status” de um cliente.
  - [ ] Ver `statusCliente.html` com status calculado automaticamente.

