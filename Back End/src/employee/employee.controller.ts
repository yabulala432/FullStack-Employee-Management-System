import {Controller, Get, Post, Body, Param} from '@nestjs/common';
import {Employee} from './employee.schema';
import {EmployeeService} from './employee.service';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {
    }

    @Get('/getById/:_id')
    async getEmployee(@Param('_id') id: string)/*: Promise<Employee> */ {
        const value = await this.employeeService.getEmployee(id);
        // console.log(value);
        return value;
    }

    @Get('getRaw')
    async getAll() {
        const allData = await this.employeeService.getAll();
        // console.log(allData);
        return allData;
    }

    @Post('send')
    async createEmployee(@Body() employeeData: Employee): Promise<Employee> {
        const value = await this.employeeService.createEmployee(employeeData);
        if (value) {
            return value;
        } else {
            return null;
        }
    }

    // @Post('/:parentId/:employeeId')
    // async addEmployeeTo(
    //     @Param('parentId') parentId:string,
    //     @Param('employeeId') employeeId: string
    //     ): Promise<Employee> {
    //     const val = await this.employeeService.addEmployeeTo(employeeId, parentId);
    //     return val;
    // }

    @Post('addTo/:childId/:parentId')
    async addEmployeeTo(
        @Param('childId') childId: string,
        @Param('parentId') parentId: string
    ) {
        console.log({childId}, {parentId})
        const value = await this.employeeService.addEmployeeTo(parentId, childId);
        console.log(value)
        return value;
    };

    @Get('getPopulated')
    async allDataAsOne() {
        const allData = await this.employeeService.populatedChildren();
        return allData;
    }
}