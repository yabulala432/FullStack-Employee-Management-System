import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {IsAlpha, IsAlphanumeric, IsEmail, IsNotEmpty, IsNumberString, IsUrl} from "class-validator";

export interface Employee {
    _id: string;
    name: string;
    role: string;
    email: string;
    tel: string;
    imageUrl: string;
    // children:[];
}

@Schema()
export class Employee extends Document {
    @Prop({required: true})
    @IsNumberString()
    _id: string;

    @Prop({required: true})
    @IsAlpha()
    @IsNotEmpty()
    name: string;

    @Prop({required: true})
    @IsAlphanumeric()
    role: string;

    @Prop({required: true})
    @IsEmail()
    email: string;

    @Prop({required: true})
    @IsNumberString()
    tel: string;

    @IsUrl()
    @Prop({required: true})
    imageUrl: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }]})
    children: Awaited<Document<unknown, {}, Employee> & Employee & Required<{ _id: string }>>[];
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);