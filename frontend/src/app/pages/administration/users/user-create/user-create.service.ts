import {Injectable, signal} from '@angular/core';
import {UserService} from '@backend/api/user.service';
import {Subject} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {UserCreateDto} from '@backend/model/userCreateDto';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserCreateService {
  createLoading = signal(false);
  createLoadingError = new Subject<string>();
  createLoadingSuccess = new Subject<void>();

  constructor(private readonly userService: UserService, private readonly router: Router) {
  }

  create(rawValue: UserCreateDto) {
    this.createLoading.set(true);
    this.userService.userControllerCreateUser(rawValue)
      .subscribe({
        next: (user) => {
          this.createLoading.set(false);
          this.createLoadingSuccess.next();
          this.router.navigate(['administration', 'users', user.id]);
        },
        error: (err: HttpErrorResponse) => {
          this.createLoading.set(false);
          this.createLoadingError.next(err.status === 400 ? err.error.message : 'Fehler beim speichern.');
        },
      });
  }
}
