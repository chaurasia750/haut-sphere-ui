import { CommonModule } from '@angular/common';
import { Component, input, output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-member-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-3">
      <div class="relative max-w-sm flex-1">
        <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          [ngModel]="keyword"
          (ngModelChange)="onKeywordChange($event)"
          placeholder="Search by name, reg no, or mobile..."
          class="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#FFC107]/20"
        />
      </div>

      <select
        [ngModel]="status"
        (ngModelChange)="onStatusChange($event)"
        class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 shadow-sm focus:border-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#FFC107]/20"
      >
        <option [ngValue]="null">All Status</option>
        <option [ngValue]="1">Active</option>
        <option [ngValue]="0">Inactive</option>
      </select>
    </div>
  `,
})
export class MemberFiltersComponent implements OnInit {
  readonly keywordChange = output<string>();
  readonly statusChange = output<number | null>();
  readonly initialStatus = input<number | null>(null);

  keyword = '';
  status: number | null = null;

  ngOnInit(): void {
    const init = this.initialStatus();
    if (init !== null) {
      this.status = init;
    }
  }

  onKeywordChange(value: string): void {
    this.keyword = value;
    this.keywordChange.emit(value);
  }

  onStatusChange(value: number | null): void {
    this.status = value;
    this.statusChange.emit(value);
  }
}
