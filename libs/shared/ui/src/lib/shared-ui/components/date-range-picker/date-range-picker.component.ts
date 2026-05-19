import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, CUSTOM_ELEMENTS_SCHEMA, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter, NativeDateAdapter, MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'shared-date-range-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: { dateInput: 'DD/MM/YYYY' },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'DD/MM/YYYY',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
  templateUrl: './date-range-picker.component.html',
})
export class SharedDateRangePickerComponent implements OnChanges {
  @Input() label = '';
  @Input() startPlaceholder = 'Start';
  @Input() endPlaceholder = 'End';
  @Input() startValue: Date | null = null;
  @Input() endValue: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() disabled = false;
  @Input() required = false;
  @Input() errorMessage = '';
  @Output() startValueChange = new EventEmitter<Date | null>();
  @Output() endValueChange = new EventEmitter<Date | null>();
  @Output() valueChange = new EventEmitter<{ start: Date | null; end: Date | null }>();

  @ViewChild('startPicker') startPicker: any;
  @ViewChild('endPicker') endPicker: any;

  startControl = new FormControl<Date | null>(null);
  endControl = new FormControl<Date | null>(null);
  startTouched = false;
  endTouched = false;

  get startInvalid(): boolean {
    return this.required && this.startTouched && !this.startValue;
  }

  get endInvalid(): boolean {
    return this.required && this.endTouched && !this.endValue;
  }

  get effectiveMinDate(): Date | null {
    return this.minDate;
  }

  get effectiveMaxDate(): Date | null {
    return this.maxDate;
  }

  get startMaxDate(): Date | null {
    return this.endValue ?? this.maxDate;
  }

  get endMinDate(): Date | null {
    return this.startValue ?? this.minDate;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startValue']) {
      this.startControl.setValue(this.startValue, { emitEvent: false });
    }
    if (changes['endValue']) {
      this.endControl.setValue(this.endValue, { emitEvent: false });
    }
  }

  openStartPicker(): void {
    if (!this.disabled && this.startPicker) {
      this.startPicker.open();
    }
  }

  openEndPicker(): void {
    if (!this.disabled && this.endPicker) {
      this.endPicker.open();
    }
  }

  onStartClosed(): void {
    this.startTouched = true;
    const start = this.startControl.value;
    if (start !== this.startValue) {
      this.startValue = start;
      this.startValueChange.emit(start);
      this.valueChange.emit({ start, end: this.endValue });
      if (start && this.endValue && start > this.endValue) {
        this.clearEnd();
      }
      if (start && !this.endValue) {
        setTimeout(() => this.openEndPicker(), 200);
      }
    }
  }

  onEndClosed(): void {
    this.endTouched = true;
    const end = this.endControl.value;
    if (end !== this.endValue) {
      this.endValue = end;
      this.endValueChange.emit(end);
      this.valueChange.emit({ start: this.startValue, end });
      if (end && this.startValue && end < this.startValue) {
        this.clearStart();
      }
    }
  }

  onStartBlur(): void {
    this.startTouched = true;
  }

  onEndBlur(): void {
    this.endTouched = true;
  }

  clear(): void {
    this.clearStart();
    this.clearEnd();
    this.valueChange.emit({ start: null, end: null });
  }

  private clearStart(): void {
    this.startValue = null;
    this.startControl.setValue(null, { emitEvent: false });
    this.startValueChange.emit(null);
  }

  private clearEnd(): void {
    this.endValue = null;
    this.endControl.setValue(null, { emitEvent: false });
    this.endValueChange.emit(null);
  }

  hasValue(): boolean {
    return !!this.startValue || !!this.endValue;
  }
}
