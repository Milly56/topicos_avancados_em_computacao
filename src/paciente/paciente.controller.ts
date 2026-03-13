import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { Paciente } from './paciente.interface';
import { CreatePacienteDto } from './create-paciente.dto';

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Get()
  findAll(): Paciente[] {
    return this.pacienteService.findAll();
  }
                                                                         
  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto): Paciente {
    return this.pacienteService.create(createPacienteDto);
  }

  @Get(':id')
  findById(@Param('id') id: string): Paciente {
    return this.pacienteService.findById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    return this.pacienteService.delete(id);
  }
}