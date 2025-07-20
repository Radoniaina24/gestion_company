import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  Min,
  Max,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  COMPLETED = 'completed',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  @IsArray()
  @ArrayNotEmpty({ message: 'La liste des responsables est requise' })
  responsible: Types.ObjectId[];

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'La tâche est requise' })
  title: string;

  @Prop({ required: true })
  @IsString()
  description: string;

  @Prop({ type: Date, required: true })
  @IsDate()
  startDate: Date;

  @Prop({ type: Date, required: true })
  @IsDate()
  endDate: Date;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.NOT_STARTED })
  @IsEnum(TaskStatus, { message: 'Statut invalide' })
  status: TaskStatus;

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @Prop({ type: String })
  @IsOptional()
  @IsString()
  remarks?: string;
}
export const TaskSchema = SchemaFactory.createForClass(Task);
