## 🏗 Arquitetura da solução

A solução é composta por dois serviços independentes:

- agenda-service
- pagamentos-service

A comunicação entre os serviços é feita por mensageria (eventos de negócio).
O serviço de agenda utiliza cache para consultas de horários.

A arquitetura interna de cada serviço segue o padrão:

- api
- application
- domain
- infrastructure

---

## 🌳 Estrutura completa do repositório

<details>
<summary>Clique para expandir a árvore completa do projeto</summary>

```text
agendamento-medico
├─ docker-compose.yml
├─ .env
│
├─ agenda-service
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ .env
│  │
│  └─ src
│     ├─ main.ts
│     ├─ app.module.ts
│     │
│     ├─ api
│     │  ├─ agenda.controller.ts
│     │  ├─ pacientes.controller.ts
│     │  └─ profissionais.controller.ts
│     │
│     ├─ application
│     │  ├─ agenda
│     │  │  ├─ criar-agendamento
│     │  │  │  ├─ criar-agendamento.usecase.ts
│     │  │  │  └─ criar-agendamento.dto.ts
│     │  │  └─ cancelar-agendamento
│     │  │     └─ cancelar-agendamento.usecase.ts
│     │  │
│     │  ├─ pacientes
│     │  │  └─ criar-paciente.usecase.ts
│     │  │
│     │  └─ ports
│     │     ├─ agendamento-repository.port.ts
│     │     ├─ paciente-repository.port.ts
│     │     └─ profissional-repository.port.ts
│     │
│     ├─ domain
│     │  ├─ entities
│     │  │  ├─ paciente.entity.ts
│     │  │  ├─ profissional.entity.ts
│     │  │  └─ agendamento.entity.ts
│     │  │
│     │  ├─ value-objects
│     │  │  └─ periodo-consulta.vo.ts
│     │  │
│     │  ├─ rules
│     │  │  └─ regras-agendamento.ts
│     │  │
│     │  └─ exceptions
│     │     └─ horario-indisponivel.exception.ts
│     │
│     └─ infrastructure
│        ├─ database
│        │  ├─ prisma
│        │  │  ├─ prisma.module.ts
│        │  │  └─ prisma.service.ts
│        │  │
│        │  └─ repositories
│        │     ├─ prisma-agendamento.repository.ts
│        │     ├─ prisma-paciente.repository.ts
│        │     └─ prisma-profissional.repository.ts
│        │
│        ├─ messaging
│        │  └─ rabbitmq.service.ts
│        │
│        └─ cache
│           └─ redis.service.ts
│
├─ pagamentos-service
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ .env
│  │
│  └─ src
│     ├─ main.ts
│     ├─ app.module.ts
│     │
│     ├─ api
│     │  └─ pagamentos.controller.ts
│     │
│     ├─ application
│     │  ├─ pagamentos
│     │  │  └─ confirmar-pagamento.usecase.ts
│     │  │
│     │  └─ ports
│     │     └─ pagamento-repository.port.ts
│     │
│     ├─ domain
│     │  ├─ entities
│     │  │  └─ pagamento.entity.ts
│     │  ├─ rules
│     │  │  └─ regras-pagamento.ts
│     │  └─ exceptions
│     │     └─ pagamento-invalido.exception.ts
│     │
│     └─ infrastructure
│        ├─ database
│        │  ├─ prisma
│        │  │  ├─ prisma.module.ts
│        │  │  └─ prisma.service.ts
│        │  │
│        │  └─ repositories
│        │     └─ prisma-pagamento.repository.ts
│        │
│        └─ messaging
│           └─ rabbitmq.service.ts
│
├─ docs
│  ├─ arquitetura.md
│  ├─ visao-geral.md
│  └─ eventos.md
│
└─ .github
   └─ workflows
      ├─ agenda-ci.yml
      └─ pagamentos-ci.yml