import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema()
export class Department {
  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop()
  description?: string;
}
export const DepartmentSchema = SchemaFactory.createForClass(Department);

DepartmentSchema.index({ name: 1 }, { unique: true });
