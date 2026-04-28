import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { ErrorBoundaryComponent } from './components/error-boundary/error-boundary.component';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <app-error-boundary>
      <app-layout></app-layout>
    </app-error-boundary>
  `,
})
export class AppComponent {
  title = 'shell';
}
