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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ResponseMessage('Create a new role')
  @Post()
  handleCreateRole(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.createRole(createRoleDto, user);
  }

  @ResponseMessage('Get all roles with pagination')
  @Get()
  handleGetAllRoles(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.rolesService.getAllRoles(+current, +pageSize, queryString);
  }

  @ResponseMessage('Get role by id')
  @Get(':id')
  handleGetRoleById(@Param('id') id: string) {
    return this.rolesService.getRoleById(id);
  }

  @ResponseMessage('Update a role')
  @Patch(':id')
  handleUpdateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,
  ) {
    return this.rolesService.updateRole(id, updateRoleDto, user);
  }

  @ResponseMessage('Delete a role')
  @Delete(':id')
  handleDeleteRole(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.deleteRole(id, user);
  }
}
