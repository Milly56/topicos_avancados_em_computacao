import { ApiProperty } from '@nestjs/swagger';

export class CreatePagamentoDto {

  @ApiProperty({ example: 200 })
  valor: number;

  @ApiProperty({ example: "PIX" })
  metodo: string;

  @ApiProperty({ example: "pago" })
  status: string;

}