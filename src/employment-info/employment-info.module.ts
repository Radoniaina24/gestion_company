import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmploymentInfo,
  EmploymentInfoSchema,
} from './schemas/employment-info.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { EmploymentInfoService } from './employment-info.service';
import { EmploymentInfoController } from './employment-info.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmploymentInfo.name, schema: EmploymentInfoSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [EmploymentInfoController],
  providers: [EmploymentInfoService],
})
export class EmploymentInfoModule {}
