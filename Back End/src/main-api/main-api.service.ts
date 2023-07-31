import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {MainApi} from "./main-api.schema";
import {Model} from "mongoose";

@Injectable()
export class MainApiService {
    constructor(
        @InjectModel(MainApi.name)
        private mainApiModel: Model<MainApi>
    ) {
    }

    async findAll(): Promise<MainApi[]> {
        return await this.mainApiModel.find().exec();
    }

    async findOne(id: string): Promise<MainApi> {
        return await this.mainApiModel.findById(id).exec();
    }

    async create(employee: MainApi): Promise<MainApi> {
        const createdEmp = new this.mainApiModel(employee);
        return await createdEmp.save();
    }

    async update(id: string, employee: MainApi): Promise<MainApi> {
        return await this.mainApiModel
            .findByIdAndUpdate(id, employee, {new: true})
            .exec();
    }

    async delete(id: string): Promise<MainApi> {
        const data = await this.mainApiModel.findById(id);
        await this.mainApiModel.deleteMany({pid: data._id});
        return await this.mainApiModel.findByIdAndDelete(id);
    }

    async addChildToParent(parentFullName: string, employee: MainApi) {
        const parent = await this.mainApiModel.find({name: parentFullName});
        const parentId = parent[0]._id;
        const createdChild = new this.mainApiModel(employee);
        return (await createdChild.save()).updateOne({$set: {pid: parentId}});
    }

    async getIdByName(name: string) {
        const employee = await this.mainApiModel.findOne({name: name});
        if (employee) {
            return employee._id;
        } else {
            return null;
        }
    }

    async getEmployeeByRole(role: string): Promise<MainApi[]> {
        return await this.mainApiModel.find({role: role}).select("name -_id");
    }

    async updateEmployee(id: string, employee: MainApi) {
        /**
         * role: string;
         * name: string;
         * pid: any;
         * imageUrl: string;
         * tel: string;
         * email: string;
         * */
        console.log('abcdefg')

        const value =  await this.mainApiModel.updateOne({_id: id},
            {
                // role: employee.role,
                name: employee.name,
                imageUrl: employee.imageUrl,
                tel: employee.tel,
                email: employee.email
            }
        );
        console.log(value);
        return value;
    }
}
