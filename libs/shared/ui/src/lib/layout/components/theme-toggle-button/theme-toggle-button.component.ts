import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-toggle-button',
  standalone: true,
  template: `<button
  type="button"
  class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
  [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  (click)="toggleTheme()"
>
  @if (isDark) {
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3c0 0 0 0 0 0A7 7 0 0 0 21 12.79z"></path>
    </svg>
  } @else {
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 3v2M12 19v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M3 12h2M19 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
      <circle cx="12" cy="12" r="4"></circle>
    </svg>
  }
</button>`,
})
export class ThemeToggleButtonComponent {
  isDark = false;

  ngOnInit() {
    if (typeof window === 'undefined') {
      return;
    }

    const saved = localStorage.getItem('haut-theme');
    if (saved === 'dark' || saved === 'light') {
      this.isDark = saved === 'dark';
    } else {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.applyTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme();
    localStorage.setItem('haut-theme', this.isDark ? 'dark' : 'light');
  }

  private applyTheme() {
    const root = document.documentElement;
    if (this.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
