import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeModule } from './employee/employee.module';
import { MainApiModule } from './main-api/main-api.module';
import { EmployeeRolesModule } from './employee-roles/employee-roles.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nestDb'),
    MainApiModule,
    EmployeeModule,
    EmployeeRolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
