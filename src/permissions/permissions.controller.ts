import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ResponseMessage('Create a new permission')
  @Post()
  hanleCreatePermission(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.createPermission(createPermissionDto, user);
  }

  @ResponseMessage('Get all permissions with pagination')
  @Get()
  handleGetAllPermissions(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.permissionsService.getAllPermissions(
      +current,
      +pageSize,
      queryString,
    );
  }

  @ResponseMessage('Get permission by id')
  @Get(':id')
  handleGetPermissionById(@Param('id') id: string) {
    return this.permissionsService.getPermissionById(id);
  }

  @ResponseMessage('Update a permission')
  @Patch(':id')
  handleUpdatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.updatePermission(
      id,
      updatePermissionDto,
      user,
    );
  }

  @ResponseMessage('Delete a permission')
  @Delete(':id')
  handleDeletePermission(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.deletePermission(id, user);
  }
}
