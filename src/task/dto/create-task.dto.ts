import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ArrayNotEmpty,
} from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @IsArray()
  @ArrayNotEmpty({
    message: 'La liste des responsables ne peut pas être vide.',
  })
  @IsMongoId({ each: true, message: 'Responsable invalide.' })
  responsible: string[];

  @IsString()
  @IsNotEmpty({ message: 'La tâche est obligatoire.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La description est obligatoire.' })
  description: string;

  @IsDateString({}, { message: 'La date de début doit être une date valide.' })
  startDate: string;

  @IsDateString({}, { message: 'La date de fin doit être une date valide.' })
  endDate: string;

  @IsEnum(TaskStatus, { message: 'Statut invalide.' })
  @IsOptional()
  status?: TaskStatus;

  @IsNumber()
  @Min(0, { message: 'Le pourcentage doit être au minimum 0%.' })
  @Max(100, { message: 'Le pourcentage doit être au maximum 100%.' })
  @IsOptional()
  percentage?: number;

  @IsString()
  @IsOptional()
  remarks?: string;
}
