import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class UpdatedBy {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  email: string;
}

class History {
  @IsNotEmpty()
  status: string;
  updatedAt: Date;
  updatedBy: UpdatedBy;
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @IsNotEmpty({ message: 'History không được để trống' })
  @IsArray({ message: 'History must be an array' })
  @ValidateNested()
  @Type(() => History)
  history: History[];
}

export class UpdateStatusResumeDto {
  status: string;
}
