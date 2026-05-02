import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-toggle-button',
  standalone: true,
  templateUrl: './theme-toggle-button.component.html',
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
