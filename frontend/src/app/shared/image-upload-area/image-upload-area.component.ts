import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzUploadChangeParam, NzUploadFile, NzUploadModule, NzUploadXHRArgs} from 'ng-zorro-antd/upload';
import {Observable, Subscription} from 'rxjs';
import {NzIconModule} from 'ng-zorro-antd/icon';

@Component({
  selector: 'ofs-image-upload-area',
  standalone: true,
  imports: [
    NzUploadModule,
    NzIconModule,
  ],
  templateUrl: './image-upload-area.component.html',
  styleUrl: './image-upload-area.component.less'
})
export class ImageUploadAreaComponent {
  @Output()
  readonly nzFileListChange = new EventEmitter<NzUploadFile[]>();
  @Input()
  nzFileList: NzUploadFile[] = [];
  @Input()
  nzCustomRequest?: (item: NzUploadXHRArgs) => Subscription;
  @Input()
  nzData?: {} | ((file: NzUploadFile) => {} | Observable<{}>);
  @Output()
  readonly nzChange = new EventEmitter<NzUploadChangeParam>();
}
