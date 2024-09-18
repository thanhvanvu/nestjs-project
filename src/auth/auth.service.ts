import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // username
  // password
  // là 2 tham số của thư viện passport trả về
  async validateUser(username: string, pass: string): Promise<any> {
    // find user
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      // check password
      const isValidPassword = this.usersService.isValidPassword(
        pass,
        user.password,
      );

      if (isValidPassword === true) {
        return user;
      }
    } else {
      return null;
    }
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    // send thông tin qua userService
    let newUser = await this.usersService.register(registerUserDto);
    return {
      _id: newUser?._id,
      createdAt: newUser.createdAt,
    };
  }

  createRefreshToken = (payload) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
    return refresh_token;
  };

  async loginSuccess(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    // create access token with username and sub
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };

    const refreshToken = this.createRefreshToken(payload);

    // update user with refresh token
    await this.usersService.updateUserToken(refreshToken, _id);

    // set refresh token in cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  async processNewToken(refresh_token: string, response: Response) {
    try {
      // check the refresh token xem hợp lệ không
      this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      // find user
      let user = await this.usersService.findUserByToken(refresh_token);

      if (user) {
        const { _id, name, email, role } = user;
        // create access token with username and sub
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };

        const refreshToken = this.createRefreshToken(payload);

        // update user with refresh token
        await this.usersService.updateUserToken(refreshToken, _id.toString());

        // set refresh token in cookie
        response.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            role,
          },
        };
      }
    } catch (error) {
      throw new BadRequestException(
        'Refresh token không hợp lệ. Vui lòng login!',
      );
    }
  }

  async logout(user: IUser, response: Response) {
    console.log(user);
    // update refresh token to empty
    await this.usersService.updateUserToken('', user._id);

    // clear cookie
    response.clearCookie('refresh_token');

    return 'ok';
  }
}
