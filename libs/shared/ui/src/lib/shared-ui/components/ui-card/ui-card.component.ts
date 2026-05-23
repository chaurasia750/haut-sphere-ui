import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  template: `
    <div [class]="cardClasses()">
      @if (header()) {
        <div class="px-6 py-5">
          <h3 class="text-base font-semibold text-gray-900">{{ header() }}</h3>
          @if (subheader()) {
            <p class="mt-1 text-sm text-gray-500">{{ subheader() }}</p>
          }
        </div>
        @if (divider()) {
          <div class="border-t border-gray-100"></div>
        }
      }
      @if (padding()) {
        <div class="p-6">
          <ng-content></ng-content>
        </div>
      } @else {
        <ng-content></ng-content>
      }
    </div>
  `,
})
export class UiCardComponent {
  readonly header = input('');
  readonly subheader = input('');
  readonly padding = input(true);
  readonly divider = input(true);
  readonly variant = input<'default' | 'borderless'>('default');

  readonly cardClasses = () => {
    const base = this.variant() === 'borderless'
      ? 'bg-white'
      : 'rounded-2xl border border-gray-100 bg-white shadow-sm';
    return base;
  };
}
