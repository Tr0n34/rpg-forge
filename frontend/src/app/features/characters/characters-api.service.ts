import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../core/config/app-config.token';
import { CharacterPayload, CharacterView } from '../../core/auth/auth.models';

@Injectable({ providedIn: 'root' })
export class CharactersApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly baseUrl = `${this.config.apiBaseUrl}/api/characters`;

  list(filters: { createdFrom?: string; createdTo?: string; lastName?: string }): Observable<CharacterView[]> {
    let params = new HttpParams();
    if (filters.createdFrom) {
      params = params.set('createdFrom', filters.createdFrom);
    }
    if (filters.createdTo) {
      params = params.set('createdTo', filters.createdTo);
    }
    if (filters.lastName) {
      params = params.set('lastName', filters.lastName);
    }
    return this.http.get<CharacterView[]>(this.baseUrl, { params });
  }

  create(payload: CharacterPayload): Observable<CharacterView> {
    return this.http.post<CharacterView>(this.baseUrl, payload);
  }

  get(id: string): Observable<CharacterView> {
    return this.http.get<CharacterView>(`${this.baseUrl}/${id}`);
  }

  update(id: string, payload: CharacterPayload): Observable<CharacterView> {
    return this.http.put<CharacterView>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
