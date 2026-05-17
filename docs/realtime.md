# Comunicação em Tempo Real com WebSockets

## Tecnologias

- **Socket.IO 4** — protocolo WebSocket com fallback e reconexão automática
- **`@nestjs/websockets`** — suporte a WebSockets no NestJS
- **`@nestjs/platform-socket.io`** — adaptador Socket.IO para NestJS

## Gateway

O `NotificacoesGateway` é o ponto central de comunicação em tempo real.

```typescript
@WebSocketGateway({ namespace: '/notificacoes', cors: { origin: '*' } })
export class NotificacoesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  emitir(evento: string, dados: unknown): void {
    this.server.emit(evento, dados); // broadcast para todos os clientes
  }
}
```

## Conexão

| Item      | Valor                                  |
|-----------|----------------------------------------|
| URL       | `ws://localhost:3000/notificacoes`     |
| Protocolo | Socket.IO (WebSocket com fallback)     |
| Namespace | `/notificacoes`                        |

## Eventos do Servidor → Cliente

### `agendamento.criado`

Emitido após a persistência bem-sucedida de um novo agendamento.

```json
{
  "id": "uuid-do-agendamento",
  "medicoId": "uuid-do-medico",
  "pacienteId": "uuid-do-paciente",
  "dataHora": "2026-05-20T14:00:00.000Z",
  "status": "agendado"
}
```

### `pagamento.processado`

Emitido após o processamento (aprovação ou recusa) de um pagamento.

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

## Eventos do Cliente → Servidor

### `ping`

Healthcheck de conexão. O servidor responde com `pong`.

**Resposta `pong`:**
```json
{ "timestamp": "2026-05-16T10:00:00.000Z" }
```

## Exemplo de Conexão (JavaScript)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/notificacoes');

socket.on('connect', () => {
  console.log('Conectado ao servidor de notificações');
});

socket.on('agendamento.criado', (dados) => {
  console.log('Novo agendamento:', dados);
});

socket.on('pagamento.processado', (dados) => {
  console.log('Pagamento processado:', dados);
});

// Healthcheck
socket.emit('ping');
socket.on('pong', ({ timestamp }) => {
  console.log('Pong recebido em:', timestamp);
});
```

## Arquitetura de Integração

O gateway é injetado diretamente nos use-cases para emissão de eventos após operações de domínio, garantindo que o evento só seja emitido após confirmação de persistência:

```
Use Case
  │
  ├── 1. Persiste no banco (via Repository)
  │
  └── 2. Emite evento WebSocket (via NotificacoesGateway)
         └── server.emit(evento, dados) → todos os clientes conectados
```
