import { Directive, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sharedPhoneFormat]',
  host: { '(input)': 'onInput($event)' },
  standalone: true,
})
export class PhoneFormatDirective {
  private control = inject(NgControl);

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '');
    if (digits.length > 10) digits = digits.slice(0, 10);

    // Format as XXXX XXXX XX
    let formatted = digits;
    if (digits.length > 8) {
      formatted = digits.slice(0, 4) + ' ' + digits.slice(4, 8) + ' ' + digits.slice(8);
    } else if (digits.length > 4) {
      formatted = digits.slice(0, 4) + ' ' + digits.slice(4);
    }

    input.value = formatted;
    this.control.control?.setValue(formatted, { emitEvent: false });
  }
}
