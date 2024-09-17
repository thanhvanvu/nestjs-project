import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class CompanyDto {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

// DTO: Data Transfer Object
export class CreateUserDto {
  @IsNotEmpty({
    message: 'Tên không được để trống!',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'Email phải đúng định dạng!',
    },
  )
  @IsNotEmpty({
    message: 'Email không được để trống!',
  })
  email: string;

  @IsNotEmpty({
    message: 'Mật khẩu không được để trống!',
  })
  password: string;

  @IsNotEmpty({
    message: 'Tuổi không được để trống!',
  })
  age: number;

  @IsNotEmpty({
    message: 'Giới tính không được để trống!',
  })
  gender: string;

  address: string;

  @IsNotEmpty({
    message: 'Role không được để trống!',
  })
  role: string;

  // validate 1 object
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
}

export class RegisterUserDto {
  @IsNotEmpty({
    message: 'Tên không được để trống!',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'Email phải đúng định dạng!',
    },
  )
  @IsNotEmpty({
    message: 'Email không được để trống!',
  })
  email: string;

  @IsNotEmpty({
    message: 'Mật khẩu không được để trống!',
  })
  password: string;

  @IsNotEmpty({
    message: 'Tuổi không được để trống!',
  })
  age: number;

  @IsNotEmpty({
    message: 'Giới tính không được để trống!',
  })
  gender: string;

  address: string;
}
