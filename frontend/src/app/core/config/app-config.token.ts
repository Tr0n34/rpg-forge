import { InjectionToken } from '@angular/core';
import { RuntimeAppConfig } from './app-config.model';

export const APP_CONFIG = new InjectionToken<RuntimeAppConfig>('APP_CONFIG');
