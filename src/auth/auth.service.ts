import { Injectable } from '@nestjs/common';
import { use } from 'passport';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
}
