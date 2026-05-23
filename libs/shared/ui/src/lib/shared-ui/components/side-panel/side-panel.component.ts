import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-side-panel',
  standalone: true,
  imports: [CommonModule],
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
  private _isOpen = false;
  @Input({ required: true }) set isOpen(value: boolean) {
    this._isOpen = value;
    document.body.style.overflow = value ? 'hidden' : '';
  }
  get isOpen(): boolean {
    return this._isOpen;
  }
  @Input() title = '';
  @Input() panelWidth = '480px';
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this._isOpen = false;
    this.closed.emit();
  }
}
