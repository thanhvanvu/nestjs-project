import { Public, ResponseMessage, User } from './../decorator/customize';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create a new User!')
  create(
    @Body()
    createUserDto: CreateUserDto,
    @User() user: IUser,
  ) {
    // expressJS
    // const myEmail: string = req.body.email
    return this.usersService.createUser(createUserDto, user);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @ResponseMessage('Fetch user by id!')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @ResponseMessage('Update a User!')
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.updateUserById(updateUserDto, user);
  }

  @ResponseMessage('Delete a User!')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.removeUserById(id, user);
  }
}
