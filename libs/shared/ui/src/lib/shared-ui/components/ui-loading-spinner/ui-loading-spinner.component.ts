import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-loading-spinner',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-3">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
        @if (text()) {
          <p class="text-sm text-gray-500">{{ text() }}</p>
        }
      </div>
    </div>
  `,
})
export class UiLoadingSpinnerComponent {
  readonly text = input('Loading...');
}
