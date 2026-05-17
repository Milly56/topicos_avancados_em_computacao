# Microserviço de Pagamento

## Visão Geral

O módulo de pagamento gerencia o ciclo de vida financeiro de um agendamento médico, desde a criação até a confirmação ou recusa, integrando com um gateway externo (Stripe).

## Arquitetura DDD

```
domain/
  entities/pagamento.entity.ts          — Entidade rica com regras de negócio
  repositories/i-pagamento.repository.ts — Contrato do repositório
  services/pagamento.service.ts          — Serviço de domínio

application/
  dto/pagamento.dto.ts                   — ProcessarPagamentoDto, PagamentoOutputDto
  use-cases/processar-pagamento.use-case.ts
  use-cases/consultar-pagamento.use-case.ts

infrastructure/
  database/schemas/pagamento.schema.ts        — Entidade TypeORM
  database/repositories/pagamento.repository.impl.ts
  gateways/pagamento.gateway.ts               — Interface do gateway externo
  gateways/stripe-pagamento.gateway.impl.ts   — Implementação (simulada)

presentation/
  dtos/pagamento.request.dto.ts               — DTOs HTTP com validação e Swagger
  controllers/pagamento.controller.ts
  modules/pagamento/pagamento.module.ts
```

## Entidade de Domínio

### Estados do Pagamento

```
pendente ──▶ aprovado ──▶ estornado
    │
    └──▶ recusado
```

### Métodos de negócio

| Método                  | Pré-condição     | Efeito                  |
|-------------------------|------------------|-------------------------|
| `confirmarPagamento()`  | status=pendente  | status → aprovado       |
| `recusarPagamento()`    | status=pendente  | status → recusado       |
| `estornarPagamento()`   | status=aprovado  | status → estornado      |

### Reconstituição do banco

```typescript
Pagamento.reconstituir(id, agendamentoId, valor, metodoPagamento, status, dataPagamento)
```

## Endpoints REST

### `POST /pagamentos`

Processa um novo pagamento para um agendamento.

**Request:**
```json
{
  "agendamentoId": "uuid-do-agendamento",
  "valor": 150.00,
  "metodoPagamento": "cartao_credito"
}
```

**Response 201:**
```json
{
  "id": "uuid-do-pagamento",
  "agendamentoId": "uuid-do-agendamento",
  "valor": 150.00,
  "status": "aprovado",
  "metodoPagamento": "cartao_credito",
  "dataPagamento": "2026-05-16T10:00:00.000Z"
}
```

**Métodos de pagamento aceitos:** `cartao_credito`, `cartao_debito`, `pix`, `boleto`

### `GET /pagamentos/:agendamentoId`

Consulta o pagamento vinculado a um agendamento.

**Response 200:** mesmo formato do POST  
**Response 404:** pagamento não encontrado

## Fluxo de Processamento

```
POST /pagamentos
    │
    ▼
ProcessarPagamentoUseCase
    │
    ├── 1. Cria Pagamento (status: pendente) → salva no banco
    │
    ├── 2. Chama StripePagamentoGatewayImpl
    │       ├── sucesso → confirmarPagamento() → salva
    │       └── falha  → recusarPagamento() → salva → lança erro
    │
    └── 3. Emite 'pagamento.processado' via WebSocket
```

## Gateway Stripe (Simulado)

A implementação atual é uma simulação. Em produção, substituir pelo SDK oficial do Stripe.

**Validações atuais:**
- Método de pagamento deve estar na lista aceita
- Valor deve ser maior que zero

## Injeção de Dependências

| Token                  | Implementação               |
|------------------------|-----------------------------|
| `'IPagamentoRepository'` | `PagamentoRepositoryImpl` |
| `'IPagamentoGateway'`    | `StripePagamentoGatewayImpl` |
