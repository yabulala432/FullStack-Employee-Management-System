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
}
