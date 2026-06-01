import json
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
from logger_config import setup_logger
from metrics import incrementar_contador, metrics_response
from pydantic import BaseModel, Field
from rabbit import ClienteRabbit

logger = setup_logger()


class ModeloConsulta(BaseModel):
    consultaId: str
    pacienteId: str
    profissionalId: str
    data: str
    horario: str
    observacoes: Optional[str] = None


class ModeloPagamento(BaseModel):
    pagamentoId: Optional[int] = None
    valor: Optional[float] = None
    motivo: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None


class ModeloGenerico(BaseModel):
    event: Optional[str] = None
    data: Dict[str, Any] = Field(default_factory=dict)


app = FastAPI(title="Serviço de Notificações (Python)")

cliente_rabbit = ClienteRabbit()


async def garantir_conexao():
    # helper para garantir que a conexão ao Rabbit esteja estabelecida
    if not cliente_rabbit.troca:
        await cliente_rabbit.conectar()


@app.on_event("startup")
async def iniciar_aplicacao():
    logger.information("Iniciando notificacao-service (python)")
    await garantir_conexao()


@app.on_event("shutdown")
async def encerrar_aplicacao():
    logger.information("Encerrando notificacao-service (python)")
    await cliente_rabbit.fechar()


def construir_mensagem(evento: str, dados: dict) -> dict:
    return {
        "event": evento,
        "messageId": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": dados,
    }


@app.get("/")
async def raiz():
    return {"status": "ok", "servico": "notificacao-service", "linguagem": "python"}


@app.get("/health")
async def health_check():
    """Health check que verifica a conectividade com o RabbitMQ."""
    rabbit_saudavel = await cliente_rabbit.health_check()
    status_code = 200 if rabbit_saudavel else 503
    status_text = "healthy" if rabbit_saudavel else "unhealthy"

    logger.debug(
        "Health check executado: RabbitMQ={Status}",
        "saudavel" if rabbit_saudavel else "indisponivel",
    )

    return JSONResponse(
        status_code=status_code,
        content={
            "status": status_text,
            "servico": "notificacao-service",
            "checks": {
                "rabbitmq": "up" if rabbit_saudavel else "down",
            },
        },
    )


@app.get("/metrics")
async def metrics():
    """Endpoint que expõe as métricas no formato Prometheus."""
    data, content_type = metrics_response()
    return PlainTextResponse(content=data, media_type=content_type)


@app.post("/notificacoes/consulta/marcada")
async def notificar_consulta_marcada(dados: ModeloConsulta):
    evento = "consulta.marcada"
    mensagem = construir_mensagem(evento, dados.model_dump())
    try:
        await cliente_rabbit.publicar(evento, mensagem)
    except Exception as e:
        logger.error("Falha ao publicar consulta.marcada: {Erro}", str(e), exception=e)
        raise HTTPException(status_code=500, detail=str(e))
    logger.information(
        "Evento consulta.marcada publicado: MessageId={MessageId}",
        mensagem["messageId"],
    )
    incrementar_contador(evento)
    return {"publicado": True, "evento": evento, "messageId": mensagem["messageId"]}


@app.post("/notificacoes/consulta/cancelada")
async def notificar_consulta_cancelada(dados: ModeloConsulta):
    evento = "consulta.cancelada"
    mensagem = construir_mensagem(evento, dados.model_dump())
    try:
        await cliente_rabbit.publicar(evento, mensagem)
    except Exception as e:
        logger.error(
            "Falha ao publicar consulta.cancelada: {Erro}", str(e), exception=e
        )
        raise HTTPException(status_code=500, detail=str(e))
    logger.information(
        "Evento consulta.cancelada publicado: MessageId={MessageId}",
        mensagem["messageId"],
    )
    incrementar_contador(evento)
    return {"publicado": True, "evento": evento, "messageId": mensagem["messageId"]}


@app.post("/notificacoes/pagamento/recusado")
async def notificar_pagamento_recusado(dados: ModeloPagamento):
    evento = "pagamento.recusado"
    mensagem = construir_mensagem(evento, dados.model_dump())
    try:
        await cliente_rabbit.publicar(evento, mensagem)
    except Exception as e:
        logger.error(
            "Falha ao publicar pagamento.recusado: {Erro}", str(e), exception=e
        )
        raise HTTPException(status_code=500, detail=str(e))
    logger.information(
        "Evento pagamento.recusado publicado: MessageId={MessageId}",
        mensagem["messageId"],
    )
    incrementar_contador(evento)
    return {"publicado": True, "evento": evento, "messageId": mensagem["messageId"]}


@app.post("/notificacoes")
async def notificar_generico(payload: ModeloGenerico):
    evento = payload.event or "notifications.default"
    mensagem = construir_mensagem(evento, payload.data)
    try:
        await cliente_rabbit.publicar(evento, mensagem)
    except Exception as e:
        logger.error(
            "Falha ao publicar notificação genérica: {Erro}", str(e), exception=e
        )
        raise HTTPException(status_code=500, detail=str(e))
    logger.information(
        "Evento generico publicado: Event={Event}, MessageId={MessageId}",
        evento,
        mensagem["messageId"],
    )
    incrementar_contador(evento)
    return {"publicado": True, "evento": evento, "messageId": mensagem["messageId"]}
