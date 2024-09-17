import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';

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

  isValidPassword(password: string, hash: string) {
    const isPasswordMatch = compareSync(password, hash); // true
    return isPasswordMatch;
  }

  async createUser(createUserDto: CreateUserDto, user: IUser) {
    const { name, email, password, age, gender, address, role, company } =
      createUserDto;
    // check xem đã có người dùng này chưa
    const isExistUser = await this.userModel.findOne({
      email,
    });

    if (isExistUser) {
      throw new BadRequestException(`Người dùng ${email} đã tồn tại!`);
    }

    // hash password
    const hashPassword = this.hashPassword(createUserDto.password);
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newUser?._id,
      createdAt: newUser.createdAt,
    };
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

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(updateUserDto._id)) {
      throw new BadRequestException(`Người dùng không tồn tại!`);
    }

    return this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found';
    }
    return this.userModel.softDelete({ _id: id });
  }
}
