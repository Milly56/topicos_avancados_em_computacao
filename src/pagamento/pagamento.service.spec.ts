import { PagamentoService } from './pagamento.service';

describe('PagamentoService', () => {
  let service: PagamentoService;

  beforeEach(() => {
    service = new PagamentoService();
  });

  it('deve aprovar pagamento válido', async () => {
    const result = await service.processarPagamento(100, 'user123');

    expect(result.status).toBe('aprovado');
    expect(result.transactionId).toBeDefined();
  });

  it('deve rejeitar valor inválido', async () => {
    await expect(
      service.processarPagamento(0, 'user123'),
    ).rejects.toThrow('Valor inválido');
  });

  it('deve rejeitar usuário inválido', async () => {
    await expect(
      service.processarPagamento(100, ''),
    ).rejects.toThrow('Usuário não encontrado');
  });

  it('deve evitar pagamento duplicado', async () => {
    const first = await service.processarPagamento(100, 'user123');
    const second = await service.processarPagamento(100, 'user123');

    expect(second.status).toBe('duplicado');
    expect(second.transactionId).toBe(first.transactionId);
  });
});