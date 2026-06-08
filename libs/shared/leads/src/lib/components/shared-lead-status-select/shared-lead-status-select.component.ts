import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LEADS_SERVICE } from '../../services/leads.service';
import { LeadLookupItem } from '../../models/lead-api.model';

@Component({
  selector: 'shared-lead-status-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-lead-status-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedLeadStatusSelectComponent),
      multi: true,
    },
  ],
})
export class SharedLeadStatusSelectComponent implements ControlValueAccessor, OnInit {
  private readonly leadsService = inject(LEADS_SERVICE);

  @Input() placeholderText = 'Select status';
  @Input() theme: 'light' | 'dark' = 'dark';
  @Input() showColor = true;

  statuses: LeadLookupItem[] = [];
  value: number | string = '';
  disabled = false;
  loading = true;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.leadsService.getLeadStatusLookup().subscribe({
      next: (data) => { this.statuses = data; this.loading = false; },
      error: () => { this.statuses = []; this.loading = false; },
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
