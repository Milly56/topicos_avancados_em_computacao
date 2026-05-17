# Arquitetura do Sistema — Agendamento Médico

## Visão Geral

Sistema de agendamento médico construído com **NestJS** seguindo os princípios de **Domain-Driven Design (DDD)** e **Clean Architecture**.

## Camadas

```
src/
├── domain/                  # Camada de Domínio (regras de negócio)
│   ├── entities/            # Entidades de domínio com comportamento
│   ├── repositories/        # Interfaces dos repositórios (contratos)
│   └── services/            # Serviços de domínio (lógica entre entidades)
│
├── application/             # Camada de Aplicação (casos de uso)
│   ├── use-cases/           # Orquestração de operações de negócio
│   └── dto/                 # DTOs de entrada/saída da camada de aplicação
│
├── infrastructure/          # Camada de Infraestrutura (detalhes técnicos)
│   ├── database/
│   │   ├── schemas/         # Entidades TypeORM (mapeamento banco)
│   │   └── repositories/    # Implementações concretas dos repositórios
│   ├── gateways/            # Integrações com serviços externos (Stripe)
│   ├── cache/               # Módulo de cache distribuído (Redis)
│   └── realtime/            # Gateway WebSocket (Socket.IO)
│
└── presentation/            # Camada de Apresentação (HTTP/WebSocket)
    ├── controllers/         # Controllers REST
    ├── dtos/                # DTOs de requisição/resposta HTTP
    └── modules/             # Módulos NestJS por contexto
```

## Módulos de Domínio

| Módulo       | Responsabilidade                          |
|--------------|-------------------------------------------|
| Médico       | Cadastro e listagem de médicos            |
| Paciente     | Cadastro e listagem de pacientes          |
| Agendamento  | Criação e cancelamento de consultas       |
| Pagamento    | Processamento e consulta de pagamentos    |

## Fluxo de uma Requisição

```
HTTP Request
    │
    ▼
Controller (presentation)
    │  valida DTO de requisição
    ▼
Use Case (application)
    │  orquestra domínio + infra
    ├─▶ Domain Service → Entity (regras de negócio)
    ├─▶ Repository Interface → Repository Impl → Banco PostgreSQL
    ├─▶ Cache (Redis) — leitura/invalidação
    └─▶ NotificacoesGateway — emite evento WebSocket
    │
    ▼
HTTP Response (DTO de saída)
```

## Tecnologias

| Tecnologia         | Uso                                 |
|--------------------|-------------------------------------|
| NestJS 11          | Framework principal                 |
| TypeORM + PostgreSQL | Persistência de dados             |
| Redis              | Cache distribuído                   |
| Socket.IO          | Comunicação em tempo real           |
| Swagger            | Documentação da API                 |
| Docker Compose     | Orquestração dos serviços           |
| UUID v4            | Geração de identificadores únicos   |
