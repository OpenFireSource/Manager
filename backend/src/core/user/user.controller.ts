import { Body, Controller, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { IdGuidDto } from '../../shared/dto/id-guid.dto';
import {
  Endpoint,
  EndpointType,
} from '../../shared/decorator/endpoint.decorator';
import { Role } from '../auth/role/role';
import { CountDto } from '../../shared/dto/count.dto';
import { UserGetQueryDto } from './dto/user-get-query.dto';
import { UserGroupQueryDto } from './dto/user-group-query.dto';
import { UserGroupsDto } from './dto/user-groups.dto';
import { UserId } from '../../shared/decorator/user-id.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Endpoint(EndpointType.GET, {
    path: 'me',
    description: 'Gibt einen Benutzer zurück',
    roles: [],
    responseType: UserDto,
  })
  public getMe(@UserId() userId: string): Observable<UserDto> {
    console.log('getMe called with userId:', userId);
    return this.userService.getUser(userId);
  }

  @Endpoint(EndpointType.GET, {
    path: 'count',
    description: 'Gibt die Anzahl der Benutzer zurück',
    roles: [Role.UserView],
    responseType: CountDto,
  })
  public getCount(): Observable<CountDto> {
    return this.userService.getCount();
  }

  @Endpoint(EndpointType.GET, {
    description: 'Gibt alle Benutzer zurück',
    roles: [Role.UserView],
    responseType: [UserDto],
  })
  public getUsers(@Query() querys: UserGetQueryDto): Observable<UserDto[]> {
    return this.userService.getUsers(querys.offset, querys.limit);
  }

  @Endpoint(EndpointType.GET, {
    path: ':id',
    description: 'Gibt einen Benutzer zurück',
    roles: [Role.UserView],
    responseType: UserDto,
  })
  public getUser(@Param() params: IdGuidDto): Observable<UserDto> {
    return this.userService.getUser(params.id);
  }

  @Endpoint(EndpointType.POST, {
    description: 'Erstellt einen Benutzer',
    roles: [Role.UserManage],
    responseType: UserDto,
  })
  public createUser(@Body() body: UserCreateDto): Observable<UserDto> {
    return this.userService.createUser(body);
  }

  @Endpoint(EndpointType.PUT, {
    path: ':id',
    description: 'Aktualisiert einen Benutzer',
    roles: [Role.UserManage],
    responseType: UserDto,
  })
  public updateUser(
    @Param() params: IdGuidDto,
    @Body() body: UserUpdateDto,
  ): Observable<UserDto> {
    return this.userService.updateUser(params.id, body);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id',
    description: 'Löscht einen Benutzer',
    roles: [Role.UserManage],
    noContent: true,
  })
  public deleteUser(@Param() params: IdGuidDto): Observable<unknown> {
    return this.userService.deleteUser(params.id);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id/member',
    description: 'Löscht einen Benutzer von einer Gruppe',
    roles: [Role.GroupManage],
    noContent: true,
  })
  public removeUserFromGroup(
    @Param() params: IdGuidDto,
    @Query() querys: UserGroupQueryDto,
  ) {
    return this.userService.removeUserFromGroup(params.id, querys.groupId);
  }

  @Endpoint(EndpointType.POST, {
    path: ':id/member',
    description: 'Fügt einen Benutzer zu einer Gruppe hinzu',
    roles: [Role.GroupManage],
    noContent: true,
  })
  public addUserToGroup(
    @Param() params: IdGuidDto,
    @Query() querys: UserGroupQueryDto,
  ) {
    return this.userService.addUserToGroup(params.id, querys.groupId);
  }

  @Endpoint(EndpointType.GET, {
    description:
      'Gibt alle Gruppen und die Mitgliederschaften der Gruppen zurück',
    roles: [Role.UserView],
    responseType: UserGroupsDto,
    path: ':id/groups',
  })
  public getGroups(@Param() params: IdGuidDto): Observable<UserGroupsDto> {
    return this.userService.getGroups(params.id);
  }
}
