import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../core/config/app-config.token';
import { CreateUserPayload, UserView } from '../../core/auth/auth.models';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly baseUrl = `${this.config.apiBaseUrl}/api/users`;

  list(): Observable<UserView[]> {
    return this.http.get<UserView[]>(this.baseUrl);
  }

  create(payload: CreateUserPayload): Observable<UserView> {
    return this.http.post<UserView>(this.baseUrl, payload);
  }
}
