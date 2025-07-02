import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ConsumableDto, 
  ConsumableCreateDto, 
  ConsumableUpdateDto, 
  CountDto 
} from '../models/consumable.models';

@Injectable({
  providedIn: 'root'
})
export class ConsumableApiService {
  private readonly basePath = '/api/consumable';

  constructor(private http: HttpClient) {}

  getCount(searchTerm?: string): Observable<CountDto> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get<CountDto>(`${this.basePath}/count`, { params });
  }

  getAll(options?: {
    limit?: number;
    offset?: number;
    groupId?: number;
    locationId?: number;
    sortCol?: string;
    sortDir?: string;
    searchTerm?: string;
  }): Observable<ConsumableDto[]> {
    let params = new HttpParams();
    if (options?.limit) {
      params = params.set('limit', options.limit.toString());
    }
    if (options?.offset) {
      params = params.set('offset', options.offset.toString());
    }
    if (options?.groupId) {
      params = params.set('groupId', options.groupId.toString());
    }
    if (options?.locationId) {
      params = params.set('locationId', options.locationId.toString());
    }
    if (options?.sortCol) {
      params = params.set('sortCol', options.sortCol);
    }
    if (options?.sortDir) {
      params = params.set('sortDir', options.sortDir);
    }
    if (options?.searchTerm) {
      params = params.set('searchTerm', options.searchTerm);
    }
    return this.http.get<ConsumableDto[]>(this.basePath, { params });
  }

  getOne(id: number): Observable<ConsumableDto> {
    return this.http.get<ConsumableDto>(`${this.basePath}/${id}`);
  }

  create(dto: ConsumableCreateDto): Observable<ConsumableDto> {
    return this.http.post<ConsumableDto>(this.basePath, dto);
  }

  update(id: number, dto: ConsumableUpdateDto): Observable<ConsumableDto> {
    return this.http.put<ConsumableDto>(`${this.basePath}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}