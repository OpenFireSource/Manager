import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { KeycloakService } from '../services/keycloak.service';
import { catchError, map, mergeMap, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { InternalErrorDto } from '../../shared/dto/internal-error.dto';
import { CountDto } from '../../shared/dto/count.dto';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);

  constructor(private readonly keycloakService: KeycloakService) {}

  getCount(): Observable<CountDto> {
    return this.keycloakService
      .getUserCount()
      .pipe(map((count) => plainToInstance(CountDto, { count })));
  }

  getUsers(offset?: number, limit?: number): Observable<UserDto[]> {
    return this.keycloakService
      .getUsers(offset, limit)
      .pipe(map((users) => plainToInstance(UserDto, users)));
  }

  getUser(id: string): Observable<UserDto> {
    return this.keycloakService.getUser(id).pipe(
      map((user) => plainToInstance(UserDto, user)),
      catchError((error: InternalErrorDto) => {
        if (error.code === 404) {
          throw new NotFoundException();
        } else if (error.code >= 400 && error.code < 500) {
          throw new BadRequestException(error.message);
        } else {
          throw new InternalServerErrorException();
        }
      }),
    );
  }

  createUser(body: UserCreateDto): Observable<UserDto> {
    return this.keycloakService.createUser(body).pipe(
      mergeMap(() => this.keycloakService.getUserByUsername(body.username)),
      map((user) => {
        if (!user) throw new InternalServerErrorException();
        return plainToInstance(UserDto, user);
      }),
      catchError((error: InternalErrorDto) => {
        if (error.code >= 400 && error.code < 500) {
          throw new BadRequestException(error.message);
        } else {
          throw new InternalServerErrorException();
        }
      }),
    );
  }

  updateUser(id: string, body: UserUpdateDto): Observable<UserDto> {
    return this.keycloakService.updateUser(id, body).pipe(
      mergeMap(() => this.keycloakService.getUser(id)),
      map((user) => {
        if (!user) throw new InternalServerErrorException();
        return plainToInstance(UserDto, user);
      }),
      catchError((error: InternalErrorDto) => {
        if (error.code >= 400 && error.code < 500) {
          throw new BadRequestException(error.message);
        } else {
          throw new InternalServerErrorException();
        }
      }),
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.keycloakService.deleteUser(id).pipe(
      catchError((error: InternalErrorDto) => {
        if (error.code === 404) {
          throw new NotFoundException();
        } else if (error.code >= 400 && error.code < 500) {
          throw new BadRequestException(error.message);
        } else {
          throw new InternalServerErrorException();
        }
      }),
    );
  }
}
