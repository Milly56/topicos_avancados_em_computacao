// Interface para um gateway de pagamento externo
export interface IPagamentoGateway {
  processarPagamento(dados: { valor: number; metodo: string; referencia: string }): Promise<{ sucesso: boolean; mensagem?: string }>;
  // Outros métodos como estornar, consultar status no gateway, etc.
}