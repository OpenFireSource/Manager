import {Injectable, signal} from '@angular/core';
import {UserService} from '@backend/api/user.service';
import {UserDto} from '@backend/model/userDto';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users = signal<UserDto[]>([]);
  page = signal(0);
  itemsPerPage = signal(20);
  total = signal(0);
  usersLoading = signal(false);
  usersLoadError = signal(false);

  constructor(private readonly userService: UserService) {
  }

  load() {
    this.usersLoading.set(true);
    this.userService.userControllerGetCount()
      .subscribe((count) => this.total.set(count.count));
    this.userService.userControllerGetUsers({
      limit: this.itemsPerPage(),
      offset: this.page() * this.itemsPerPage(),
    })
      .subscribe({
        next: (users) => {
          this.users.set(users);
          this.usersLoadError.set(false);
          this.usersLoading.set(false);
        },
        error: () => {
          this.users.set([]);
          this.usersLoadError.set(true);
          this.usersLoading.set(false);
        }
      });
  }

  updatePage(page: number, itemsPerPage: number) {
    this.page.set(page);
    this.itemsPerPage.set(itemsPerPage);
    this.load();
  }
}
