import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type EmploymentInfoDocument = EmploymentInfo & Document;

@Schema({ timestamps: true })
export class EmploymentInfo {
  @Prop({ required: true })
  positionTitle: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  managerName: string;

  @Prop({ required: true })
  hireDate: Date;

  @Prop({
    required: true,
    enum: ['CDI', 'CDD', 'Stage', 'Freelance', 'Consultant'],
    default: 'CDI',
  })
  contractType: string;

  @Prop({ required: true })
  workLocation: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: User;
}

export const EmploymentInfoSchema =
  SchemaFactory.createForClass(EmploymentInfo);
