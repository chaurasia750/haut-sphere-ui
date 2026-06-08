import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sharedCurrencyFormat]',
  standalone: true,
})
export class CurrencyFormatDirective {
  private control = inject(NgControl);

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[,\s]/g, '').toLowerCase().trim();

    const match = cleaned.match(/^([\d.]+)\s*(cr|l|k|)$/);
    if (!match || !match[1]) {
      input.value = '';
      this.control.control?.setValue('', { emitEvent: false });
      return;
    }

    const num = parseFloat(match[1]);
    const suffix = match[2];
    let total = num;
    if (suffix === 'cr') total = num * 10000000;
    else if (suffix === 'l') total = num * 100000;
    else if (suffix === 'k') total = num * 1000;

    const intVal = Math.round(total);
    input.value = new Intl.NumberFormat('en-IN').format(intVal);
    this.control.control?.setValue(intVal, { emitEvent: false });
  }
}
