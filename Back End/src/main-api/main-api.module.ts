import { MainApiSchema, MainApi } from './main-api.schema';
import { Module } from '@nestjs/common';
import { MainApiService } from './main-api.service';
import { MainApiController } from './main-api.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule
      .forFeature(
        [
          {
            name: MainApi.name,
            schema: MainApiSchema
          }
        ]
      ),
  ], providers: [MainApiService],
  controllers: [MainApiController]
})
export class MainApiModule { }
