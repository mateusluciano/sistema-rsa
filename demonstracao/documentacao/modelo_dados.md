# Modelo de Dados do Sistema

## Entidades Principais

### 1. Caçamba
- **id**: Número sequencial de 3 dígitos (001, 002, etc.)
- **status**: Disponível, Em Uso, Em Manutenção
- **localizacao_atual**: Endereço, Pátio ou nome da destinadora
- **data_ultima_movimentacao**: Data e hora da última movimentação
- **observacoes**: Informações adicionais

### 2. Cliente
- **tipo**: PF ou PJ
- **documento**: CPF ou CNPJ
- **nome_completo/razao_social**: Nome do cliente ou empresa
- **telefone/email**: Dados de contato
- **endereco_completo**: Endereço principal
- **referencia**: Ponto de referência para localização
- **metodo_pagamento**: Dinheiro, Cartão, PIX, Boleto, etc.
- **Campos adicionais para PJ**:
  - **contato_nome/telefone/email**: Pessoa de contato na empresa
  - **endereco_entrega**: Quando diferente do endereço principal

### 3. Locação
- **id**: Identificador único
- **cliente_id**: Referência ao cliente
- **cacamba_id**: Referência à caçamba
- **data_inicio**: Data de início da locação
- **data_fim_prevista**: Calculada automaticamente (4 dias úteis para PF, 7 dias para PJ)
- **data_fim_real**: Data efetiva de retirada
- **endereco_entrega**: Local de entrega da caçamba
- **status**: Agendada, Em Andamento, Finalizada, Cancelada
- **valor**: Valor da locação
- **tipo_residuo**: Classe A, Madeira, Misto, etc.
- **taxa_adicional**: Para resíduos misturados em PF
- **dias_extras**: Para PJ, após os 7 dias iniciais
- **valor_dia_extra**: Valor por dia extra para PJ
- **conta_azul_venda_id**: ID da venda no Conta Azul

### 4. Movimentação
- **id**: Identificador único
- **cacamba_id**: Referência à caçamba
- **locacao_id**: Referência à locação (opcional)
- **tipo**: Colocação, Retirada, Troca, Movimentação Interna
- **data_hora**: Data e hora da movimentação
- **origem**: Local de origem
- **destino**: Local de destino
- **motorista**: Responsável pela movimentação
- **destinadora_id**: Referência à destinadora (quando aplicável)

### 5. Destinadora
- **id**: Identificador único
- **nome**: Essencis, Repet, Citrolandia, Limpagem, PTB
- **tipos_residuos_aceitos**: Tipos de resíduos que a destinadora aceita
- **endereco**: Localização da destinadora
- **contato**: Informações de contato
- **certificados**: Documentos ambientais

### 6. Usuário
- **id**: Identificador único
- **nome**: Nome completo
- **email**: Email para login
- **senha**: Senha criptografada
- **tipo**: Administrador, Gerente, Operacional
- **ativo**: Status do usuário

## Regras de Negócio Implementadas

1. **Prazo de Locação**:
   - PF: 4 dias úteis (sem contar domingo, retirada na segunda se terminar no sábado)
   - PJ: 7 dias corridos + dias extras conforme orçamento

2. **Tipos de Resíduos e Destinadoras**:
   - Classe A: PTB, Citrolândia e Limpagem
   - Madeira: Repet
   - Demais resíduos: Essencis

3. **Taxas Adicionais**:
   - PF: Taxa para resíduos misturados
   - PJ: Valor por dia extra conforme orçamento

4. **Rastreamento de Caçambas**:
   - Cada movimentação registra origem, destino e responsável
   - Status da caçamba atualizado automaticamente

5. **Integração com Conta Azul**:
   - PF: Geração automática de venda e emissão fiscal
   - PJ: Botão para solicitar geração de venda
