Notificacao Service (Python)

Este diretório contém uma versão em Python (FastAPI) do microserviço de notificações.

Endpoints:
- GET / -> health check básico
- GET /health -> health check com verificação de conectividade ao RabbitMQ
- GET /metrics -> métricas no formato Prometheus
- POST /notificacoes/consulta/marcada -> publica evento `consulta.marcada`
- POST /notificacoes/consulta/cancelada -> publica evento `consulta.cancelada`
- POST /notificacoes/pagamento/recusado -> publica evento `pagamento.recusado`
- POST /notificacoes -> endpoint genérico { "event": "recurso.acao", "data": {...} }

Observabilidade (PySerilog):
O serviço utiliza a biblioteca `pyserilog` para logging estruturado em JSON.
Todos os logs são enriquecidos com as propriedades:
- `service`: nome do serviço (notificacao-service)
- `environment`: ambiente de execução (development, production, etc.)

Exemplo de saída de log:
```json
{
  "timestamp": "2026-05-23T08:47:03.937117",
  "level": "INFORMATION",
  "message_template": "Evento consulta.marcada publicado: MessageId={MessageId}",
  "properties": {
    "MessageId": "uuid-123",
    "service": "notificacao-service",
    "environment": "development"
  }
}
```

Health Check com RabbitMQ:
O endpoint `/health` verifica se a conexão e o canal com o RabbitMQ estão ativos,
tentando redeclarar o exchange configurado. Retorna:
- HTTP 200 quando o RabbitMQ está saudável
- HTTP 503 quando o RabbitMQ está indisponível

Métricas (Prometheus):
O endpoint `/metrics` expõe métricas no formato Prometheus.

Métricas customizadas disponíveis:
- `notificacoes_enviadas_total{tipo="<evento>"}` - contador de notificações enviadas com sucesso, discriminado pelo tipo de evento. Exemplos de labels:
  - `tipo="consulta.marcada"`
  - `tipo="consulta.cancelada"`
  - `tipo="pagamento.recusado"`
  - `tipo="notifications.default"` (para notificações genéricas)

Exemplo de saída:
```
# HELP notificacoes_enviadas_total Total de notificações enviadas com sucesso
# TYPE notificacoes_enviadas_total counter
notificacoes_enviadas_total{tipo="consulta.marcada"} 5.0
notificacoes_enviadas_total{tipo="consulta.cancelada"} 2.0
```

Como rodar localmente:
1. Levantar RabbitMQ (exemplo):
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

2. No diretório python_app:
   pip install -r requirements.txt
   uvicorn main:app --reload --port 3000

3. Exemplo de requisição:
   curl -X POST http://localhost:3000/notificacoes/consulta/marcada \
     -H "Content-Type: application/json" \
     -d '{"consultaId":"uuid-1","pacienteId":"p-1","profissionalId":"pr-1","data":"2026-04-10","horario":"14:00"}'

4. Health check:
   curl http://localhost:3000/health

5. Métricas:
   curl http://localhost:3000/metrics

Docker:
- Build: docker build -t notificacao-python ./python_app
- Run: docker run -e RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672 -p 3000:3000 notificacao-python

Observações:
- O serviço publica mensagens no exchange `notifications` do tipo `topic`.
- Mensagens seguem o formato: { event, messageId, timestamp, data }.
- Outros microserviços podem criar filas e fazer bind ao exchange com routing keys como `consulta.*` ou `pagamento.recusado`.
