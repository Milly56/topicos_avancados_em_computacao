from prometheus_client import CONTENT_TYPE_LATEST, Counter, generate_latest

# Contador de notificações enviadas, com label 'tipo' para discriminar o evento
NOTIFICACOES_ENVIADAS = Counter(
    "notificacoes_enviadas_total",
    "Total de notificações enviadas com sucesso",
    ["tipo"],
)


def incrementar_contador(tipo: str):
    """Incrementa o contador de notificações para o tipo informado."""
    NOTIFICACOES_ENVIADAS.labels(tipo=tipo).inc()


def metrics_response():
    """Retorna o conteúdo e o content-type das métricas no formato Prometheus."""
    return generate_latest(), CONTENT_TYPE_LATEST
