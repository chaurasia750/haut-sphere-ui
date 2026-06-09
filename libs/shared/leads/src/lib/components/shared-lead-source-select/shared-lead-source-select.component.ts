import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LEADS_SERVICE } from '../../services/leads.service';
import { LeadLookupItem } from '../../models/lead-api.model';

@Component({
  selector: 'shared-lead-source-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <select (change)="onSelect($event)" [disabled]="disabled"
      class="block w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 cursor-pointer"
      [ngClass]="theme === 'light'
        ? 'h-10 border-gray-200 text-gray-700 focus:border-[#FFC107] focus:ring-[#FFC107]/20'
        : 'h-11 border-default bg-surface text-primary-fg focus:border-[#FFD000] focus:ring-[#FFD000]/20'">
      @if (loading) {
        <option value="" disabled selected>Loading...</option>
      } @else {
        <option value="" disabled selected>{{ placeholderText }}</option>
        @for (s of sources; track s.id) {
          <option [value]="s.id" [selected]="value === s.id">{{ s.name }}</option>
        }
      }
    </select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedLeadSourceSelectComponent),
      multi: true,
    },
  ],
})
export class SharedLeadSourceSelectComponent implements ControlValueAccessor, OnInit {
  private readonly leadsService = inject(LEADS_SERVICE);

  @Input() placeholderText = 'Select source';
  @Input() theme: 'light' | 'dark' = 'dark';

  sources: LeadLookupItem[] = [];
  value: number | string = '';
  disabled = false;
  loading = true;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.leadsService.getLeadSources().subscribe({
      next: (data) => { this.sources = data; this.loading = false; },
      error: () => { this.sources = []; this.loading = false; },
    });
  }

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const val = select.value;
    const num = parseInt(val, 10);
    this.value = isNaN(num) ? val : num;
    this.onChange(this.value);
    this.onTouched();
  }
}
