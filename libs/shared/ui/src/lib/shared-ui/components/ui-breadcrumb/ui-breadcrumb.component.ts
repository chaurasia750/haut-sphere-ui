import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'ui-breadcrumb',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-3">
      @if (pageTitle()) {
        <h2 class="text-xl font-semibold text-[#111111]">
          {{ pageTitle() }}
        </h2>
      }
      <nav>
        <ol class="flex items-center gap-1.5">
          @for (item of items(); track $index; let last = $last) {
            <li>
              @if (last) {
                <span class="text-sm text-gray-700 font-medium">{{ item.label }}</span>
              } @else {
                <a class="inline-flex items-center gap-1.5 text-sm text-gray-500" [routerLink]="item.link || '.'">
                  {{ item.label }}
                  <svg class="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none">
                    <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              }
            </li>
          }
        </ol>
      </nav>
    </div>
  `,
})
export class UiBreadcrumbComponent {
  readonly pageTitle = input('');
  readonly items = input<BreadcrumbItem[]>([]);
}
