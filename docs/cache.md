# Cache Distribuído com Redis

## Tecnologias

- **Redis 7** — servidor de cache in-memory
- **`@nestjs/cache-manager` v3** — integração NestJS
- **`cache-manager` v7** — gerenciador de cache (baseado em Keyv)
- **`@keyv/redis`** — store Redis compatível com cache-manager v7+

## Configuração

O módulo `RedisCacheModule` é registrado como **global** no `AppModule`, tornando o `CACHE_MANAGER` disponível em qualquer módulo sem re-importação.

```typescript
// src/infrastructure/cache/redis-cache.module.ts
CacheModule.registerAsync({
  isGlobal: true,
  useFactory: () => ({
    stores: [new KeyvRedis(process.env.REDIS_URL ?? 'redis://redis:6379')],
    ttl: 60 * 1000, // TTL padrão: 60 segundos
  }),
})
```

## Padrão Cache-Aside

O padrão utilizado é o **Cache-Aside** (Lazy Loading): a aplicação é responsável por popular e invalidar o cache.

```
┌─────────┐     GET /medicos      ┌──────────────┐
│ Cliente │ ──────────────────▶  │  Use Case    │
└─────────┘                       └──────┬───────┘
                                         │ cache.get('medicos:all')
                                         ▼
                                   ┌──────────┐
                                   │  Redis   │
                                   └────┬─────┘
                              hit ◀─────┴──────▶ miss
                               │                  │
                               │          banco.findAll()
                               │                  │
                               │          cache.set(key, data)
                               ▼                  ▼
                            retorna            retorna
```

## Chaves de Cache

| Chave           | Conteúdo                  | TTL    | Invalidada em       |
|-----------------|---------------------------|--------|---------------------|
| `medicos:all`   | Lista de todos os médicos | 60s    | `POST /medicos`     |
| `pacientes:all` | Lista de todos os pacientes | 60s  | `POST /pacientes`   |

## Como Usar nos Use Cases

### Leitura com cache-aside

```typescript
const cached = await this.cache.get<MedicoOutputDto[]>('medicos:all');
if (cached) return cached;

const result = /* busca no banco */;
await this.cache.set('medicos:all', result);
return result;
```

### Invalidação após escrita

```typescript
await this.cache.del('medicos:all');
```

## Infraestrutura (Docker)

```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redisdata:/data
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
```

## Variáveis de Ambiente

| Variável    | Padrão                  | Descrição              |
|-------------|-------------------------|------------------------|
| `REDIS_URL` | `redis://redis:6379`    | URL de conexão ao Redis |
