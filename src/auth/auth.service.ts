import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async loginSuccess(user: IUser) {
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
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role,
    };
  }
}
