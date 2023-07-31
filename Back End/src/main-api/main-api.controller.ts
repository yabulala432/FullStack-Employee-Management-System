import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MainApi } from './main-api.schema';
import { MainApiService } from './main-api.service';

@Controller('main-api')
export class MainApiController {
    constructor(private readonly mainApiService: MainApiService) { }

    @Get('/findById/:id')
    async findOne(@Param('id') id: string): Promise<MainApi> {
        return await this.mainApiService.findOne(id);
    }

    @Get('/getAll')
    async findAll():Promise<MainApi[]> {
        return await this.mainApiService.findAll();
    }

    @Post('/add')
    async create(@Body() employee: MainApi): Promise<MainApi> {
        return await this.mainApiService.create(employee);
    }

    @Put('/update/:id')
    async update(@Param('id') id: string, @Body() employee: MainApi): Promise<MainApi> {
        return this.mainApiService.update(id, employee);
    }

    @Delete('/delete/:id')
    async delete(@Param('id') id: string):Promise<MainApi> {
        const isDeleted = await this.mainApiService.delete(id);
        console.log(isDeleted);
        return isDeleted;
    }

    @Post('addChildOn/:parentName')
    async addChildOn(@Param('parentName') parentName: string, @Body() employee: MainApi) {
        return await this.mainApiService.addChildToParent(parentName, employee);
    }

    @Get('/findIdFromName/:name')
    async getIdFromName(@Param('name') name: string) {
        return await this.mainApiService.getIdByName(name);
    }

    @Get('findByRole/:role')
    async findEmpNamesByRole(@Param('role') role:string) {
        return await this.mainApiService.getEmployeeByRole(role);
    }

    @Put('/update/:id')
    async updateEmployee(@Param('id') id:string, @Body() employee:MainApi){
        console.log('a')
        return this.mainApiService.updateEmployee(id,employee);
    }

}
