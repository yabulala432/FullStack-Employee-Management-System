import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeeRoles } from './employee-roles.schema';
import { Model } from 'mongoose';

@Injectable()
export class EmployeeRolesService {

    constructor(
        @InjectModel(EmployeeRoles.name)
        private employeeRoleModel: Model<EmployeeRoles>) {
    }

    async findAllRoles(): Promise<EmployeeRoles[]>{
        return await this.employeeRoleModel.find().exec();
    }

    async addRoles(role:EmployeeRoles): Promise<EmployeeRoles>{
        const createdRole = new this.employeeRoleModel(role);
        return await createdRole.save();
    }

    async getByRole(role: string) {
        return await this.employeeRoleModel.find({ role: role });
    }

    async pushParentForRole(role: string, data: Partial<EmployeeRoles>) {
        const value=data?.worksUnder;
        return await this.employeeRoleModel.updateOne({ role: role }, {$push:{worksUnder: value}});
    }

    async deleteParentFromRole(role:string,data: Partial<EmployeeRoles>) {
        const value = data?.worksUnder;
        return await this.employeeRoleModel.updateOne({ role: role }, {$pull:{worksUnder: value}});
    }

    async deleteRole(role: string) {
        return await this.employeeRoleModel.deleteOne({ role: role });
    }

}
