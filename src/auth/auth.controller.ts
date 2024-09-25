import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private roleService: RolesService,
  ) {}

  @Public()
  @ResponseMessage('User Login')
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    // khi truy cập vô route /login
    // chạy qua auth.service thay vì app.service
    return this.authService.loginSuccess(req.user, response);
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  // fetchAccount chạy khi người dùng F5
  // khi mà truyền token lên header
  // code nó sẽ chạy ở jwt.strategy passport
  // NestJS sẽ tự động decode và lưu vô req.user
  @ResponseMessage('Fetch account with access token')
  @Get('/account')
  async handleFetchAccount(@User() user: IUser) {
    // user = {
    //  _id: '66f3f8e6f74bb1733851a5a5',
    //  name: 'I am user',
    //  email: 'vvt4994@gmail.com',
    //  role: { _id: '66f3f8e6f74bb1733851a5a0', name: 'NORMAL_USER' }
    // }

    const temp = (await this.roleService.getRoleById(user.role._id)) as any;

    // thêm 1 trường permissions trong object user
    user.permissions = temp.permissions;

    return { user };
  }

  // lấy refresh token từ cookie
  @Public()
  @ResponseMessage('Get user by refersh token')
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = request.cookies['refresh_token'];
    return this.authService.processNewToken(refresh_token, response);
  }

  // @Res({ passthrough: true }) response: Response
  // dùng để set, clear cookie
  @ResponseMessage('Logout User')
  @Post('/logout')
  handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(user, response);
  }
}
