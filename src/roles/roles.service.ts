import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto, user: IUser) {
    const isExistRole = await this.roleModel.findOne({
      name: createRoleDto.name,
    });

    if (isExistRole) {
      throw new BadRequestException('Role đã tồn tại!');
    }

    const newRole = await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newRole._id,
      createdAt: newRole.createdAt,
    };
  }

  async getAllRoles(current: number, pageSize: number, queryString: string) {
    const { filter, projection, population } = aqp(queryString);

    let { sort } = aqp(queryString);

    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = '-updatedAt';
    }
    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
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

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id is not valid');
    }

    return await this.roleModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
