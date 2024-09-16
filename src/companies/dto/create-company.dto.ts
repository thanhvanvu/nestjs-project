import { IsEmail, IsNotEmpty } from 'class-validator';

// DTO: Data Transfer Object
export class CreateCompanyDto {
  @IsNotEmpty({
    message: 'Email không được để trống!',
  })
  email: string;

  @IsNotEmpty({
    message: 'Địa chỉ không được để trống!',
  })
  address: string;

  @IsNotEmpty({
    message: 'Thông tin không được để trống!',
  })
  description: string;
}
