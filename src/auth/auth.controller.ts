import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ResponseMessage('User Login')
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req, @Res({ passthrough: true }) response: Response) {
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

  // khi mà truyền token lên header
  // code nó sẽ chạy ở jwt.strategy passport
  // NestJS sẽ tự động decode và lưu vô req.user
  @ResponseMessage('Fetch account with access token')
  @Get('/account')
  fetchAccount(@User() user: IUser) {
    return { user };
  }
}
