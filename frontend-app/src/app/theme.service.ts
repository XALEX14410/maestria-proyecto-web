import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode.set(!this.isDarkMode());
    if (this.isBrowser) {
      this.applyTheme();
      localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    }
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
    } else if (savedTheme === null) {
      // Check system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }
    this.applyTheme();
  }

  private applyTheme() {
    if (!this.isBrowser) return;
    
    if (this.isDarkMode()) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
