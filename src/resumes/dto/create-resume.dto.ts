import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

// DTO: Data Transfer Object
export class CreateResumeDto {
  @IsNotEmpty({
    message: 'Email không được để trống!',
  })
  email: string;

  @IsNotEmpty({
    message: 'User Id không được để trống!',
  })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'Url không được để trống!',
  })
  url: string;

  @IsNotEmpty({
    message: 'Status không được để trống!',
  })
  status: string;

  @IsNotEmpty({
    message: 'Company Id không được để trống!',
  })
  company: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'Job Id không được để trống!',
  })
  job: mongoose.Schema.Types.ObjectId;
}

export class CreateUserResumeDto {
  @IsNotEmpty({
    message: 'Url không được để trống!',
  })
  url: string;

  @IsNotEmpty({
    message: 'Company Id không được để trống!',
  })
  company: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'Job Id không được để trống!',
  })
  job: mongoose.Schema.Types.ObjectId;
}
