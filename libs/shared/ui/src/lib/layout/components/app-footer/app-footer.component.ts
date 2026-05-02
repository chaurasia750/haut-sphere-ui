import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-app-footer',
  standalone: true,
  templateUrl: './app-footer.component.html',
})
export class SharedAppFooterComponent {
  @Input() text = '';
  readonly year = new Date().getFullYear();
}
