import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmploymentInfoDto {
  @IsNotEmpty()
  @IsString()
  positionTitle: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsDateString()
  hireDate: Date;

  @IsNotEmpty()
  @IsEnum(['CDI', 'CDD', 'Stage', 'Freelance', 'Consultant'])
  contractType: string;

  @IsNotEmpty()
  @IsString()
  workLocation: string;
}
