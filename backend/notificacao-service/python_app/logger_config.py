import json
import os
import sys

from pyserilog import LoggerConfiguration
from pyserilog.core.ilog_event_enricher import ILogEventEnricher
from pyserilog.core.ilog_event_property_factory import ILogEventPropertyFactory
from pyserilog.core.ilog_event_sink import ILogEventSink
from pyserilog.core.string_writable import StringIOWriteable
from pyserilog.events.dictionary_value import DictionaryValue
from pyserilog.events.event_property import EventProperty
from pyserilog.events.log_event import LogEvent
from pyserilog.events.log_event_level import LogEventLevel
from pyserilog.events.scalar_value import ScalarValue
from pyserilog.events.sequence_value import SequenceValue
from pyserilog.events.structure_value import StructureValue


class CompleteJsonFormatter:
    """Formatter que serializa o log event em JSON completo."""

    def format(self, log_event: LogEvent, output: StringIOWriteable):
        data = {
            "timestamp": log_event.timestamp.isoformat(),
            "level": str(log_event.level).split(".")[-1],
            "message_template": log_event.message_template.text,
        }

        if log_event.properties:
            data["properties"] = self._serialize_properties(log_event.properties)

        if log_event.exception:
            data["exception"] = str(log_event.exception)

        output.write(json.dumps(data, ensure_ascii=False))

    def _serialize_properties(self, properties: dict):
        result = {}
        for name, value in properties.items():
            result[name] = self._serialize_value(value)
        return result

    def _serialize_value(self, value):
        if isinstance(value, ScalarValue):
            return value.value
        if isinstance(value, StructureValue):
            return {p.name: self._serialize_value(p.value) for p in value.properties}
        if isinstance(value, SequenceValue):
            return [self._serialize_value(v) for v in value.elements]
        if isinstance(value, DictionaryValue):
            return {
                self._serialize_value(k): self._serialize_value(v)
                for k, v in value.elements
            }
        return str(value)


class ConsoleSink(ILogEventSink):
    """Sink que escreve logs formatados em JSON no stdout."""

    def __init__(self, formatter: CompleteJsonFormatter = None, output_stream=None):
        self._formatter = formatter or CompleteJsonFormatter()
        self._output = output_stream or sys.stdout

    def emit(self, log_event: LogEvent):
        writer = StringIOWriteable()
        self._formatter.format(log_event, writer)
        self._output.write(writer.getvalue())
        self._output.write("\n")
        self._output.flush()


class ServiceEnricher(ILogEventEnricher):
    """Enricher que adiciona informações do serviço aos logs."""

    def __init__(self, service_name: str, environment: str = None):
        self._service_name = service_name
        self._environment = environment or os.getenv("ENVIRONMENT", "development")

    def enrich(self, log_event: LogEvent, property_factory: ILogEventPropertyFactory):
        log_event.add_or_update_property(
            EventProperty(
                "service", property_factory.create_property_value(self._service_name)
            )
        )
        log_event.add_or_update_property(
            EventProperty(
                "environment", property_factory.create_property_value(self._environment)
            )
        )


def setup_logger(service_name: str = "notificacao-service"):
    """Configura o logger do pyserilog com saída JSON e enriquecimento de contexto."""
    log_level_str = os.getenv("LOG_LEVEL", "INFO").upper()
    level_map = {
        "VERBOSE": LogEventLevel.VERBOSE,
        "DEBUG": LogEventLevel.DEBUG,
        "INFO": LogEventLevel.INFORMATION,
        "INFORMATION": LogEventLevel.INFORMATION,
        "WARNING": LogEventLevel.WARNING,
        "WARN": LogEventLevel.WARNING,
        "ERROR": LogEventLevel.ERROR,
        "FATAL": LogEventLevel.FATAL,
    }
    level = level_map.get(log_level_str, LogEventLevel.INFORMATION)

    logger = (
        LoggerConfiguration()
        .minimum_level.level_is(level)
        .enrich.with_enrichers(ServiceEnricher(service_name=service_name))
        .write_to.sink(ConsoleSink())
        .create_logger()
    )
    return logger
