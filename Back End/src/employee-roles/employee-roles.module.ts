import { Module } from "@nestjs/common";
import { EmployeeRolesController } from "./employee-roles.controller";
import { EmployeeRolesService } from "./employee-roles.service";
import { MongooseModule } from "@nestjs/mongoose";
import { EmployeeRoles, EmployeeRolesSchema } from "./employee-roles.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EmployeeRoles.name,
        schema: EmployeeRolesSchema,
      },
    ]),
  ],
  controllers: [EmployeeRolesController],
  providers: [EmployeeRolesService],
})
export class EmployeeRolesModule {}
