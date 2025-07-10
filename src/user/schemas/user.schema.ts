// src/user/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false, // ne pas renvoyer le mot de passe par défaut
  })
  password: string;

  @Prop({
    type: String,
    enum: ['manager', 'admin', 'employee'],
    required: true,
  })
  role: 'manager' | 'admin' | 'employee';
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
