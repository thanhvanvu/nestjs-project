import { IsEmail, IsNotEmpty } from 'class-validator';

// DTO: Data Transfer Object
export class CreateUserDto {
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

  @IsNotEmpty()
  password: string;

  name: string;
  address: string;
}
