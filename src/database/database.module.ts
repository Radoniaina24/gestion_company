import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [MongooseModule.forRoot(`mongodb://localhost/gate_company`)],
})
export class DatabaseModule {}
