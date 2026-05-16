import { CommonModule } from '@angular/common';
import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type TitleOption = 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Prof' | 'Er';

const TITLE_OPTIONS: TitleOption[] = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Er'];

@Component({
  selector: 'shared-title-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedTitleSelectComponent),
      multi: true,
    },
  ],
  templateUrl: './title-select.component.html',
})
export class SharedTitleSelectComponent implements ControlValueAccessor {
  readonly placeholder = input<string>('Title');
  readonly disabled = input<boolean>(false);

  readonly titleOptions = TITLE_OPTIONS;

  value: string | null = null;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // handled via template input binding
  }

  onValueChange(value: string | null): void {
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
