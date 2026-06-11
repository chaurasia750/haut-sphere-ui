import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiButtonComponent } from '../ui-button/ui-button.component';

@Component({
  selector: 'shared-confirm-dialog',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  @Input({ required: true }) isOpen = false;
  @Input() title = 'Confirm';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() confirmLoading = false;
  @Input() maxWidth = 'max-w-lg';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onBackdropClick(): void {
    this.cancel.emit();
  }
}
