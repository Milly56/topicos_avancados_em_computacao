
export class RegisterDto {
  email!: string;
  password!: string;
  role!: 'PACIENTE' | 'PROFISSIONAL' | 'ADMIN';
}