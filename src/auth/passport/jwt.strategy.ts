import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private rolesService: RolesService,
  ) {
    super({
      // decode giải mã token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  // giải mãi decode token thành công
  // chạy hàm này và gán vô biến req.user
  async validate(payload: IUser) {
    const { _id, name, email, role } = payload;

    // get role by id
    const tempRole = (await this.rolesService.getRoleById(role._id)).toObject();

    // req.user
    return { _id, name, email, role, permissions: tempRole?.permissions ?? [] };
  }
}
