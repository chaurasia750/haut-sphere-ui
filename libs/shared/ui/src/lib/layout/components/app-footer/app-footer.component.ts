import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-app-footer',
  standalone: true,
  template: `<footer class="h-12 border-t border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between text-xs text-slate-500">
  <span>{{ text || 'Haut Spare Platform' }}</span>
  <span>{{ year }}</span>
</footer>`,
})
export class SharedAppFooterComponent {
  @Input() text = '';
  readonly year = new Date().getFullYear();
}
