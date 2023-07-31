import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Employee} from './employee.schema';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    ) {
    }

    async createEmployee(employeeData: Employee): Promise<Employee> {
        const createdEmployee = new this.employeeModel(employeeData);
        return createdEmployee.save();
    }

    async addEmployeeTo(employeeId: string, parentId: string): Promise<Employee> {
        const parent = await this.employeeModel.findById(parentId).exec();
        const child = await this.employeeModel.findById(employeeId).exec();

        if (parent && child) {
            this.employeeModel.updateOne(
                {_id: parentId},
                {
                    $push: {children: employeeId}
                }
            ).exec().then((response) => {
                console.log(response)
            }).catch((err) => {
                console.log(err)
            })
            console.log({parent});
        } else {
            console.log('no no no sui');
        }
        return parent;
    }

    async getEmployee(_id: string) {
        const queryData: string = _id.substring(_id.indexOf(":") + 1)
        const empData = await this.employeeModel.find({_id: queryData}).exec()
        console.log(empData);
        return empData;
    }

    async getAll() {
        const allData = await this.employeeModel.find().exec();
        return (allData);
    }

    async populateChildren(employee) {
        const currentEmp = await this.employeeModel.findOne({role: employee.role}).exec();
        console.log({currentEmp})
        if (currentEmp) {
            if (currentEmp.children.length === 0) {
                return currentEmp;
            } else {
                const populatedChildren = await this.employeeModel.populate(currentEmp, {path: 'children'});
                console.log({populatedChildren})
                populatedChildren.children = await Promise.all(populatedChildren.children
                    .map((child) => this.populateChildren(child))
                );
                return populatedChildren
            }
        }

    }

    async populatedChildren() {
        const ceo = await this.employeeModel.findOne({role: 'CEO'}).exec();
        // console.log(ceo);
        return await this.populateChildren(ceo);
    }
}
