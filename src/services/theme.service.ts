import { Injectable, signal, inject, effect, PLATFORM_ID } from '@angular/core';
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
        htmlElement.setAttribute('data-theme', this._theme());
      });
    }
  }

  private _theme = signal<Theme>('light');
  readonly theme = this._theme.asReadonly();

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme(): void {
    const newTheme = this._theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    this.setTheme(savedTheme ?? 'light');
  }
}
