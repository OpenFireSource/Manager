import {Injectable, signal} from '@angular/core';
import {UserService} from '@backend/api/user.service';
import {UserDto} from '@backend/model/userDto';
import {HttpErrorResponse} from '@angular/common/http';
import {UserUpdateDto} from '@backend/model/userUpdateDto';
import {forkJoin, from, mergeMap, Subject, tap} from 'rxjs';
import {Router} from '@angular/router';
import {GroupDto} from '@backend/model/groupDto';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  user = signal<UserDto | null>(null);
  loading = signal(false);
  loadingError = signal(false);
  notFound = signal(false);
  deleteLoading = signal(false);
  updateLoading = signal(false);
  updateLoadingError = new Subject<void>();
  deleteLoadingError = new Subject<string>();
  updateLoadingSuccess = new Subject<void>();
  deleteLoadingSuccess = new Subject<void>();
  groups = signal<{ group: GroupDto, member: boolean }[]>([]);
  groupsTransferLoading = signal<boolean>(false);

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly inAppMessagingService: InAppMessageService,
  ) {
  }

  load(id: string) {
    this.loading.set(true);
    this.userService.userControllerGetUser({id})
      .pipe(
        tap((user) => this.user.set(user)),
        mergeMap(() => this.userService.userControllerGetGroups({id})),
        tap((data) => this.groups.set(data.groups.map((group) => ({
          group,
          member: data.members.some(x => x.id === group.id)
        })))),
      )
      .subscribe({
        next: () => {
          this.loadingError.set(false);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.notFound.set(true);
          }
          this.user.set(null);
          this.loadingError.set(true);
          this.loading.set(false);
        }
      })
  }

  update(rawValue: UserUpdateDto) {
    const user = this.user();
    if (user) {
      this.updateLoading.set(true);
      this.userService.userControllerUpdateUser({id: user.id, userUpdateDto: rawValue})
        .subscribe({
          next: (user) => {
            this.updateLoading.set(false);
            this.user.set(user);
            this.updateLoadingSuccess.next();
          },
          error: () => {
            this.updateLoading.set(false);
            this.updateLoadingError.next();
          },
        });
    }
  }

  updateGroups(add: boolean, groups: string[]) {
    this.groupsTransferLoading.set(true);
    from([groups]).pipe(
      mergeMap((users) =>
        forkJoin(users.map((groupId) => add ?
          this.userService.userControllerAddUserToGroup({id: this.user()!.id, groupId}) :
          this.userService.userControllerRemoveUserFromGroup({id: this.user()!.id, groupId})))
      ),
      mergeMap(() => this.userService.userControllerGetUser({id: this.user()!.id})),
      tap((user) => this.user.set(user)),
      mergeMap(() => this.userService.userControllerGetGroups({id: this.user()!.id})),
      tap((data) => this.groups.set(data.groups.map((group) => ({
        group,
        member: data.members.some(x => x.id === group.id)
      })))),
    ).subscribe({
      next: () => {
        this.groupsTransferLoading.set(false);
        this.inAppMessagingService.showSuccess('Benutzer gespeichert');
      },
      error: () => {
        this.groupsTransferLoading.set(false);
        this.updateLoadingError.next();
      },
    });
  }

  delete() {
    const user = this.user();
    if (user) {
      this.deleteLoading.set(true);
      this.userService.userControllerDeleteUser({id: user.id})
        .subscribe({
          next: () => {
            this.deleteLoading.set(false);
            this.deleteLoadingSuccess.next();
            this.router.navigate(['administration', 'users']);
          },
          error: (err: HttpErrorResponse) => {
            this.deleteLoading.set(false);
            this.deleteLoadingError.next(err.status === 400 ? err.error : 'Fehler beim löschen');
          },
        });
    }
  }
}
