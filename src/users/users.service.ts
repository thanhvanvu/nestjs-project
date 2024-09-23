import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

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

  async findAllUserWithPagination(
    current: number,
    pageSize: number,
    queryString: string,
  ) {
    const { filter, projection, population } = aqp(queryString);
    let { sort } = aqp(queryString);

    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = '-updatedAt';
    }

    const result = await this.userModel
      .find(filter)
      .select('-password')
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findUserById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found';
    }

    return this.userModel
      .findOne({
        _id: id,
      })
      .select('-password')
      .populate({ path: 'role', select: { name: 1, _id: 1 } });
  }

  findOneByUsername(username: string) {
    return this.userModel
      .findOne({
        email: username,
      })
      .populate({ path: 'role', select: { name: 1, permissions: 1 } });
  }

  async updateUserById(updateUserDto: UpdateUserDto, user: IUser) {
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

  async removeUserById(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found';
    }

    const foundUser = await this.userModel.findOne({
      _id: id,
    });

    if (foundUser.email === 'admind@gmail.com') {
      throw new BadGatewayException('Không thể xóa admin!');
    }

    await this.userModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.userModel.softDelete({ _id: id });
  }

  updateUserToken = (refresh_token: string, _id: string) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException(`Người dùng không tồn tại!`);
    }

    return this.userModel.updateOne(
      { _id: _id },
      {
        refreshToken: refresh_token,
      },
    );
  };

  findUserByToken = async (refresh_token: string) => {
    return await this.userModel.findOne({
      refreshToken: refresh_token,
    });
  };
}
