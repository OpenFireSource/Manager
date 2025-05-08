import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { KeycloakService } from '../services/keycloak.service';
import { catchError, map, mergeMap, Observable, of, tap } from 'rxjs';
import { CountDto } from '../../shared/dto/count.dto';
import { plainToInstance } from 'class-transformer';
import { InternalErrorDto } from '../../shared/dto/internal-error.dto';
import { GroupDto } from './dto/group.dto';
import { GroupCreateDto } from './dto/group-create.dto';
import { GroupUpdateDto } from './dto/group-update.dto';
import { UserDto } from '../user/dto/user.dto';
import { GroupMembersDto } from './dto/group-members.dto';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class GroupService {
  constructor(private readonly keycloakService: KeycloakService) {}

  public getCount(): Observable<CountDto> {
    return this.keycloakService
      .getGroupCount()
      .pipe(map((count) => plainToInstance(CountDto, { count })));
  }

  public getGroups(offset?: number, limit?: number): Observable<GroupDto[]> {
    return this.keycloakService
      .getGroups(offset, limit)
      .pipe(map((groups) => plainToInstance(GroupDto, groups)));
  }

  public getGroup(id: string): Observable<GroupDto> {
    return this.keycloakService.getGroup(id).pipe(
      map((group) =>
        plainToInstance(GroupDto, {
          ...group,
          roles: group.clientRoles
            ? (group.clientRoles[this.keycloakService.clientId] ?? [])
            : [],
        }),
      ),
    );
  }

  public createGroup(body: GroupCreateDto): Observable<GroupDto> {
    return this.keycloakService.createGroup(body).pipe(
      mergeMap(() => this.keycloakService.getGroupByName(body.name)),
      map((group) => {
        if (!group) throw new InternalServerErrorException();
        return plainToInstance(GroupDto, group);
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

  public updateGroup(id: string, body: GroupUpdateDto): Observable<GroupDto> {
    return this.keycloakService.getGroup(id).pipe(
      catchError((error: InternalErrorDto) => {
        if (error.code === 404) {
          throw new NotFoundException();
        } else if (error.code >= 400 && error.code < 500) {
          throw new BadRequestException(error.message);
        } else {
          throw new InternalServerErrorException();
        }
      }),
      tap((group) => {
        if (
          group.attributes &&
          group.attributes['protected'] &&
          group.attributes['protected'][0] === 'true'
        ) {
          throw new BadRequestException(
            'Geschützte Gruppen dürfen nicht verändert werden',
          );
        }
      }),
      mergeMap(() =>
        this.keycloakService.updateGroup(id, body).pipe(
          mergeMap(() => this.keycloakService.getGroup(id)),
          map((group) => {
            if (!group) throw new InternalServerErrorException();
            return plainToInstance(GroupDto, group);
          }),
          catchError((error: InternalErrorDto) => {
            if (error.code >= 400 && error.code < 500) {
              throw new BadRequestException(error.message);
            } else {
              throw new InternalServerErrorException();
            }
          }),
        ),
      ),
    );
  }

  public deleteGroup(id: string): Observable<void> {
    return this.keycloakService.getGroup(id).pipe(
      catchError((error: InternalErrorDto) => {
        if (error.code === 404) {
          throw new NotFoundException();
        } else if (error.code >= 400 && error.code < 500) {
          throw new BadRequestException(error.message);
        } else {
          throw new InternalServerErrorException();
        }
      }),
      tap((group) => {
        if (
          group.attributes &&
          group.attributes['protected'] &&
          group.attributes['protected'][0] === 'true'
        ) {
          throw new BadRequestException(
            'Geschützte Gruppen dürfen nicht verändert werden',
          );
        }
      }),
      mergeMap(() =>
        this.keycloakService.deleteGroup(id).pipe(
          catchError((error: InternalErrorDto) => {
            if (error.code === 404) {
              throw new NotFoundException();
            } else if (error.code >= 400 && error.code < 500) {
              throw new BadRequestException(error.message);
            } else {
              throw new InternalServerErrorException();
            }
          }),
        ),
      ),
    );
  }

  public addRoleToGroup(groupId: string, role: string): Observable<void> {
    return this.keycloakService.getGroup(groupId).pipe(
      catchError((error: InternalErrorDto) => {
        if (error.code === 404) {
          throw new NotFoundException();
        } else if (error.code >= 400 && error.code < 500) {
          throw new BadRequestException(error.message);
        } else {
          throw new InternalServerErrorException();
        }
      }),
      tap((group) => {
        if (
          group.attributes &&
          group.attributes['protected'] &&
          group.attributes['protected'][0] === 'true'
        ) {
          throw new BadRequestException(
            'Geschützte Gruppen dürfen nicht verändert werden',
          );
        }
      }),
      mergeMap(() =>
        this.keycloakService.addRoleToGroup(groupId, role).pipe(
          catchError((error: InternalErrorDto) => {
            if (error.code === 404) {
              throw new NotFoundException();
            } else if (error.code >= 400 && error.code < 500) {
              throw new BadRequestException(error.message);
            } else {
              throw new InternalServerErrorException();
            }
          }),
        ),
      ),
    );
  }

  public removeRoleFromGroup(groupId: string, role: string): Observable<void> {
    return this.keycloakService.getGroup(groupId).pipe(
      catchError((error: InternalErrorDto) => {
        if (error.code === 404) {
          throw new NotFoundException();
        } else if (error.code >= 400 && error.code < 500) {
          throw new BadRequestException(error.message);
        } else {
          throw new InternalServerErrorException();
        }
      }),
      tap((group) => {
        if (
          group.attributes &&
          group.attributes['protected'] &&
          group.attributes['protected'][0] === 'true'
        ) {
          throw new BadRequestException(
            'Geschützte Gruppen dürfen nicht verändert werden',
          );
        }
      }),
      mergeMap(() =>
        this.keycloakService.removeRoleFromGroup(groupId, role).pipe(
          catchError((error: InternalErrorDto) => {
            if (error.code === 404) {
              throw new NotFoundException();
            } else if (error.code >= 400 && error.code < 500) {
              throw new BadRequestException(error.message);
            } else {
              throw new InternalServerErrorException();
            }
          }),
        ),
      ),
    );
  }

  public getRoles() {
    return this.keycloakService.getBackendClientRoles().pipe(
      map((roles) => plainToInstance(RoleDto, roles)),
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

  public getMembers(groupId: string): Observable<GroupMembersDto> {
    return this.getAllMembers(groupId).pipe(
      mergeMap((members) => {
        return this.getAllUsers().pipe(
          map((users) => plainToInstance(GroupMembersDto, { members, users })),
        );
      }),
    );
  }

  private getAllMembers(groupId: string): Observable<UserDto[]> {
    const fetchAllMembers = (
      offset: number,
      limit: number,
      members: UserDto[],
    ): Observable<UserDto[]> => {
      return this.keycloakService.getGroupMembers(groupId, offset, limit).pipe(
        map((users) => plainToInstance(UserDto, users)),
        mergeMap((fetchedMembers) => {
          if (fetchedMembers.length < limit) {
            // Keine weiteren Mitglieder vorhanden
            return of([...members, ...fetchedMembers]);
          }
          // Weitere Mitglieder laden
          return fetchAllMembers(offset + limit, limit, [
            ...members,
            ...fetchedMembers,
          ]);
        }),
      );
    };

    return fetchAllMembers(0, 100, []); // Starte mit Offset 0 und einem Limit von 100
  }

  private getAllUsers(): Observable<UserDto[]> {
    const fetchAllUsers = (
      offset: number,
      limit: number,
      members: UserDto[],
    ): Observable<UserDto[]> => {
      return this.keycloakService.getUsers(offset, limit).pipe(
        map((users) => plainToInstance(UserDto, users)),
        mergeMap((fetchedMembers) => {
          if (fetchedMembers.length < limit) {
            // Keine weiteren Benutzer vorhanden
            return of([...members, ...fetchedMembers]);
          }
          // Weitere Benutzer laden
          return fetchAllUsers(offset + limit, limit, [
            ...members,
            ...fetchedMembers,
          ]);
        }),
      );
    };

    return fetchAllUsers(0, 100, []); // Starte mit Offset 0 und einem Limit von 100
  }

  addMemberToGroup(id: string, userId: string) {
    return this.keycloakService.addUserToGroup(userId, id).pipe(
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

  removeMemberFromGroup(id: string, userId: string) {
    return this.keycloakService.removeUserFromGroup(userId, id).pipe(
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
