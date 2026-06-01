import asyncio
import json
import os

import aio_pika
from aio_pika import DeliveryMode, ExchangeType, Message
from logger_config import setup_logger


class ClienteRabbit:
    """Cliente RabbitMQ assíncrono usando aio-pika (conexão robusta).

    Métodos principais:
    - conectar(): estabelece conexão e declara uma exchange do tipo 'topic'
    - publicar(chave_rota, carga): publica uma mensagem persistente
    - fechar(): fecha canal e conexão
    - health_check(): verifica se a conexão e o canal estão abertos
    """

    def __init__(self, url: str = None, troca: str = None):
        self.url = url or os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
        self.nome_troca = troca or os.getenv("RABBITMQ_EXCHANGE", "notifications")
        self.conexao: aio_pika.RobustConnection | None = None
        self.canal: aio_pika.RobustChannel | None = None
        self.troca: aio_pika.Exchange | None = None
        self.logger = setup_logger().for_context("component", "ClienteRabbit")

    async def conectar(self):
        """Tenta conectar ao RabbitMQ repetidamente (retry em loop)."""
        retry_delay = int(os.getenv("RABBITMQ_RETRY_DELAY", "5"))
        while True:
            try:
                self.conexao = await aio_pika.connect_robust(self.url)
                self.canal = await self.conexao.channel()
                self.troca = await self.canal.declare_exchange(
                    self.nome_troca, ExchangeType.TOPIC, durable=True
                )
                self.logger.information(
                    "Conectado ao RabbitMQ em {Url}, exchange={Exchange}",
                    self.url,
                    self.nome_troca,
                )
                break
            except Exception as e:
                self.logger.warning(
                    "Falha ao conectar RabbitMQ: {Erro}. Tentando novamente em {Delay}s...",
                    str(e),
                    retry_delay,
                )
                await asyncio.sleep(retry_delay)

    async def publicar(self, chave_rota: str, carga: dict):
        """Publica a carga (dict) no exchange com a routing key (chave_rota)."""
        if not self.troca:
            raise RuntimeError("RabbitMQ não conectado")
        corpo = json.dumps(carga).encode()
        mensagem = Message(
            corpo,
            delivery_mode=DeliveryMode.PERSISTENT,
            content_type="application/json",
        )
        await self.troca.publish(mensagem, chave_rota)
        self.logger.debug("Mensagem publicada na routing key {RoutingKey}", chave_rota)

    async def fechar(self):
        """Fecha canal e conexão com segurança."""
        try:
            if self.canal and not self.canal.is_closed:
                await self.canal.close()
        except Exception:
            pass
        try:
            if self.conexao and not self.conexao.is_closed:
                await self.conexao.close()
        except Exception:
            pass

    async def health_check(self) -> bool:
        """Verifica se a conexão com RabbitMQ está ativa e saudável."""
        try:
            if self.conexao is None or self.conexao.is_closed:
                return False
            if self.canal is None or self.canal.is_closed:
                return False
            # Tenta declarar a exchange novamente para confirmar que o canal responde
            await self.canal.declare_exchange(
                self.nome_troca, ExchangeType.TOPIC, durable=True
            )
            return True
        except Exception as e:
            self.logger.warning("Health check do RabbitMQ falhou: {Erro}", str(e))
            return False
