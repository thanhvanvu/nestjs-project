import { IsEmail, IsNotEmpty } from 'class-validator';

// DTO: Data Transfer Object
export class CreateCompanyDto {
  @IsNotEmpty({
    message: 'Tên công ty không được để trống!',
  })
  name: string;

  @IsNotEmpty({
    message: 'Địa chỉ không được để trống!',
  })
  address: string;

  @IsNotEmpty({
    message: 'Thông tin không được để trống!',
  })
  description: string;

  logo: string;
}
