import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsAlpha, IsAlphanumeric, IsEmail, IsNotEmpty, IsNumberString, IsUrl } from 'class-validator';

export interface MainApi {
    role: string;
    name: string;
    pid: any;
    imageUrl: string;
    tel: string;
    email: string;
}

@Schema()
export class MainApi extends Document {
    @Prop({ required: true })
    @IsAlpha()
    @IsNotEmpty()
    name: string;

    @Prop({ required: true })
    @IsAlphanumeric()
    role: string;

    @Prop({ required: true })
    @IsEmail()
    email: string;

    @Prop({ required: true })
    @IsNumberString()
    tel: string;

    @IsUrl()
    @Prop({ required: true })
    imageUrl: string;

    @Prop({ type: { type: Types.ObjectId, ref: 'mainApi' } })
    pid: any;

}

export const MainApiSchema = SchemaFactory.createForClass(MainApi);
