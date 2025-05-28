import {Injectable, signal} from '@angular/core';
import {GroupDto} from '@backend/model/groupDto';
import {GroupService} from '@backend/api/group.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  groups = signal<GroupDto[]>([]);
  page = signal(0);
  itemsPerPage = signal(20);
  total = signal(0);
  groupsLoading = signal(false);
  groupsLoadError = signal(false);

  constructor(private readonly groupService: GroupService) {
  }

  load() {
    this.groupsLoading.set(true);
    this.groupService.groupControllerGetCount()
      .subscribe((count) => this.total.set(count.count));
    this.groupService.groupControllerGetGroups({
      limit: this.itemsPerPage(),
      offset: this.page() * this.itemsPerPage(),
    })
      .subscribe({
        next: (groups) => {
          this.groups.set(groups);
          this.groupsLoadError.set(false);
          this.groupsLoading.set(false);
        },
        error: () => {
          this.groups.set([]);
          this.groupsLoadError.set(true);
          this.groupsLoading.set(false);
        }
      })
  }

  updatePage(page: number, itemsPerPage: number) {
    this.page.set(page);
    this.itemsPerPage.set(itemsPerPage);
    this.load();
  }
}
