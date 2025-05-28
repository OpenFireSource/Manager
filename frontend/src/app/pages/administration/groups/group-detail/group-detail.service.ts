import {Injectable, signal} from '@angular/core';
import {GroupDto} from '@backend/model/groupDto';
import {forkJoin, from, mergeMap, Subject, tap} from 'rxjs';
import {GroupService} from '@backend/api/group.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {GroupUpdateDto} from '@backend/model/groupUpdateDto';
import {UserDto} from '@backend/model/userDto';
import {RoleDto} from '@backend/model/roleDto';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';

@Injectable({
  providedIn: 'root'
})
export class GroupDetailService {
  group = signal<GroupDto | null>(null);
  loading = signal(false);
  loadingError = signal(false);
  notFound = signal(false);
  deleteLoading = signal(false);
  updateLoading = signal(false);
  users = signal<{ user: UserDto, member: boolean }[]>([]);
  updateLoadingError = new Subject<void>();
  deleteLoadingError = new Subject<string>();
  updateLoadingSuccess = new Subject<void>();
  deleteLoadingSuccess = new Subject<void>();
  usersTransferLoading = signal<boolean>(false);
  roles = signal<{ role: RoleDto, hasRole: boolean }[]>([]);
  rolesTransferLoading = signal<boolean>(false);

  constructor(
    private readonly groupService: GroupService,
    private readonly router: Router,
    private readonly inAppMessagingService: InAppMessageService,
  ) {
  }

  load(id: string) {
    this.loading.set(true);
    this.usersTransferLoading.set(true);
    this.rolesTransferLoading.set(true);

    this.groupService.groupControllerGetGroup({id})
      .pipe(
        tap((group) => this.group.set(group)),
        mergeMap(() => this.groupService.groupControllerGetMembers({id})),
        tap((data) => this.users.set(data.users.map((user) => ({
          user,
          member: data.members.some(x => x.id === user.id)
        })))),
        mergeMap(() => this.groupService.groupControllerGetRoles()),
        tap((data) => this.roles.set(data.map((role) => ({
          role,
          hasRole: (this.group()!.roles ?? []).some(x => x === role.name)
        })))),
      )
      .subscribe({
        next: () => {
          this.loadingError.set(false);
          this.loading.set(false);
          this.usersTransferLoading.set(false);
          this.rolesTransferLoading.set(false);
          this.rolesTransferLoading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.notFound.set(true);
          }
          this.group.set(null);
          this.users.set([]);
          this.roles.set([]);
          this.usersTransferLoading.set(false);
          this.rolesTransferLoading.set(false);
          this.rolesTransferLoading.set(false);
          this.loadingError.set(true);
          this.loading.set(false);
        }
      })
  }

  update(rawValue: GroupUpdateDto) {
    const group = this.group();
    if (group) {
      this.updateLoading.set(true);
      this.groupService.groupControllerUpdateGroup({id: group.id, groupUpdateDto: rawValue})
        .subscribe({
          next: (group) => {
            this.updateLoading.set(false);
            this.group.set(group);
            this.updateLoadingSuccess.next();
          },
          error: () => {
            this.updateLoading.set(false);
            this.updateLoadingError.next();
          },
        });
    }
  }

  delete() {
    const group = this.group();
    if (group) {
      this.deleteLoading.set(true);
      this.groupService.groupControllerDeleteGroup({id: group.id})
        .subscribe({
          next: () => {
            this.deleteLoading.set(false);
            this.deleteLoadingSuccess.next();
            this.router.navigate(['administration', 'groups']);
          },
          error: (err: HttpErrorResponse) => {
            this.deleteLoading.set(false);
            this.deleteLoadingError.next(err.status === 400 ? err.error : 'Fehler beim löschen');
          },
        });
    }
  }

  updateMembers(add: boolean, users: string[]) {
    this.usersTransferLoading.set(true);
    from([users]).pipe(
      mergeMap((users) =>
        forkJoin(users.map((userId) => add ?
          this.groupService.groupControllerAddMemberToGroup({id: this.group()!.id, userId}) :
          this.groupService.groupControllerRemoveMemberFromGroup({id: this.group()!.id, userId})))
      ),
      mergeMap(() => this.groupService.groupControllerGetGroup({id: this.group()!.id})),
      tap((group) => this.group.set(group)),
      mergeMap(() => this.groupService.groupControllerGetMembers({id: this.group()!.id})),
      tap((data) => this.users.set(data.users.map((user) => ({
        user,
        member: data.members.some(x => x.id === user.id)
      })))),
    ).subscribe({
      next: () => {
        this.usersTransferLoading.set(false);
        this.inAppMessagingService.showSuccess('Benutzer gespeichert');
      },
      error: () => {
        this.usersTransferLoading.set(false);
        this.updateLoadingError.next();
      },
    });
  }

  updateRoles(add: boolean, roles: string[]) {
    this.rolesTransferLoading.set(true);
    from([roles]).pipe(
      mergeMap((roles) =>
        forkJoin(roles.map((role) => add ?
          this.groupService.groupControllerAddRoleToGroup({id: this.group()!.id, role}) :
          this.groupService.groupControllerRemoveRoleFromGroup({id: this.group()!.id, role})))
      ),
      mergeMap(() => this.groupService.groupControllerGetGroup({id: this.group()!.id})),
      tap((group) => this.group.set(group)),
      mergeMap(() => this.groupService.groupControllerGetRoles()),
      tap((data) => this.roles.set(data.map((role) => ({
        role,
        hasRole: (this.group()!.roles ?? []).some(x => x === role.name)
      })))),
    ).subscribe({
      next: () => {
        this.rolesTransferLoading.set(false);
        this.inAppMessagingService.showSuccess('Rollen gespeichert');
      },
      error: () => {
        this.rolesTransferLoading.set(false);
        this.updateLoadingError.next();
      },
    });
  }
}
