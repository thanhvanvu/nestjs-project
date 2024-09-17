import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  hashPassword = (plainPassword: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(plainPassword, salt);
    return hash;
  };

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

  async register(registerUserDto: RegisterUserDto) {
    // check xem đã có người dùng này chưa
    const isExistUser = await this.userModel.findOne({
      email: registerUserDto.email,
    });

    if (isExistUser) {
      throw new BadRequestException(
        `Người dùng ${registerUserDto.email} đã tồn tại!`,
      );
    }

    const hashPassword = this.hashPassword(registerUserDto.password);

    let newRegisterUser = await this.userModel.create({
      ...registerUserDto,
      password: hashPassword,
      role: 'USER',
    });

    return newRegisterUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found';
    }

    return this.userModel.findOne({
      _id: id,
    });
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  isValidPassword(password: string, hash: string) {
    const isPasswordMatch = compareSync(password, hash); // true
    return isPasswordMatch;
  }

  update(updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found';
    }
    return this.userModel.softDelete({ _id: id });
  }
}
