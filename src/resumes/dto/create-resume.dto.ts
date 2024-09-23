import { IsMongoId, IsNotEmpty } from 'class-validator';
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
  @IsMongoId()
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
  @IsMongoId()
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'Job Id không được để trống!',
  })
  @IsMongoId()
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserResumeDto {
  @IsNotEmpty({
    message: 'Url không được để trống!',
  })
  url: string;

  @IsNotEmpty({
    message: 'Company Id không được để trống!',
  })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'Job Id không được để trống!',
  })
  jobId: mongoose.Schema.Types.ObjectId;
}
