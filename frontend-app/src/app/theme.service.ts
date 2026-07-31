import { Injectable, signal, effect, Inject, PLATFORM_ID, OnDestroy, computed } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';

export type ThemePreference = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'taskhive-theme-preference';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  private readonly isBrowser: boolean;
  private mediaQuery: MediaQueryList | null = null;
  private systemDarkQueryListener!: (e: MediaQueryListEvent) => void;

  themePreference = signal<ThemePreference>('system');
  effectiveTheme = signal<EffectiveTheme>('light');
  isDarkMode = computed(() => this.effectiveTheme() === 'dark');

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private overlayContainer: OverlayContainer
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        this.themePreference.set(stored);
      }

      if (window.matchMedia) {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemDarkQueryListener = (e: MediaQueryListEvent) => {
          if (this.themePreference() === 'system') {
            this.effectiveTheme.set(e.matches ? 'dark' : 'light');
          }
        };
        this.mediaQuery.addEventListener('change', this.systemDarkQueryListener);
      }
    }

    // Effect to calculate effective theme and apply it
    effect(() => {
      const preference = this.themePreference();
      let currentEffective: EffectiveTheme;

      if (preference === 'system') {
        currentEffective = (this.isBrowser && this.mediaQuery?.matches) ? 'dark' : 'light';
      } else {
        currentEffective = preference;
      }
      
      this.effectiveTheme.set(currentEffective);
      this.applyThemeToDOM(currentEffective, preference);
      
      if (this.isBrowser) {
        localStorage.setItem(THEME_STORAGE_KEY, preference);
      }
    }, { allowSignalWrites: true });
  }

  setTheme(preference: ThemePreference) {
    this.themePreference.set(preference);
  }

  toggleTheme() {
    const current = this.effectiveTheme();
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }

  private applyThemeToDOM(effective: EffectiveTheme, preference: ThemePreference) {
    if (!this.isBrowser) return;

    const html = this.document.documentElement;
    html.setAttribute('data-theme', effective);
    html.setAttribute('data-theme-preference', preference);

    // Sync OverlayContainer
    const overlayClassList = this.overlayContainer.getContainerElement().classList;
    overlayClassList.remove('theme-light', 'theme-dark');
    overlayClassList.add(`theme-${effective}`);
  }

  ngOnDestroy() {
    if (this.mediaQuery && this.systemDarkQueryListener) {
      this.mediaQuery.removeEventListener('change', this.systemDarkQueryListener);
    }
  }
}
