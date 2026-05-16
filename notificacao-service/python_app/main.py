import json
import logging
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from rabbit import ClienteRabbit

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("notificacao")


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
    logger.info("Iniciando notificacao-service (python)")
    await garantir_conexao()


@app.on_event("shutdown")
async def encerrar_aplicacao():
    logger.info("Encerrando notificacao-service (python)")
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


@app.post("/notificacoes/consulta/marcada")
async def notificar_consulta_marcada(dados: ModeloConsulta):
    evento = "consulta.marcada"
    mensagem = construir_mensagem(evento, dados.dict())
    try:
        await cliente_rabbit.publicar(evento, mensagem)
    except Exception as e:
        logger.exception("Falha ao publicar consulta.marcada")
        raise HTTPException(status_code=500, detail=str(e))
    return {"publicado": True, "evento": evento, "messageId": mensagem["messageId"]}


@app.post("/notificacoes/consulta/cancelada")
async def notificar_consulta_cancelada(dados: ModeloConsulta):
    evento = "consulta.cancelada"
    mensagem = construir_mensagem(evento, dados.dict())
    try:
        await cliente_rabbit.publicar(evento, mensagem)
    except Exception as e:
        logger.exception("Falha ao publicar consulta.cancelada")
        raise HTTPException(status_code=500, detail=str(e))
    return {"publicado": True, "evento": evento, "messageId": mensagem["messageId"]}


@app.post("/notificacoes/pagamento/recusado")
async def notificar_pagamento_recusado(dados: ModeloPagamento):
    evento = "pagamento.recusado"
    mensagem = construir_mensagem(evento, dados.dict())
    try:
        await cliente_rabbit.publicar(evento, mensagem)
    except Exception as e:
        logger.exception("Falha ao publicar pagamento.recusado")
        raise HTTPException(status_code=500, detail=str(e))
    return {"publicado": True, "evento": evento, "messageId": mensagem["messageId"]}


@app.post("/notificacoes")
async def notificar_generico(payload: ModeloGenerico):
    evento = payload.event or "notifications.default"
    mensagem = construir_mensagem(evento, payload.data)
    try:
        await cliente_rabbit.publicar(evento, mensagem)
    except Exception as e:
        logger.exception("Falha ao publicar notificação genérica")
        raise HTTPException(status_code=500, detail=str(e))
    return {"publicado": True, "evento": evento, "messageId": mensagem["messageId"]}
