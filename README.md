<h1 align="center">🩺 Sistema de Agendamento Médico</h1>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions">
</p>

---

## 📋 Sobre o Projeto

O **Sistema de Agendamento Médico** é uma API robusta desenvolvida com **NestJS**, projetada para otimizar o fluxo de consultas em clínicas e hospitais. A aplicação oferece uma interface backend completa para gerenciar os pilares fundamentais de um centro médico: profissionais, pacientes e a agenda de atendimentos.

### ✨ Funcionalidades Principais

*   **Gestão de Médicos:** Cadastro completo com especialidades e horários.
*   **Gestão de Pacientes:** Prontuário básico e informações de contato.
*   **Agendamento Inteligente:** Marcação de consultas evitando conflitos de horários.
*   **Consulta de Disponibilidade:** Verificação em tempo real de horários livres.
*   **Documentação Interativa:** Interface Swagger para testes rápidos da API.

> Este projeto foi desenvolvido como parte integrante da disciplina **Tópicos Avançados em Computação**.

---

## 🛠️ Tecnologias e Ferramentas

| Tecnologia | Finalidade |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript/TypeScript |
| **NestJS** | Framework progressivo para aplicações escaláveis |
| **TypeScript** | Superset que adiciona tipagem estática ao código |
| **Swagger** | Padronização e documentação interativa (OpenAPI) |
| **GitHub Actions** | Automação de CI/CD (Build e Testes) |
| **Docker** | Containerização para facilidade de deploy |

---

## 🚀 Como Executar o Projeto

### ⚙️ Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
*   [Node.js](https://nodejs.org/) (v20 ou superior)
*   [npm](https://www.npmjs.com/) (v10 ou superior)
*   [NestJS CLI](https://docs.nestjs.com/cli/overview)

```bash
# Instalar o NestJS CLI globalmente
npm install -g @nestjs/cli
```

### 🛠️ Passo a Passo

1.  **Clonar o repositório**
    ```bash
    git clone https://github.com/Milly56/topicos_avancados_em_computacao.git
    ```

2.  **Acessar o diretório**
    ```bash
    cd topicos_avancados_em_computacao
    ```

3.  **Instalar as dependências**
    ```bash
    npm install
    ```

4.  **Iniciar o servidor em modo de desenvolvimento**
    ```bash
    npm run start:dev
    ```

O servidor estará rodando em: `http://localhost:3000`

---

## 📚 Documentação da API

A documentação detalhada dos endpoints, incluindo modelos de dados e parâmetros, pode ser acessada via Swagger UI:

🔗 **[http://localhost:3000/api](http://localhost:3000/api)**

---

## 📦 Estrutura de Pastas

A arquitetura segue os padrões de modularidade do NestJS:

```text
topicos_avancados_em_computacao/
├── src/
│   ├── agendamento/                  # Bounded Context: Agendamento
│   │   ├── application/              # Camada de Aplicação (Use Cases)
│   │   │   ├── dto/
│   │   │   ├── services/
│   │   │   └── use-cases/
│   │   ├── domain/                   # Camada de Domínio (Regras de negócio puras)
│   │   │   ├── entities/
│   │   │   ├── repositories/         # Interfaces dos repositórios
│   │   │   ├── services/             # Domain Services (se necessário)
│   │   │   └── value-objects/
│   │   ├── infrastructure/           # Infraestrutura (persistência, adapters)
│   │   │   ├── persistence/          # In-memory / futuro banco
│   │   │   └── repositories/         # Implementações concretas
│   │   ├── presentation/             # Camada de Apresentação
│   │   │   ├── controllers/
│   │   │   └── dtos/                 # DTOs de request/response
│   │   └── agendamento.module.ts
│   │
│   ├── paciente/                     # Bounded Context: Paciente
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── presentation/
│   │   └── paciente.module.ts
│   │
│   ├── pagamento/                    # Bounded Context: Pagamento
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── presentation/
│   │   └── pagamento.module.ts
│   │
│   ├── profissionais/                # Bounded Context: Profissionais/Médicos
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── presentation/
│   │   └── profissionais.module.ts
│   │
│   ├── shared/                       # Código compartilhado entre bounded contexts
│   │   ├── exceptions/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── test/                             # Testes (mantido ou movido para cada módulo)
│   └── e2e/
│
├── Dockerfile                        
├── docker-compose.yml                
├── .dockerignore                     
├── .env.example                     
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

---

## ⚙️ CI/CD

Utilizamos **GitHub Actions** para garantir a integridade do código em cada contribuição:
*   **Build Check:** Garante que a aplicação compila sem erros.
*   **Automated Tests:** Execução de suítes de testes para prevenir regressões.
*   **Code Quality:** Verificação de padrões de codificação.

---

## 👥 Contribuidores

Agradecemos às seguintes pessoas que contribuíram para este projeto:

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/Milly56">
        <img src="https://avatars.githubusercontent.com/u/149894875?v=4" width="100px;" alt="Jamily Alves Rorigues"/><br />
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
        <img src="https://avatars.githubusercontent.com/u/142066909?v=4" width="100px;" alt="José Carlos"/><br />
        <sub><b>Lígia kaylanne</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/carlos0ff">
        <img src="https://avatars.githubusercontent.com/u/49466705?v=4" width="100px;" alt="José Carlos"/><br />
        <sub><b>José Carlos</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<p align="center">
  <i>Desenvolvido para fins acadêmicos</i>
</p>
