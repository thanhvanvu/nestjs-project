import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// OmitType: picking all properties from an input type
// and then removing a particular set of keys (ex: ['password'])

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  _id: string;
}
