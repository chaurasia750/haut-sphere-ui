import { Component, input, output } from '@angular/core';
import { UiButtonComponent } from '../ui-button/ui-button.component';

@Component({
  selector: 'ui-back-button',
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <ui-button variant="outline" size="sm" (onClick)="back.emit()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
      </svg>
      {{ label() }}
    </ui-button>
  `,
})
export class UiBackButtonComponent {
  readonly label = input('Back');
  readonly back = output<void>();
}
