import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema({ timestamps: true, collection: 'user_profiles' })
export class UserProfile extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
  @Prop({ required: [true, 'Le nom complet est requis.'], trim: true })
  fullName: string;

  @Prop({ required: [true, 'La date de naissance est requise.'] })
  dateOfBirth: Date;

  @Prop({ required: [true, 'L’adresse est requise.'], trim: true })
  address: string;

  @Prop({
    required: [true, 'Le numéro de téléphone est requis.'],
    trim: true,
    unique: true,
  })
  phoneNumber: string;

  @Prop({ required: [true, 'La nationalité est requise.'], trim: true })
  nationality: string;

  @Prop({
    required: [true, 'La situation familiale est requise.'],
    enum: ['single', 'married', 'divorced', 'widowed'],
    default: 'single',
  })
  maritalStatus: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
