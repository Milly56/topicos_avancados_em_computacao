# Referência da API REST

Base URL: `http://localhost:3000`  
Documentação interativa (Swagger): `http://localhost:3000/api`

---

## Médicos

### `POST /medicos`

Cadastra um novo médico.

**Request:**
```json
{
  "nome": "Dr. João Silva",
  "especialidade": "Cardiologia",
  "crm": "12345-SP"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "nome": "Dr. João Silva",
  "especialidade": "Cardiologia",
  "crm": "12345-SP"
}
```

**Efeito colateral:** invalida cache `medicos:all` no Redis.

---

### `GET /medicos`

Lista todos os médicos.

**Response 200:** array de médicos  
**Cache:** resultado armazenado em `medicos:all` por 60 segundos.

---

## Pacientes

### `POST /pacientes`

Cadastra um novo paciente.

**Request:**
```json
{
  "nome": "Maria Souza",
  "cpf": "123.456.789-00",
  "dataNascimento": "1990-03-15"
}
```

**Response 201:** dados do paciente criado  
**Efeito colateral:** invalida cache `pacientes:all` no Redis.

---

### `GET /pacientes`

Lista todos os pacientes.

**Response 200:** array de pacientes  
**Cache:** resultado armazenado em `pacientes:all` por 60 segundos.

---

## Agendamentos

### `POST /agendamentos`

Cria um novo agendamento médico.

**Request:**
```json
{
  "medicoId": "uuid-do-medico",
  "pacienteId": "uuid-do-paciente",
  "dataHora": "2026-05-20T14:00:00.000Z"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "medicoId": "uuid-do-medico",
  "pacienteId": "uuid-do-paciente",
  "dataHora": "2026-05-20T14:00:00.000Z",
  "status": "agendado"
}
```

**Efeito colateral:** emite evento `agendamento.criado` via WebSocket.  
**Regra de negócio:** médico não pode ter dois agendamentos no mesmo horário.

---

## Pagamentos

### `POST /pagamentos`

Processa um pagamento para um agendamento.

**Request:**
```json
{
  "agendamentoId": "uuid-do-agendamento",
  "valor": 150.00,
  "metodoPagamento": "cartao_credito"
}
```

**Métodos aceitos:** `cartao_credito`, `cartao_debito`, `pix`, `boleto`

**Response 201:**
```json
{
  "id": "uuid",
  "agendamentoId": "uuid-do-agendamento",
  "valor": 150.00,
  "status": "aprovado",
  "metodoPagamento": "cartao_credito",
  "dataPagamento": "2026-05-16T10:00:00.000Z"
}
```

**Efeito colateral:** emite evento `pagamento.processado` via WebSocket.

---

### `GET /pagamentos/:agendamentoId`

Consulta o pagamento de um agendamento.

**Response 200:** dados do pagamento  
**Response 404:** `{ "message": "Pagamento para o agendamento '...' não encontrado." }`

---

## WebSocket

**URL:** `ws://localhost:3000/notificacoes`

| Evento (servidor→cliente) | Disparado em            |
|---------------------------|-------------------------|
| `agendamento.criado`      | `POST /agendamentos`    |
| `pagamento.processado`    | `POST /pagamentos`      |

| Evento (cliente→servidor) | Resposta                |
|---------------------------|-------------------------|
| `ping`                    | `pong` com timestamp    |
