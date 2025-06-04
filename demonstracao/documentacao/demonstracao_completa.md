# Demonstração do Sistema de Gestão de Caçambas

## Introdução

O Sistema de Gestão de Caçambas foi desenvolvido para atender às necessidades específicas da empresa de locação de caçambas e destinação de resíduos, com foco no rastreamento eficiente das caçambas e na otimização do controle operacional.

Esta demonstração apresenta as funcionalidades implementadas, destacando como o sistema resolve os desafios atuais de gestão e se integra com o Conta Azul para a parte financeira e fiscal.

## Telas do Sistema

### 1. Dashboard Operacional

O dashboard oferece uma visão consolidada das operações diárias, permitindo monitoramento em tempo real das caçambas disponíveis, em uso, entregas e retiradas agendadas.

![Dashboard](/home/ubuntu/sistema-gestao-cacambas/demonstracao/screenshots/dashboard.png)

**Principais funcionalidades:**
- Contadores de caçambas disponíveis e em uso
- Entregas e retiradas agendadas para o dia
- Controle diário digital (versão digital da planilha atual)
- Alertas de prazos vencendo, com código de cores para priorização

### 2. Gestão de Caçambas

Sistema completo de rastreamento que permite identificar e monitorar cada caçamba individualmente.

![Gestão de Caçambas](/home/ubuntu/sistema-gestao-cacambas/demonstracao/screenshots/cacambas.png)

**Principais funcionalidades:**
- Identificação única de cada caçamba (numeração sequencial de 3 dígitos)
- Visualização clara da localização atual de cada caçamba
- Histórico completo de movimentações
- Status operacional atualizado em tempo real (Disponível, Em Uso, Em Manutenção)

### 3. Cadastro de Clientes

Cadastro completo de clientes com diferenciação entre Pessoa Física (PF) e Pessoa Jurídica (PJ).

![Cadastro de Clientes](/home/ubuntu/sistema-gestao-cacambas/demonstracao/screenshots/clientes.png)

**Principais funcionalidades:**
- Diferenciação entre Pessoa Física (PF) e Pessoa Jurídica (PJ)
- Busca automática de dados via CPF/CNPJ
- Histórico de locações por cliente
- Gestão de informações de contato e endereços

### 4. Gestão de Locações

Gerenciamento de locações com regras específicas para PF e PJ.

![Gestão de Locações](/home/ubuntu/sistema-gestao-cacambas/demonstracao/screenshots/locacoes.png)

**Principais funcionalidades:**
- Para PF: 4 dias úteis (sem contar domingo, retirada na segunda se terminar no sábado)
- Para PJ: 7 dias corridos + dias extras conforme orçamento
- Cálculo automático de datas previstas para retirada
- Monitoramento de prazos e alertas de vencimento

### 5. Registro de Movimentações

Controle detalhado de todas as movimentações de caçambas.

![Registro de Movimentações](/home/ubuntu/sistema-gestao-cacambas/demonstracao/screenshots/movimentacoes.png)

**Principais funcionalidades:**
- Colocação de caçambas em clientes
- Retirada de caçambas
- Operações de troca (com registro da retirada e colocação)
- Destinação para locais específicos conforme tipo de resíduo

### 6. Gestão de Destinadoras

Cadastro e controle de destinadoras de resíduos.

![Gestão de Destinadoras](/home/ubuntu/sistema-gestao-cacambas/demonstracao/screenshots/destinadoras.png)

**Principais funcionalidades:**
- Registro de destinadoras (Essencis, Repet, Citrolandia, Limpagem, PTB)
- Tipos de resíduos aceitos por cada destinadora
- Certificados ambientais anexados
- Histórico de destinações

### 7. Relatórios Gerenciais

Relatórios completos para tomada de decisão.

![Relatórios Gerenciais](/home/ubuntu/sistema-gestao-cacambas/demonstracao/screenshots/relatorios.png)

**Principais funcionalidades:**
- Disponibilidade de caçambas
- Histórico por cliente
- Faturamento por caçamba
- Tempo médio de uso
- Volume por tipo de resíduo

### 8. Configurações do Sistema

Personalização completa do sistema.

![Configurações do Sistema](/home/ubuntu/sistema-gestao-cacambas/demonstracao/screenshots/configuracoes.png)

**Principais funcionalidades:**
- Gestão de usuários com diferentes níveis de acesso
- Configuração de prazos padrão
- Notificações automáticas
- Parâmetros operacionais

### 9. Integração com Conta Azul

Integração completa para gestão financeira e fiscal.

![Integração com Conta Azul](/home/ubuntu/sistema-gestao-cacambas/demonstracao/screenshots/integracao_contaazul.png)

**Principais funcionalidades:**
- Geração automática de venda e emissão fiscal para PF
- Botão para solicitar geração de venda para PJ
- Sincronização de clientes entre os sistemas
- Visualização de status de vendas e pagamentos

## Modelo de Dados

### Entidades Principais

1. **Caçamba**
   - ID sequencial de 3 dígitos (001, 002, etc.)
   - Status (Disponível, Em Uso, Em Manutenção)
   - Localização atual
   - Data da última movimentação

2. **Cliente**
   - Tipo (PF ou PJ)
   - Documento (CPF ou CNPJ)
   - Dados de contato e endereço
   - Método de pagamento

3. **Locação**
   - Vínculo com cliente e caçamba
   - Datas de início e fim previsto/real
   - Regras específicas para PF (4 dias) e PJ (7 dias + extras)
   - Tipo de resíduo e valores

4. **Movimentação**
   - Tipo (Colocação, Retirada, Troca, Movimentação Interna)
   - Origem e destino
   - Motorista responsável
   - Destinadora (quando aplicável)

5. **Destinadora**
   - Nome (Essencis, Repet, Citrolandia, Limpagem, PTB)
   - Tipos de resíduos aceitos
   - Certificados ambientais

6. **Usuário**
   - Níveis de acesso (Administrador, Gerente, Operacional)
   - Dados de autenticação

## APIs e Integrações

### Integração com Conta Azul

- Autenticação OAuth2
- Sincronização de clientes
- Geração automática de vendas para PF
- Botão para geração de vendas para PJ
- Emissão fiscal

### APIs Internas

- API de Caçambas (CRUD completo)
- API de Clientes (CRUD completo)
- API de Locações (CRUD completo)
- API de Movimentações (registro e consulta)
- API de Destinadoras (CRUD completo)

## Benefícios do Sistema

- **Rastreabilidade completa**: Saiba exatamente onde está cada caçamba a qualquer momento
- **Controle operacional eficiente**: Automatização de processos manuais e redução de erros
- **Gestão de prazos**: Monitoramento automático de prazos para PF e PJ
- **Integração financeira**: Conexão direta com o Conta Azul para faturamento
- **Relatórios gerenciais**: Dados para tomada de decisão estratégica
- **Conformidade ambiental**: Gestão adequada de destinação de resíduos

## Próximas Evoluções

O sistema foi projetado para evoluir em fases, com a próxima etapa incluindo:

- **Módulo de Planejamento Logístico**: Otimização de rotas para entregas e retiradas
- **Aplicativo para Motoristas**: Acesso móvel para registro de operações em campo
- **Portal do Cliente**: Autoatendimento para solicitações e acompanhamento

## Tecnologias Utilizadas

- **Frontend**: React com Tailwind CSS
- **Backend**: Node.js com Express
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT
- **Hospedagem**: Preparado para DigitalOcean
