import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { RequestUserDto } from '../../core/auth/dto/request-user.dto';

export const DecoratorFactory = (_data: string, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  const user = request.user as RequestUserDto;

  if (!user) {
    throw new UnauthorizedException();
  }

  if (!user.userId) {
    throw new InternalServerErrorException('missing userId');
  }

  return user.userId;
};

export const UserId = createParamDecorator(DecoratorFactory);
