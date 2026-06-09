import { CommonModule } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const MIN = 500_000;
const MAX = 500_000_000;

interface Preset {
  label: string;
  value: number;
}

@Component({
  selector: 'lib-amount-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amount-slider.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmountSliderComponent),
      multi: true,
    },
  ],
})
export class AmountSliderComponent implements ControlValueAccessor {
  readonly presets: Preset[] = [
    { label: '5 Lakhs', value: 500_000 },
    { label: '10 Lakhs', value: 1_000_000 },
    { label: '25 Lakhs', value: 2_500_000 },
    { label: '50 Lakhs', value: 5_000_000 },
    { label: '1 Cr', value: 10_000_000 },
    { label: '2 Cr', value: 20_000_000 },
    { label: '5 Cr', value: 50_000_000 },
    { label: '10 Cr', value: 100_000_000 },
    { label: '25 Cr', value: 250_000_000 },
    { label: '50 Cr', value: 500_000_000 },
  ];

  value: number | null = null;
  sliderPosition = 0;

  private onChange: (val: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  get formattedValue(): string {
    const amt = this.value;
    if (amt === null || amt === 0) return 'Not set';
    const cr = Math.floor(amt / 10_000_000);
    const lakh = Math.round((amt % 10_000_000) / 100_000);
    if (cr > 0 && lakh > 0) return `₹${cr}.${lakh} Cr`;
    if (cr > 0) return `₹${cr} Cr`;
    if (lakh > 0) return `₹${lakh} Lakhs`;
    return '₹' + amt.toLocaleString('en-IN');
  }

  private toSlider(amount: number): number {
    if (amount <= 0) return 0;
    const minLog = Math.log10(MIN);
    const maxLog = Math.log10(MAX);
    return ((Math.log10(amount) - minLog) / (maxLog - minLog)) * 100;
  }

  private toAmount(pos: number): number | null {
    if (pos <= 0) return null;
    const minLog = Math.log10(MIN);
    const maxLog = Math.log10(MAX);
    return Math.round(Math.pow(10, minLog + (pos / 100) * (maxLog - minLog)));
  }

  onSliderInput(event: Event): void {
    const pos = +(event.target as HTMLInputElement).value;
    this.sliderPosition = pos;
    this.value = this.toAmount(pos);
    this.onChange(this.value);
  }

  selectPreset(amount: number): void {
    this.value = amount;
    this.sliderPosition = this.toSlider(amount);
    this.onChange(amount);
  }

  isSelected(amount: number): boolean {
    return this.value === amount;
  }

  writeValue(val: number | null): void {
    this.value = val || null;
    this.sliderPosition = this.value ? this.toSlider(this.value) : 0;
  }

  registerOnChange(fn: (val: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
