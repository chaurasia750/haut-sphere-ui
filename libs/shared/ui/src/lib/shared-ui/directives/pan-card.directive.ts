import { Directive, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sharedPanCard]',
  host: { '(input)': 'onInput($event)' },
  standalone: true,
})
export class PanCardDirective {
  private control = inject(NgControl);
  private el = inject(ElementRef);

  onInput(event: Event) {
    this.formatValue(event);
  }

  private formatValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase();
    let corrected = '';

    for (let i = 0; i < value.length && i < 10; i++) {
      const char = value[i];
      if (i < 5 && /[A-Z]/.test(char)) corrected += char;
      else if (i >= 5 && i < 9 && /[0-9]/.test(char)) corrected += char;
      else if (i === 9 && /[A-Z]/.test(char)) corrected += char;
    }

    input.value = corrected;
    this.control.control?.setValue(corrected, { emitEvent: false });
  }
}
