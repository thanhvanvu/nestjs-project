import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }
  hashPassword = (plainPassword: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(plainPassword, salt);
    return hash;
  };

  // async createUser(email: string, password: string, name: string) {
  //   // hash password
  //   const hashPassword = this.hashPassword(password);
  //   const user = await this.userModel.create({
  //     email,
  //     password: hashPassword,
  //     name,
  //   });

  //   return user;
  // }

  createUser(createUserDto: CreateUserDto) {
    // hash password
    const hashPassword = this.hashPassword(createUserDto.password);
    const user = this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
    });

    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
