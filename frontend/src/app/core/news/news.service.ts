import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NewsDto} from './news.dto';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  news = signal<NewsDto[]>([]);

  constructor(private readonly httpClient: HttpClient) {
  }

  load() {
    this.loading.set(true);

    this.httpClient.get<NewsDto[]>('https://news-api.openfiresource.de/api/news')
      .pipe(
        map((response: NewsDto[]) => {
          response.forEach((news) => {
            news.createdDate = new Date(news.createdDate);
          });
          return response;
        }),
      )
      .subscribe({
        next: (news) => {
          this.news.set(news);
          this.loading.set(false);
          this.error.set(false);
        },
        error: () => {
          this.news.set([]);
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }
}
