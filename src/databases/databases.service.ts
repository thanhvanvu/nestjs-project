import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import {
  Permission,
  PermissionDocument,
} from 'src/permissions/schemas/permission.schemas';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    private configService: ConfigService,

    private userService: UsersService,
  ) {}
  async onModuleInit() {
    const isInit = Boolean(this.configService.get<string>('SHOULD_INIT'));

    if (isInit === true) {
      // khởi tạo data fake

      // check xem database có data chưa?
      const countUser = await this.userModel.countDocuments({});
      const countPermission = await this.permissionModel.countDocuments({});
      const countRole = await this.roleModel.countDocuments({});

      if (countUser > 0 && countRole > 0 && countPermission > 0) {
        this.logger.log('ALREADY INIT SAMPLE DATA...');
        return;
      }

      // create permissions 1st
      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }

      // 2nd create role
      if (countRole === 0) {
        // get all permissions
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin full quyền',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'Người dùng sử dụng hệ thống',
            isActive: true,
            permissions: [],
          },
        ]);
      }

      // 3rd create user
      if (countUser === 0) {
        const admindRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.roleModel.findOne({ name: USER_ROLE });
        const initPassword = this.configService.get<string>('INIT_PASSWORD');
        await this.userModel.insertMany([
          {
            name: 'I am admin',
            email: 'admin@gmail.com',
            password: this.userService.hashPassword(initPassword),
            age: 30,
            gender: 'MALE',
            address: 'USA',
            role: admindRole?._id,
          },
          {
            name: 'I am user',
            email: 'vvt4994@gmail.com',
            password: this.userService.hashPassword(initPassword),
            age: 30,
            gender: 'MALE',
            address: 'USA',
            role: userRole?._id,
          },
          {
            name: 'John Doe',
            email: 'johndoe123@example.com',
            password: this.userService.hashPassword(initPassword),
            age: 28,
            gender: 'MALE',
            address: 'Canada',
            role: userRole?._id,
          },
          {
            name: 'Jane Smith',
            email: 'janesmith456@example.com',
            password: this.userService.hashPassword(initPassword),
            age: 25,
            gender: 'FEMALE',
            address: 'Australia',
            role: userRole?._id,
          },
          {
            name: 'David Johnson',
            email: 'davidjohnson789@example.com',
            password: this.userService.hashPassword(initPassword),
            age: 35,
            gender: 'MALE',
            address: 'UK',
            role: userRole?._id,
          },
          {
            name: 'Emily Davis',
            email: 'emilydavis101@example.com',
            password: this.userService.hashPassword(initPassword),
            age: 22,
            gender: 'FEMALE',
            address: 'Germany',
            role: userRole?._id,
          },
          {
            name: 'Michael Brown',
            email: 'michaelbrown234@example.com',
            password: this.userService.hashPassword(initPassword),
            age: 31,
            gender: 'MALE',
            address: 'USA',
            role: userRole?._id,
          },
          {
            name: 'Sophia Wilson',
            email: 'sophiawilson567@example.com',
            password: this.userService.hashPassword(initPassword),
            age: 29,
            gender: 'FEMALE',
            address: 'France',
            role: userRole?._id,
          },
          {
            name: 'James Miller',
            email: 'jamesmiller890@example.com',
            password: this.userService.hashPassword(initPassword),
            age: 40,
            gender: 'MALE',
            address: 'New Zealand',
            role: userRole?._id,
          },
          {
            name: 'Olivia Martinez',
            email: 'oliviamartinez101@example.com',
            password: this.userService.hashPassword(initPassword),
            age: 26,
            gender: 'FEMALE',
            address: 'Mexico',
            role: userRole?._id,
          },
          {
            name: 'William Lee',
            email: 'williamlee234@example.com',
            password: this.userService.hashPassword(initPassword),
            age: 33,
            gender: 'MALE',
            address: 'South Korea',
            role: userRole?._id,
          },
          {
            name: 'Charlotte Kim',
            email: 'charlottekim567@example.com',
            password: this.userService.hashPassword(initPassword),
            age: 27,
            gender: 'FEMALE',
            address: 'Japan',
            role: userRole?._id,
          },
        ]);
      }
    }
  }
}
