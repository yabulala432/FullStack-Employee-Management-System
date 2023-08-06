import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EmployeeRolesService } from "./employee-roles.service";
import { EmployeeRoles } from "./employee-roles.schema";
import { UpdateWriteOpResult } from "mongoose";

@Controller("employee-roles")
export class EmployeeRolesController {
  constructor(private readonly empRoleService: EmployeeRolesService) {}

  @Get("/getAllRoles")
  async getAll() {
    return await this.empRoleService.findAllRoles();
  }

  @Post("/add")
  async addRole(@Body() empRole: EmployeeRoles): Promise<EmployeeRoles> {
    return await this.empRoleService.addRoles(empRole);
  }
  @Get("/findByRole/:role")
  async getRoleInfo(@Param("role") role: string) {
    return await this.empRoleService.getByRole(role);
  }

  @Post('/pushToRole/:role')
  async pushToRole(@Param("role") role: string, @Body() empRole: Partial<EmployeeRoles>):Promise<UpdateWriteOpResult>{
    return await this.empRoleService.pushParentForRole(role,empRole);
  }

  @Post('/deleteFromRole/:role')
  async deleteRole(@Param("role") role: string, @Body() empRole: Partial<EmployeeRoles>):Promise<UpdateWriteOpResult>{
      return await this.empRoleService.deleteParentFromRole(role,empRole);
    }
}
