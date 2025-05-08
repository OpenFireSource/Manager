import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role';
import { Request } from 'express';
import { RequestUserDto } from '../dto/request-user.dto';

export const Roles = Reflector.createDecorator<Role[]>();

/**
 * überprüft, ob der Benutzer alle angegeben Rollen besitzt.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as RequestUserDto;
    if (!user) {
      return false;
    }

    return roles.every((role) => user.roles.includes(role.name));
  }
}
