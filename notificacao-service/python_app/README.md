Notificacao Service (Python)

Este diretório contém uma versão em Python (FastAPI) do microserviço de notificações.

Endpoints:
- GET / -> health check
- POST /notificacoes/consulta/marcada -> publica evento `consulta.marcada`
- POST /notificacoes/consulta/cancelada -> publica evento `consulta.cancelada`
- POST /notificacoes/pagamento/recusado -> publica evento `pagamento.recusado`
- POST /notificacoes -> endpoint genérico { "event": "recurso.acao", "data": {...} }

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

Docker:
- Build: docker build -t notificacao-python ./python_app
- Run: docker run -e RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672 -p 3000:3000 notificacao-python

Observações:
- O serviço publica mensagens no exchange `notifications` do tipo `topic`.
- Mensagens seguem o formato: { event, messageId, timestamp, data }.
- Outros microserviços podem criar filas e fazer bind ao exchange com routing keys como `consulta.*` ou `pagamento.recusado`.
