import { Body, Controller, Param, Query } from '@nestjs/common';
import {
  Endpoint,
  EndpointType,
} from '../../shared/decorator/endpoint.decorator';
import { Observable } from 'rxjs';
import { CountDto } from '../../shared/dto/count.dto';
import { GroupService } from './group.service';
import { GroupDto } from './dto/group.dto';
import { GroupGetQueryDto } from './dto/group-get-query.dto';
import { IdGuidDto } from '../../shared/dto/id-guid.dto';
import { GroupUpdateDto } from './dto/group-update.dto';
import { GroupCreateDto } from './dto/group-create.dto';
import { Role } from '../auth/role/role';
import { GroupRoleQueryDto } from './dto/group-role-query.dto';
import { GroupMembersDto } from './dto/group-members.dto';
import { RoleDto } from './dto/role.dto';
import { GroupMemberQueryDto } from './dto/group-member-query.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Endpoint(EndpointType.GET, {
    path: 'roles',
    description: 'Gibt alle Rollen zurück',
    roles: [Role.GroupView],
    responseType: [RoleDto],
  })
  public getRoles() {
    return this.groupService.getRoles();
  }

  @Endpoint(EndpointType.GET, {
    path: 'count',
    description: 'Gibt die Anzahl der Gruppen zurück',
    roles: [Role.GroupView],
    responseType: CountDto,
  })
  public getCount(): Observable<CountDto> {
    return this.groupService.getCount();
  }

  @Endpoint(EndpointType.GET, {
    description: 'Gibt alle Gruppen zurück',
    roles: [Role.GroupView],
    responseType: [GroupDto],
  })
  public getGroups(@Query() querys: GroupGetQueryDto): Observable<GroupDto[]> {
    return this.groupService.getGroups(querys.offset, querys.limit);
  }

  @Endpoint(EndpointType.GET, {
    path: ':id',
    description: 'Gibt eine Gruppe zurück',
    roles: [Role.GroupView],
    responseType: GroupDto,
  })
  public getGroup(@Param() params: IdGuidDto): Observable<GroupDto> {
    return this.groupService.getGroup(params.id);
  }

  @Endpoint(EndpointType.POST, {
    description: 'Erstellt eine Gruppe',
    roles: [Role.GroupManage],
    responseType: GroupDto,
  })
  public createGroup(@Body() body: GroupCreateDto): Observable<GroupDto> {
    return this.groupService.createGroup(body);
  }

  @Endpoint(EndpointType.PUT, {
    path: ':id',
    description: 'Aktualisiert eine Gruppe',
    roles: [Role.GroupManage],
    responseType: GroupDto,
  })
  public updateGroup(
    @Param() params: IdGuidDto,
    @Body() body: GroupUpdateDto,
  ): Observable<GroupDto> {
    return this.groupService.updateGroup(params.id, body);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id',
    description: 'Löscht eine Gruppe',
    roles: [Role.GroupManage],
    noContent: true,
  })
  public deleteGroup(@Param() params: IdGuidDto): Observable<void> {
    // prevent deletion of default groups
    return this.groupService.deleteGroup(params.id);
  }

  @Endpoint(EndpointType.POST, {
    path: ':id/role',
    description: 'Fügt eine Rolle zu einer Gruppe hinzu',
    roles: [Role.GroupManage],
    noContent: true,
  })
  public addRoleToGroup(
    @Param() params: IdGuidDto,
    @Query() querys: GroupRoleQueryDto,
  ) {
    return this.groupService.addRoleToGroup(params.id, querys.role);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id/role',
    description: 'Löscht eine Rolle von einer Gruppe',
    roles: [Role.GroupManage],
    noContent: true,
  })
  public removeRoleFromGroup(
    @Param() params: IdGuidDto,
    @Query() querys: GroupRoleQueryDto,
  ) {
    return this.groupService.removeRoleFromGroup(params.id, querys.role);
  }

  @Endpoint(EndpointType.POST, {
    path: ':id/member',
    description: 'Fügt einen Benutzer zu einer Gruppe hinzu',
    roles: [Role.GroupManage],
    noContent: true,
  })
  public addMemberToGroup(
    @Param() params: IdGuidDto,
    @Query() querys: GroupMemberQueryDto,
  ) {
    return this.groupService.addMemberToGroup(params.id, querys.userId);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id/member',
    description: 'Löscht einen Benutzer von einer Gruppe',
    roles: [Role.GroupManage],
    noContent: true,
  })
  public removeMemberFromGroup(
    @Param() params: IdGuidDto,
    @Query() querys: GroupMemberQueryDto,
  ) {
    return this.groupService.removeMemberFromGroup(params.id, querys.userId);
  }

  @Endpoint(EndpointType.GET, {
    description: 'Gibt alle Benutzer und die Mitglieder einer Gruppe zurück',
    roles: [Role.UserView],
    responseType: GroupMembersDto,
    path: ':id/members',
  })
  public getMembers(@Param() params: IdGuidDto): Observable<GroupMembersDto> {
    return this.groupService.getMembers(params.id);
  }
}
