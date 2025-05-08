import {
  applyDecorators,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Put,
  Type,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '../../core/auth/role/role';
import { MyAuthGuard } from '../../core/auth/auth/auth.guard';
import { RoleGuard, Roles } from '../../core/auth/role/role.guard';

export enum EndpointType {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
}

export function Endpoint(
  type: EndpointType,
  options?: {
    path?: string;
    public?: boolean;
    description?: string;
    noContent?: boolean;
    notFound?: boolean;
    roles?: Role[];
    tags?: string[];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    responseType?: Type<unknown> | Function | [Function] | string;
  },
) {
  return applyDecorators(
    getHttpDecorator(type, options?.path),
    ...(options?.public
      ? []
      : [
          UseGuards(MyAuthGuard, RoleGuard),
          Roles(options?.roles ?? []),
          ApiBearerAuth(),
          ApiUnauthorizedResponse(),
        ]),
    ApiOperation({ description: options?.description }),
    ...(options?.responseType
      ? [ApiOkResponse({ type: options?.responseType })]
      : []),
    ...(options?.noContent ? [HttpCode(204), ApiNoContentResponse()] : []),
    ...(options?.notFound ? [ApiNotFoundResponse()] : []),
    ...(options?.tags ? [ApiTags(...options.tags)] : []),
  );
}

function getHttpDecorator(type: EndpointType, path?: string) {
  switch (type) {
    case EndpointType.POST:
      return Post(path);
    case EndpointType.PUT:
      return Put(path);
    case EndpointType.PATCH:
      return Patch(path);
    case EndpointType.DELETE:
      return Delete(path);
    default:
    case EndpointType.GET:
      return Get(path);
  }
}
