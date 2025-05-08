import {Injectable, signal} from '@angular/core';
import {GroupCreateDto} from '@backend/model/groupCreateDto';
import {HttpErrorResponse} from '@angular/common/http';
import {GroupService} from '@backend/api/group.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupCreateService {
  createLoading = signal(false);
  createLoadingError = new Subject<string>();
  createLoadingSuccess = new Subject<void>();

  constructor(private readonly groupService: GroupService, private readonly router: Router) {
  }

  create(rawValue: GroupCreateDto): void {
    this.createLoading.set(true);
    this.groupService.groupControllerCreateGroup(rawValue)
      .subscribe({
        next: (group) => {
          this.createLoading.set(false);
          this.createLoadingSuccess.next();
          this.router.navigate(['administration', 'groups', group.id]);
        },
        error: (err: HttpErrorResponse) => {
          this.createLoading.set(false);
          this.createLoadingError.next(err.status === 400 ? err.error.message : 'Fehler beim speichern.');
        },
      });
  }
}
