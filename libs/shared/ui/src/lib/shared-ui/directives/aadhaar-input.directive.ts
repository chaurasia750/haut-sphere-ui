import { Directive, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sharedAadhaarInput]',
  host: { '(input)': 'onInput($event)' },
  standalone: true,
})
export class AadhaarInputDirective {
  private control = inject(NgControl);

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 12) value = value.slice(0, 12);

    // Format as XXXX XXXX XXXX
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');

    input.value = formatted;
    this.control.control?.setValue(formatted, { emitEvent: false });
  }
}
