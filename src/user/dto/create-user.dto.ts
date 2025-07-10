import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @IsEnum(['manager', 'admin', 'employee'], { message: 'Rôle invalide' })
  role: 'manager' | 'admin' | 'employee';
}
