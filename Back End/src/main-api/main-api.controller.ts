import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put} from '@nestjs/common';
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
        const isDeleted = await this.mainApiService.deleteOnlyChild(id);
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
    async updateEmployee(@Param('id') id:string, @Body() employee:Partial<MainApi>):Promise<MainApi>{
        return await this.mainApiService.updateEmployee(id,employee);
    }

    @Get('/childOf/:parentName')
    async childrenOf(@Param('parentName') parentName:string):Promise<MainApi[]>{
        return this.mainApiService.childOf(parentName)
    }

    @Get('/findOnlyUpperEmployees/:id')
    async findUpperEmployees(@Param('id') id:string):Promise<MainApi[]>{
        return await this.mainApiService.findUpperEmployees(id);
    }

    @Get('descendants/:id')
    async descendants(@Param('id') id:string):Promise<MainApi[]>{
        return this.mainApiService.descendants(id);
    }

    @Get('/findExcludingDescendants/:id')
    async findAllExcludingDescendants(@Param('id') id:string):Promise<MainApi[]>{
        return await this.mainApiService.findAllExcludingDescendants(id);
    }

    @Put('/updateParentOf/:childId/:parentId')
    async updateParentOf(@Param('childId') childId:string, @Param('parentId') parentId:string):Promise<MainApi>{
        return await this.mainApiService.updateParent(childId,parentId);
    }
    
}
