import main
import metrics
import pytest
from fastapi.testclient import TestClient


class DummyCliente:
    def __init__(self):
        # marca que a troca/exchange existe para pular o connect no startup
        self.troca = object()
        self.publicadas = []

    async def publicar(self, chave_rota: str, carga: dict):
        # apenas armazena as mensagens publicadas
        self.publicadas.append((chave_rota, carga))
        return True

    async def fechar(self):
        # método de cleanup chamado no shutdown do app
        return None


class FailingCliente(DummyCliente):
    async def publicar(self, chave_rota: str, carga: dict):
        raise RuntimeError("falha proposital")


class HealthyCliente(DummyCliente):
    async def health_check(self) -> bool:
        return True


class UnhealthyCliente(DummyCliente):
    async def health_check(self) -> bool:
        return False


def assert_subdict(contido: dict, esperado: dict):
    for k, v in esperado.items():
        assert k in contido and contido[k] == v


def test_consulta_marcada_publica(monkeypatch):
    cliente = DummyCliente()
    monkeypatch.setattr(main, "cliente_rabbit", cliente)

    with TestClient(main.app) as client:
        payload = {
            "consultaId": "uuid-1",
            "pacienteId": "p-1",
            "profissionalId": "pr-1",
            "data": "2026-04-10",
            "horario": "14:00",
        }
        resp = client.post("/notificacoes/consulta/marcada", json=payload)
        assert resp.status_code == 200
        body = resp.json()
        assert body["publicado"] is True
        assert body["evento"] == "consulta.marcada"
        assert "messageId" in body

        # verificando que o publisher recebeu a mensagem
        assert len(cliente.publicadas) == 1
        chave, carga = cliente.publicadas[0]
        assert chave == "consulta.marcada"
        assert carga["event"] == "consulta.marcada"
        assert_subdict(carga["data"], payload)


def test_consulta_cancelada_publica(monkeypatch):
    cliente = DummyCliente()
    monkeypatch.setattr(main, "cliente_rabbit", cliente)

    with TestClient(main.app) as client:
        payload = {
            "consultaId": "uuid-2",
            "pacienteId": "p-2",
            "profissionalId": "pr-2",
            "data": "2026-04-11",
            "horario": "15:00",
        }
        resp = client.post("/notificacoes/consulta/cancelada", json=payload)
        assert resp.status_code == 200
        body = resp.json()
        assert body["publicado"] is True
        assert body["evento"] == "consulta.cancelada"
        assert len(cliente.publicadas) == 1
        chave, carga = cliente.publicadas[0]
        assert chave == "consulta.cancelada"
        assert_subdict(carga["data"], payload)


def test_pagamento_recusado_publica(monkeypatch):
    cliente = DummyCliente()
    monkeypatch.setattr(main, "cliente_rabbit", cliente)

    with TestClient(main.app) as client:
        payload = {"pagamentoId": 123, "valor": 150.0, "motivo": "Cartão recusado"}
        resp = client.post("/notificacoes/pagamento/recusado", json=payload)
        assert resp.status_code == 200
        body = resp.json()
        assert body["publicado"] is True
        assert body["evento"] == "pagamento.recusado"
        assert len(cliente.publicadas) == 1
        chave, carga = cliente.publicadas[0]
        assert chave == "pagamento.recusado"
        assert_subdict(carga["data"], payload)


def test_publicacao_falha_retorna_500(monkeypatch):
    cliente = FailingCliente()
    monkeypatch.setattr(main, "cliente_rabbit", cliente)

    with TestClient(main.app) as client:
        payload = {"pagamentoId": 321, "valor": 10.0, "motivo": "Erro"}
        resp = client.post("/notificacoes/pagamento/recusado", json=payload)
        assert resp.status_code == 500


def test_health_check_rabbitmq_saudavel(monkeypatch):
    cliente = HealthyCliente()
    monkeypatch.setattr(main, "cliente_rabbit", cliente)

    with TestClient(main.app) as client:
        resp = client.get("/health")
        assert resp.status_code == 200
        body = resp.json()
        assert body["status"] == "healthy"
        assert body["checks"]["rabbitmq"] == "up"


def test_health_check_rabbitmq_indisponivel(monkeypatch):
    cliente = UnhealthyCliente()
    monkeypatch.setattr(main, "cliente_rabbit", cliente)

    with TestClient(main.app) as client:
        resp = client.get("/health")
        assert resp.status_code == 503
        body = resp.json()
        assert body["status"] == "unhealthy"
        assert body["checks"]["rabbitmq"] == "down"


def test_metrics_endpoint_expose_prometheus_format(monkeypatch):
    # limpa o contador antes do teste para evitar interferência
    metrics.NOTIFICACOES_ENVIADAS.clear()
    cliente = DummyCliente()
    monkeypatch.setattr(main, "cliente_rabbit", cliente)

    with TestClient(main.app) as client:
        # envia algumas notificações
        client.post(
            "/notificacoes/consulta/marcada",
            json={
                "consultaId": "c1",
                "pacienteId": "p1",
                "profissionalId": "pr1",
                "data": "2026-04-10",
                "horario": "10:00",
            },
        )
        client.post(
            "/notificacoes/consulta/marcada",
            json={
                "consultaId": "c2",
                "pacienteId": "p2",
                "profissionalId": "pr2",
                "data": "2026-04-11",
                "horario": "11:00",
            },
        )
        client.post(
            "/notificacoes/consulta/cancelada",
            json={
                "consultaId": "c3",
                "pacienteId": "p3",
                "profissionalId": "pr3",
                "data": "2026-04-12",
                "horario": "12:00",
            },
        )

        # consulta as métricas
        resp = client.get("/metrics")
        assert resp.status_code == 200
        assert "text/plain" in resp.headers["content-type"]
        body = resp.text
        assert 'notificacoes_enviadas_total{tipo="consulta.marcada"} 2.0' in body
        assert 'notificacoes_enviadas_total{tipo="consulta.cancelada"} 1.0' in body
