import { Permission } from './../permissions/schemas/permission.schemas';
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  // validate in jwt.strategy -> handleRequest
  handleRequest(err, user, info, context: ExecutionContext) {
    // nếu hàm validate trong jwt.strategy không giải mã được token
    // throw error
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Token không hợp lệ / Không có token ở Bearer Token trong Header request!',
        )
      );
    }

    // get the request object from the context
    const request = context.switchToHttp().getRequest();

    // check permission
    const targetMethod = request.method;
    const targetEndpoint = request.route?.path;

    const permissions = user?.permissions;

    const isExistPermission = permissions.find(
      (permission) =>
        targetMethod === permission.method &&
        targetEndpoint === permission.apiPath,
    );

    if (!isExistPermission) {
      throw new ForbiddenException('Bạn không có quyền sử dụng API này!');
    }

    return user;
  }
}
