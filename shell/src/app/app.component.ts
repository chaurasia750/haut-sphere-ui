import { Component } from '@angular/core';

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
