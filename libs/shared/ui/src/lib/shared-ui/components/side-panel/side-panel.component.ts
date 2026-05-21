import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-side-panel',
  standalone: true,
  imports: [CommonModule],
  host: { 'ng-host': '' },
  templateUrl: './side-panel.component.html',
  styles: [`
    @keyframes slide-in-right {
      from { transform: translateX(100%); }
      to   { transform: translateX(0); }
    }
    .animate-slide-in {
      animation: slide-in-right 0.25s ease-out;
    }
  `],
})
export class SharedSidePanelComponent {
  @Input({ required: true }) isOpen = false;
  @Input() title = '';
  @Input() panelWidth = '480px';
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  onOverlayClick(): void {
    this.close();
  }
}
