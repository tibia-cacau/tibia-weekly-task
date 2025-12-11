import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private platformId = inject(PLATFORM_ID);

  getApiUrl(): string {
    // Em produção, usar a URL do hostname atual
    if (
      isPlatformBrowser(this.platformId) &&
      window.location.hostname !== 'localhost'
    ) {
      return `${window.location.protocol}//${window.location.hostname}/api`;
    }
    // Em desenvolvimento
    return 'http://localhost:8080/api';
  }
}
