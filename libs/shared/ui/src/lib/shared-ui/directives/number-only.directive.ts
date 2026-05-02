import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[sharedNumberOnly]',
  standalone: true,
})
export class NumberOnlyDirective {
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text/plain') ?? '';
    if (!/^\d*$/.test(pasted)) {
      event.preventDefault();
    }
  }
}
