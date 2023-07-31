import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EmployeeRolesService } from "./employee-roles.service";
import { EmployeeRoles } from "./employee-roles.schema";

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
  @Get("/findRole/:role")
  async getRoleInfo(@Param("role") role: string) {
    return await this.empRoleService.getByRole(role);
  }
}
