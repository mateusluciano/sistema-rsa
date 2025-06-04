# APIs e Integrações do Sistema

## Integração com Conta Azul

### Funcionalidades Implementadas

1. **Autenticação OAuth2**
   - Configuração de credenciais (client_id e client_secret)
   - Fluxo de autorização seguro
   - Renovação automática de tokens

2. **Sincronização de Clientes**
   - Envio automático de novos clientes para o Conta Azul
   - Atualização de dados cadastrais quando modificados
   - Vinculação de IDs entre os sistemas

3. **Geração de Vendas**
   - **Para Pessoa Física (PF)**:
     - Geração automática de venda no momento da confirmação
     - Inclusão de serviços conforme tipo de resíduo
     - Emissão de link de pagamento
     - Atualização de status após confirmação de pagamento

   - **Para Pessoa Jurídica (PJ)**:
     - Botão para solicitar geração de venda após aprovação de orçamento
     - Inclusão de dias extras no cálculo final
     - Registro de custos de destinação quando aplicável

4. **Emissão Fiscal**
   - Geração automática de documentos fiscais
   - Conformidade com requisitos legais

## APIs Internas do Sistema

### API de Caçambas

```
GET /api/cacambas - Lista todas as caçambas
GET /api/cacambas/:id - Obtém detalhes de uma caçamba específica
POST /api/cacambas - Cadastra nova caçamba
PUT /api/cacambas/:id - Atualiza dados de uma caçamba
DELETE /api/cacambas/:id - Remove uma caçamba (desativação lógica)
```

### API de Clientes

```
GET /api/clientes - Lista todos os clientes
GET /api/clientes/:id - Obtém detalhes de um cliente específico
POST /api/clientes - Cadastra novo cliente
PUT /api/clientes/:id - Atualiza dados de um cliente
DELETE /api/clientes/:id - Remove um cliente (desativação lógica)
```

### API de Locações

```
GET /api/locacoes - Lista todas as locações
GET /api/locacoes/:id - Obtém detalhes de uma locação específica
POST /api/locacoes - Cadastra nova locação
PUT /api/locacoes/:id - Atualiza dados de uma locação
DELETE /api/locacoes/:id - Cancela uma locação
```

### API de Movimentações

```
GET /api/movimentacoes - Lista todas as movimentações
GET /api/movimentacoes/:id - Obtém detalhes de uma movimentação específica
POST /api/movimentacoes - Registra nova movimentação
GET /api/movimentacoes/cacamba/:id - Lista movimentações de uma caçamba
```

### API de Destinadoras

```
GET /api/destinadoras - Lista todas as destinadoras
GET /api/destinadoras/:id - Obtém detalhes de uma destinadora específica
POST /api/destinadoras - Cadastra nova destinadora
PUT /api/destinadoras/:id - Atualiza dados de uma destinadora
```

## Integrações Futuras

1. **API de Geolocalização**
   - Integração com Google Maps ou similar
   - Rastreamento em tempo real de caçambas
   - Otimização de rotas para entregas e retiradas

2. **API de Notificações**
   - Integração com WhatsApp Business API
   - Envio automático de notificações para clientes
   - Confirmações de agendamento e lembretes de prazo

3. **API de Pagamentos**
   - Integração com gateways de pagamento
   - Pagamento online para clientes PF
   - Acompanhamento de status de pagamento
