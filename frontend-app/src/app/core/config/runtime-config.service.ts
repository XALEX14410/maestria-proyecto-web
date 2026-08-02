import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

interface RuntimeConfig {
  apiBaseUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RuntimeConfigService {
  private config: Required<RuntimeConfig> = {
    apiBaseUrl: this.normalizeApiBaseUrl(environment.apiBaseUrl)
  };

  async load(): Promise<void> {
    if (typeof fetch === 'undefined') {
      return;
    }

    try {
      const response = await fetch('/assets/runtime-config.json', { cache: 'no-store' });

      if (!response.ok) {
        return;
      }

      const runtimeConfig = await response.json() as RuntimeConfig;
      if (runtimeConfig.apiBaseUrl) {
        this.config.apiBaseUrl = this.normalizeApiBaseUrl(runtimeConfig.apiBaseUrl);
      }
    } catch {
      // The local environment fallback keeps development usable if the asset is absent.
    }
  }

  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  apiUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.apiBaseUrl}${normalizedPath}`;
  }

  private normalizeApiBaseUrl(value: string): string {
    return value.replace(/\/+$/, '');
  }
}
