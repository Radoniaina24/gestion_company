import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UserIdMiddleware } from './middlewares/user-id.middleware';
import { EmploymentInfoModule } from './employment-info/employment-info.module';
import { TaskModule } from './task/task.module';
import { DepartmentModule } from './department/department.module';
import { ServiceModule } from './service/service.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    UserProfileModule,
    EmploymentInfoModule,
    TaskModule,
    DepartmentModule,
    ServiceModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdMiddleware)
      .forRoutes(
        { path: 'user-profiles/me', method: RequestMethod.ALL },
        { path: 'user-profiles', method: RequestMethod.ALL },
        { path: 'user-profiles/update/me', method: RequestMethod.PATCH },
        { path: 'employment-info/me', method: RequestMethod.ALL },
        { path: 'tasks', method: RequestMethod.ALL },
        { path: 'tasks/:id', method: RequestMethod.ALL },
      );
  }
}
