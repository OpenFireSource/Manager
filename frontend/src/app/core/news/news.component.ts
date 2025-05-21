import {Component, Signal} from '@angular/core';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NewsService} from './news.service';
import {NewsDto} from './news.dto';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzTypographyModule} from 'ng-zorro-antd/typography';

@Component({
  selector: 'ofs-news',
  imports: [
    NzGridModule,
    NgIf,
    NgForOf,
    NzCardModule,
    DatePipe,
    NzTypographyModule,
  ],
  standalone: true,
  templateUrl: './news.component.html',
  styleUrl: './news.component.less'
})
export class NewsComponent {
  loading: Signal<boolean>;
  error: Signal<boolean>;
  news: Signal<NewsDto[]>;

  constructor(private newsService: NewsService) {
    this.loading = newsService.loading;
    this.error = newsService.error;
    this.news = newsService.news;
  }
}
