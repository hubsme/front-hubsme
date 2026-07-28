import { Injectable, signal, inject, effect, PLATFORM_ID, computed } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  constructor() {

    if (isPlatformBrowser(this.platformId)) {
      this.loadTheme();
      effect(() => {
        const htmlElement = this.document.documentElement;
        htmlElement.setAttribute('data-theme', this.theme());
      });
    }
  }

  private _theme = signal<Theme>('light');
  private themeOverride = signal<Theme | null>(null);
  readonly theme = computed(() => this.themeOverride() ?? this._theme());

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme(): void {
    const newTheme = this._theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  forceTheme(theme: Theme): () => void {
    const previousOverride = this.themeOverride();
    this.themeOverride.set(theme);

    return () => this.themeOverride.set(previousOverride);
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    this.setTheme(savedTheme ?? 'light');
  }
}
