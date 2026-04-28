import { Component } from '@angular/core';
import { ShellLayoutComponent } from './components/shell-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellLayoutComponent],
  template: `<app-shell-layout></app-shell-layout>`,
})
export class AppComponent {
  title = 'shell';
}
