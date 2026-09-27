<h1 align="center">🩺 Sistema de Agendamento Médico</h1>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions">
</p>

<p align="center">
  <a href="https://github.com/Milly56/topicos_avancados_em_computacao/actions/workflows/ci.yml">
    <img src="https://github.com/Milly56/topicos_avancados_em_computacao/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
</p>

---

## 📋 Sobre o Projeto

O **Sistema de Agendamento Médico** é uma plataforma fullstack de microsserviços desenvolvida com **NestJS** no backend e **Next.js** no frontend, projetada para otimizar o fluxo de consultas em clínicas e hospitais. A aplicação é composta por serviços independentes que se comunicam através de uma API Gateway (Kong), cada um responsável por um domínio específico do negócio.

### ✨ Funcionalidades Principais

- **Autenticação:** Controle de acesso e gerenciamento de usuários.
- **Gestão de Profissionais:** Cadastro de médicos com especialidades e horários.
- **Gestão de Pacientes:** Prontuário básico e informações de contato.
- **Agendamento Inteligente:** Marcação de consultas evitando conflitos de horários.
- **Gestão de Pagamentos:** Controle de cobranças e pagamentos de consultas.
- **Notificações:** Envio de alertas e lembretes para pacientes e profissionais.
- **Documentação Interativa:** Interface Swagger em cada serviço.

> Este projeto foi desenvolvido como parte integrante da disciplina **Tópicos Avançados em Computação**.

---

## 🛠️ Tecnologias e Ferramentas

| Tecnologia | Finalidade |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript/TypeScript |
| **NestJS** | Framework progressivo para aplicações escaláveis |
| **Next.js** | Framework React para o frontend |
| **TypeScript** | Superset que adiciona tipagem estática ao código |
| **Prisma ORM** | Mapeamento objeto-relacional e migrações de banco |
| **PostgreSQL** | Banco de dados relacional (um por serviço) |
| **Redis** | Cache e gerenciamento de sessões |
| **Kong** | API Gateway para roteamento e autenticação |
| **Prometheus + Grafana** | Monitoramento e visualização de métricas |
| **Swagger** | Padronização e documentação interativa (OpenAPI) |
| **GitHub Actions** | Automação de CI/CD (Build e Testes) |
| **Docker** | Containerização para facilidade de deploy |

---

## 🏗️ Arquitetura

```text
                        ┌─────────────┐
                        │  frontend   │  Next.js
                        │   :3001     │  (porta pública)
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │    Kong     │  API Gateway
                        │   :8000     │
                        └──────┬──────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       │                       │                       │
┌──────▼──────┐       ┌────────▼───────┐      ┌───────▼──────┐
│auth-service │       │paciente-service│      │profissionais │
│  auth-db    │       │  paciente-db   │      │  service     │
│  :5432      │       │  :5433         │      │  :5434       │
└─────────────┘       └────────────────┘      └──────────────┘

┌─────────────┐       ┌────────────────┐      ┌──────────────┐
│agendamento  │       │pagamento       │      │notificacao   │
│-service     │       │-service        │      │-service      │
│agendamento  │       │pagamento-db    │      │notificacao   │
│-db :5435    │       │  :5437         │      │-db :5436     │
└─────────────┘       └────────────────┘      └──────────────┘

┌─────────────┐       ┌────────────────┐
│    Redis    │       │   Prometheus   │──▶ Grafana
│   :6379     │       │    :9090       │    :3000
└─────────────┘       └────────────────┘
```

---

## 📁 Estrutura do Projeto

```text
topicos_avancados_em_computacao/
├── backend/
│   ├── auth-service/
│   ├── paciente-service/
│   ├── profissionais-service/
│   ├── agendamento-service/
│   ├── pagamento-service/
│   ├── notificacao-service/
│   ├── monitoring/
│   │   └── Prometheus.yml
│   └── kong.yml
├── frontend/
│   └── (Next.js)
└── docker-compose.yml
```

---

## 🚀 Como Executar o Projeto

### ⚙️ Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- [Node.js](https://nodejs.org/) (v20 ou superior) — para desenvolvimento local
- [Git](https://git-scm.com/)

### 🛠️ Passo a Passo

1. **Clonar o repositório**
    ```bash
    git clone https://github.com/Milly56/topicos_avancados_em_computacao.git
    cd topicos_avancados_em_computacao
    ```

2. **Configurar variáveis de ambiente**
    ```bash
    cp .env.example .env
    # Edite o .env com suas credenciais
    ```

3. **Subir todos os serviços com Docker**
    ```bash
    docker compose up --build -d
    ```

4. **Verificar os serviços rodando**
    ```bash
    docker compose ps
    ```

### 🔗 Endpoints Disponíveis

| Serviço | URL |
| :--- | :--- |
| Frontend | http://localhost:3001 |
| API Gateway (Kong) | http://localhost:8000 |
| Auth Service | http://localhost:8000/auth |
| Paciente Service | http://localhost:8000/pacientes |
| Profissionais Service | http://localhost:8000/profissionais |
| Agendamento Service | http://localhost:8000/agendamentos |
| Pagamento Service | http://localhost:8000/pagamentos |
| Notificacao Service | http://localhost:8000/notificacoes |
| Grafana | http://localhost:3000 |
| Prometheus | http://localhost:9090 |

---

## 📚 Documentação da API

A documentação Swagger está disponível em cada serviço individualmente após subir o projeto.

---

## ⚙️ CI/CD

Utilizamos **GitHub Actions** para garantir a integridade do código em cada contribuição:

- **Build Check:** Garante que a aplicação compila sem erros.
- **Automated Tests:** Execução de suítes de testes para prevenir regressões.

O pipeline é disparado automaticamente em todo `push` e `pull_request` para as branches `main` e `develop`.

---

## 👥 Contribuidores

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/Milly56">
        <img src="https://avatars.githubusercontent.com/u/149894875?v=4" width="100px;" alt="Jamily Alves"/><br />
        <sub><b>Jamily Alves</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/VitoriaDantas27">
        <img src="https://avatars.githubusercontent.com/u/231708520?v=4" width="100px;" alt="Vitória Dantas"/><br />
        <sub><b>Vitória Dantas</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ligiakaylanne">
        <img src="https://avatars.githubusercontent.com/u/142066909?v=4" width="100px;" alt="Lígia Kaylanne"/><br />
        <sub><b>Lígia Kaylanne</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/carlos0ff">
        <img src="https://avatars.githubusercontent.com/u/49466705?v=4" width="100px;" alt="José Carlos"/><br />
        <sub><b>José Carlos</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/mrcosvinicius">
        <img src="https://avatars.githubusercontent.com/u/200131209?v=4" width="100px;" alt="Marcos Vinicius"/><br />
        <sub><b>Marcos Vinicius</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<p align="center">
  <i>Desenvolvido para fins acadêmicos — Tópicos Avançados em Computação</i>
</p>