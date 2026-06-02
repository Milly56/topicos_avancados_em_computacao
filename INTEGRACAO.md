# 🔗 Integração Frontend e Backend

## 📋 Visão Geral

O projeto foi integrado com sucesso! Agora o frontend se comunica com o backend através da API Gateway (Kong) na porta 8000.

### Arquitetura

```
Frontend (Next.js - porta 3001)
    ↓
Kong API Gateway (porta 8000)
    ↓
Microserviços:
  - Auth Service (porta 3000)
  - Paciente Service (porta 3000)
  - Profissionais Service (porta 3000)
    ↓
PostgreSQL Databases
Redis Cache
```

## 🚀 Como Rodar

### Opção 1: Com Docker Compose (Recomendado)

```bash
# Ir até a raiz do projeto
cd topicos_avancados_em_computacao

# Rodar todo o stack
docker-compose up -d

# Aguardar os serviços iniciarem (~30 segundos)
# Frontend: http://localhost:3001
# Kong Admin: http://localhost:8001
# Grafana: http://localhost:3000 (user: admin, pass: admin)
# Prometheus: http://localhost:9090
```

### Opção 2: Desenvolvimento Local

#### 1. Backend

```bash
cd backend

# Instalar dependências (se necessário)
npm install

# Rodar os serviços localmente (requer Redis e PostgreSQL instalados)
# Ou use docker-compose apenas para os serviços:
docker-compose up redis auth-db paciente-db profissionais-db kong -d
```

#### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Acesse: http://localhost:3000
```

## 🔐 Autenticação

### Endpoints de Auth

#### Login
```bash
POST http://localhost:8000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Resposta:
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "PACIENTE" | "PROFISSIONAL" | "ADMIN"
  }
}
```

#### Registro
```bash
POST http://localhost:8000/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "PACIENTE" | "PROFISSIONAL" | "ADMIN"
}

# Resposta:
{
  "id": "uuid",
  "email": "newuser@example.com",
  "role": "PACIENTE"
}
```

## 📝 Fluxo de Autenticação

1. **Usuário entra em http://localhost:3001** (ou porta do frontend)
2. **Clica no botão "Entrar"** ou vai para o cadastro
3. **Frontend faz chamada para http://localhost:8000/auth/login**
4. **Kong roteia para Auth Service**
5. **Auth Service valida credenciais no PostgreSQL**
6. **Retorna token JWT para o frontend**
7. **Frontend armazena token no localStorage**
8. **Redireciona para dashboard**

## 🔑 Variáveis de Ambiente

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

## 📚 Estrutura de Pastas

### Frontend
```
frontend/
  ├── app/
  │   ├── contexts/
  │   │   └── AuthContext.tsx (lógica de autenticação)
  │   ├── lib/
  │   │   └── api.ts (cliente HTTP para APIs)
  │   ├── pages/
  │   │   ├── LoginPage.tsx
  │   │   └── RegisterPage.tsx
  │   └── page.tsx (inicial, redireciona para login)
  └── .env.local (configuração da API)
```

### Backend
```
backend/
  ├── auth-service/
  │   └── src/
  │       ├── auth.controller.ts
  │       ├── auth.service.ts
  │       └── login.dto.ts / register.dto.ts
  ├── paciente-service/
  ├── profissionais-service/
  ├── kong.yml (configuração do API Gateway)
  └── .env (credenciais do banco)
```

## ✅ Próximos Passos

1. **Integrar demais microserviços** (Paciente, Profissionais, Agendamentos, etc)
2. **Criar contextos adicionais** para cada domínio
3. **Implementar proteção de rotas** com autenticação
4. **Adicionar interceptadores** para incluir token nos headers
5. **Fazer cache com Redis**
6. **Implementar refresh de token**

## 🛠️ Troubleshooting

### Erro: "Erro ao fazer login"
- Verifique se Kong está rodando: `http://localhost:8001`
- Verifique se Auth Service está rodando
- Check dos logs: `docker logs auth-service`

### Erro: "Cannot reach http://localhost:8000"
- Kong pode estar iniciando. Aguarde ~30 segundos
- Verifique os logs: `docker logs kong`

### Token inválido
- Limpe o localStorage do navegador
- Faça login novamente

## 📞 Contato & Suporte

Para mais informações, consulte:
- Kong Docs: https://docs.konghq.com
- NestJS Docs: https://docs.nestjs.com
- Next.js Docs: https://nextjs.org/docs
