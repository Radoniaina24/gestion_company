import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProfile, UserProfileSchema } from './schemas/user-profile.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [UserProfileService],
  controllers: [UserProfileController],
  exports: [UserProfileService],
})
export class UserProfileModule {}
