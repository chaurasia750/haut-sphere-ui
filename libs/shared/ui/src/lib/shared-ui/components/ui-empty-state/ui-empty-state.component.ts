import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-empty-state',
  standalone: true,
  template: `
    <div class="rounded-2xl border border-gray-100 bg-white shadow-sm p-12 text-center">
      @if (iconType() === 'error') {
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
        </svg>
      } @else {
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
      }
      <h3 class="text-base font-semibold text-gray-900 mb-2">{{ heading() }}</h3>
      <p class="text-sm text-gray-500 mb-4">{{ message() }}</p>
      @if (actionLabel()) {
        <button (click)="onAction.emit()"
          class="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:bg-brand-600">
          @if (actionIcon()) {
            <span [innerHTML]="actionIcon()"></span>
          }
          {{ actionLabel() }}
        </button>
      }
      <ng-content></ng-content>
    </div>
  `,
})
export class UiEmptyStateComponent {
  readonly heading = input.required<string>();
  readonly message = input.required<string>();
  readonly actionLabel = input('');
  readonly actionIcon = input('');
  readonly iconType = input<'empty' | 'error'>('empty');

  readonly onAction = output<void>();
}
