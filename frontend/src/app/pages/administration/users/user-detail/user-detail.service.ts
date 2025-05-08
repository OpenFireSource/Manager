import {Injectable, signal} from '@angular/core';
import {UserService} from '@backend/api/user.service';
import {UserDto} from '@backend/model/userDto';
import {HttpErrorResponse} from '@angular/common/http';
import {UserUpdateDto} from '@backend/model/userUpdateDto';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

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

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) {
  }

  load(id: string) {
    this.loading.set(true);
    this.userService.userControllerGetUser(id)
      .subscribe({
        next: (user) => {
          this.user.set(user);
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
      this.userService.userControllerUpdateUser(user.id, rawValue)
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

  delete() {
    const user = this.user();
    if (user) {
      this.deleteLoading.set(true);
      this.userService.userControllerDeleteUser(user.id)
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
