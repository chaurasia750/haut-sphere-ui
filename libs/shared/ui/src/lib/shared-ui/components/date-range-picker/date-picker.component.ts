import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, CUSTOM_ELEMENTS_SCHEMA, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter, NativeDateAdapter, MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'shared-date-picker',
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
  templateUrl: './date-picker.component.html',
})
export class SharedDatePickerComponent implements OnChanges {
  @Input() label = '';
  @Input() placeholder = 'Select Date';
  @Input() value: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() disabled = false;
  @Input() required = false;
  @Input() errorMessage = '';
  @Output() valueChange = new EventEmitter<Date | null>();

  @ViewChild('picker') datepicker: any;

  dateControl = new FormControl<Date | null>(null);
  touched = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.dateControl.setValue(this.value, { emitEvent: false });
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.dateControl.disable({ emitEvent: false });
      } else {
        this.dateControl.enable({ emitEvent: false });
      }
    }
  }

  onInputClick(): void {
    if (this.datepicker) {
      this.datepicker.open();
    }
  }

  onPickerOpened(): void {}

  onPickerClosed(): void {
    this.touched = true;
  }

  onInputBlur(): void {
    this.touched = true;
  }

  onDateChange(date: Date | null): void {
    this.value = date;
    this.valueChange.emit(date);
  }

  clear(): void {
    this.dateControl.setValue(null);
    this.value = null;
    this.touched = true;
    this.valueChange.emit(null);
  }

  getIsInvalid(): boolean {
    return this.required && this.touched && !this.dateControl.value;
  }
}
