import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ui-search-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <input
        [ngModel]="value()"
        (ngModelChange)="value.set($event); onSearch.emit($event)"
        [placeholder]="placeholder()"
        class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
      />
    </div>
  `,
})
export class UiSearchInputComponent {
  readonly value = model('');
  readonly placeholder = input('Search...');

  readonly onSearch = output<string>();
}
