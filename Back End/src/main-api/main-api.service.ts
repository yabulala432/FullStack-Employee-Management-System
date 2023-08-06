import { Employee } from "./../employee/employee.schema";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MainApi } from "./main-api.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class MainApiService {
  constructor(
    @InjectModel(MainApi.name)
    private mainApiModel: Model<MainApi>
  ) {}

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
      .findByIdAndUpdate(id, employee, { new: true })
      .exec();
  }

  private async findAllByParentName(parentName: string): Promise<MainApi[]> {
    const parent: MainApi = await this.mainApiModel
      .findOne({ name: parentName })
      .exec();
    if (!parent) return null;
    const pid = parent.pid;
    return await this.mainApiModel.find({ pid }).exec();
    // return employees;
  }

  private async delete(id: string): Promise<MainApi> {
    return await this.mainApiModel.findByIdAndDelete(id).exec();
  }

  async deleteOnlyChild(id: string): Promise<MainApi> {
    const employeeToDelete = await this.findOne(id);
    if (!employeeToDelete) {
      return null;
    }
    const children = await this.childOf(employeeToDelete.name);
    if (children.length > 0) {
      throw new HttpException(
        `Cannot delete employee
             ${employeeToDelete} because ${employeeToDelete} has 
             ${children.length + 1} children !!!`,
        HttpStatus.BAD_REQUEST
      );
    } else {
      console.log(children);
    }

    const isDeleted = await this.delete(id);
    console.log(isDeleted);
    return isDeleted;
  }

  async addChildToParent(
    parentName: string,
    employee: MainApi
  ): Promise<MainApi> {
    const parent = await this.mainApiModel.find({ name: parentName }).exec();
    const parentId = parent[0]._id;
    const createdChild = new this.mainApiModel(employee);
    return (await createdChild.save())
      .updateOne({ $set: { pid: parentId } })
      .exec();
  }

  async updateParent(
    employeeName: string,
    parentName: string
  ): Promise<MainApi> {
    const parent = await this.mainApiModel.find({ name: parentName }).exec();
    const child = await this.mainApiModel.find({ name: employeeName }).exec();
    if (parent && child) {
      const parentId = parent[0]._id;
      const childId = child[0]?._id;
      return await this.mainApiModel.findByIdAndUpdate(childId, {
        $set: { pid: parentId },
      });
    } else {
      return;
    }
  }

  async getIdByName(name: string) {
    const employee = await this.mainApiModel.findOne({ name: name }).exec();
    if (employee) {
      return employee._id;
    } else {
      return null;
    }
  }

  async getEmployeeByRole(role: string): Promise<MainApi[]> {
    return await this.mainApiModel
      .find({ role: role })
      .select("name -_id")
      .exec();
  }

  async updateEmployee(
    id: string,
    updateData: Partial<MainApi>
  ): Promise<MainApi> {
    const employee: MainApi = await this.mainApiModel.findById(id).exec();
    if (!employee) {
      return null;
    }
    console.log(updateData?.name);
    if (updateData?.name) {
      employee.name = updateData?.name;
    }
    if (updateData?.role) {
      employee.role = updateData?.role;
    }
    if (updateData?.email) {
      employee.email = updateData?.email;
    }
    if (updateData?.tel) {
      employee.tel = updateData?.tel;
    }
    if (updateData?.imageUrl) {
      employee.imageUrl = updateData?.imageUrl;
    }
    await employee.save();
    return employee.toObject();
  }

  private async findByName(name: string): Promise<MainApi[]> {
    return await this.mainApiModel.find({ name: name }).exec();
  }

  async childOf(parentName: string): Promise<MainApi[]> {
    const [parent, ...rest] = await this.findByName(parentName);
    return await this.mainApiModel.find({ pid: parent._id }).exec();
  }

  async findUpperEmployees(employeeId: string): Promise<MainApi[]> {
    const result = await this.mainApiModel.aggregate([
      {
        $match: {
          _id: Types.ObjectId.createFromHexString(employeeId),
        },
      },
      {
        $graphLookup: {
          from: "mainapis",
          startWith: "$pid",
          connectFromField: "pid",
          connectToField: "_id",
          as: "ancestors",
          maxDepth: 10,
        },
      },
      {
        $unwind: {
          path: "$ancestors",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "ancestors._id": {
            $ne: Types.ObjectId.createFromHexString(employeeId),
          },
        },
      },
    ]);

    const upperEmployees = result.map((employee) => employee.ancestors);
    return upperEmployees;
  }

  async descendants(employeeId: string): Promise<MainApi[]> {
    const result = await this.mainApiModel.aggregate([
      {
        $match: {
          _id: Types.ObjectId.createFromHexString(employeeId),
        },
      },
      {
        $graphLookup: {
          from: "mainapis",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "pid",
          as: "descendants",
          maxDepth: 10,
        },
      },
      {
        $unwind: {
          path: "$descendants",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "descendants._id": {
            $ne: Types.ObjectId.createFromHexString(employeeId),
          },
        },
      },
    ]);

    const descendants = result.map((employee) => employee.descendants);
    return descendants;
  }

  async findAllExcludingDescendants(employeeId: string): Promise<MainApi[]> {
    const allEmployees = await this.mainApiModel.find().exec();
    const descendants = await this.descendants(employeeId);

    const employeesExcludingDescendants = allEmployees.filter(
      (employee) =>
        !descendants.some((descendant) => descendant?._id.equals(employee?._id))
    );

    return employeesExcludingDescendants;
  }
}
