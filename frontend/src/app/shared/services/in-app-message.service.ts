import {Injectable} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class InAppMessageService {

  constructor(private readonly messageService: NzMessageService) {
  }

  public showInfo(message: string) {
    this.messageService.info(message, {nzDuration: 4000, nzPauseOnHover: true});
  }

  public showSuccess(message: string) {
    this.messageService.success(message, {nzDuration: 4000, nzPauseOnHover: true});
  }

  public showError(message: string) {
    this.messageService.error(message, {nzDuration: 4000, nzPauseOnHover: true});
  }
}
