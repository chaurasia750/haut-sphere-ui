import { Directive, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sharedAadhaarInput]',
  host: { '(input)': 'onInput($event)' },
  standalone: true,
})
export class AadhaarInputDirective {
  private control = inject(NgControl);
  private el = inject(ElementRef);

  onInput(event: Event) {
    this.formatValue(event);
  }

  private formatValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 12) value = value.slice(0, 12);

    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');

    input.value = formatted;
    this.control.control?.setValue(formatted, { emitEvent: false });
  }
}
