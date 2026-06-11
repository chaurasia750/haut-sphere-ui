import { Component, input, output } from '@angular/core';

export type UiButtonVariant = 'primary' | 'danger' | 'outline' | 'ghost' | 'yellow';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button
      type="button"
      [disabled]="disabled() || loading()"
      (click)="onClick.emit($event)"
      [class]="buttonClasses()">
      @if (loading()) {
        <div class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
      }
      <ng-content></ng-content>
      @if (label()) {
        <span>{{ label() }}</span>
      }
    </button>
  `,
})
export class UiButtonComponent {
  readonly variant = input<UiButtonVariant>('primary');
  readonly label = input('');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly onClick = output<Event>();

  readonly buttonClasses = (): string => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0';

    const sizes: Record<string, string> = {
      sm: 'rounded-lg px-3 py-1.5 text-xs',
      md: 'rounded-xl px-5 py-2.5 text-sm',
      lg: 'rounded-xl px-6 py-3 text-base',
    };

    const variants: Record<string, string> = {
      primary: 'bg-brand-500 text-black shadow-lg shadow-brand-500/25 hover:-translate-y-0.5 hover:shadow-xl hover:bg-brand-600 focus:ring-brand-500',
      danger: 'bg-red-500/90 text-white shadow-lg hover:bg-red-600 focus:ring-red-500',
      outline: 'border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 focus:ring-gray-200',
      ghost: 'text-gray-500 hover:bg-gray-100 focus:ring-gray-200',
      yellow: 'bg-[#FFC107] text-black shadow-sm hover:bg-[#FFD000] focus:ring-[#FFC107]/50',
    };

    return `${base} ${sizes[this.size()]} ${variants[this.variant()]}`;
  };
}
