import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { IsAlpha, IsNotEmpty, IsUppercase } from "class-validator";
import { Document } from "mongoose";

export interface EmployeeRoles {
  role: string;
  worksUnder:string[];
}

@Schema()
export class EmployeeRoles extends Document {
  @Prop({ type: String, required: true })
  @IsAlpha()
  @IsNotEmpty()
  role: string;

  @Prop({ required: true, default: "CEO" })
  @IsAlpha()
  @IsNotEmpty()
  @IsUppercase()
  worksUnder: string[];
}

export const EmployeeRolesSchema = SchemaFactory.createForClass(EmployeeRoles);
