import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RuntimeAppConfig } from './app-config.model';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly http = inject(HttpClient);
  private config?: RuntimeAppConfig;

  async load(): Promise<RuntimeAppConfig> {
    this.config = await firstValueFrom(
      this.http.get<RuntimeAppConfig>('assets/config/app-config.json')
    );
    return this.config;
  }

  get snapshot(): RuntimeAppConfig {
    if (!this.config) {
      throw new Error('Runtime config not loaded');
    }
    return this.config;
  }
}
