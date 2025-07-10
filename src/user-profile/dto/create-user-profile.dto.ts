import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;

  @IsNotEmpty()
  @IsEnum(['single', 'married', 'divorced', 'widowed'])
  maritalStatus: string;
}
