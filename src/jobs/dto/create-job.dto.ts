import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class CompanyDto {
  @IsNotEmpty({
    message: 'Id công ty không được để trống!',
  })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'Tên công ty không được để trống!',
  })
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({
    message: 'name không được để trống!',
  })
  name: string;

  @IsNotEmpty({
    message: 'skills không được để trống!',
  })
  @IsArray({ message: 'skills có định dạng là array' })
  @IsString({ each: true, message: 'skill định dạng là string' })
  skills: string[];

  // validate 1 object
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;

  @IsNotEmpty({
    message: 'location không được để trống!',
  })
  location: string;

  @IsNotEmpty({
    message: 'salary không được để trống!',
  })
  salary: number;

  @IsNotEmpty({
    message: 'quantity không được để trống!',
  })
  quantity: number;

  @IsNotEmpty({
    message: 'level không được để trống!',
  })
  level: string;

  @IsNotEmpty({
    message: 'description không được để trống!',
  })
  description: string;

  @IsNotEmpty({
    message: 'startDate không được để trống!',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'startDate có định dạng Date' })
  startDate: Date;

  @IsNotEmpty({
    message: 'endDate không được để trống!',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'endDate có định dạng Date' })
  endDate: Date;

  @IsNotEmpty({
    message: 'isActive không được để trống!',
  })
  isActive: boolean;
}
