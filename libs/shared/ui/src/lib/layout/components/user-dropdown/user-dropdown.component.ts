import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dropdown.component.html',
})
export class UserDropdownComponent {
  @Input() userName = 'Member User';
  @Input() userRole = 'Member';
  @Input() userLoginId?: string;
  @Output() signOut = new EventEmitter<void>();

  isOpen = false;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  get initials() {
    return this.userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  get displayLoginId(): string {
    return this.userLoginId?.trim() || this.userRole;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  onSignOut(): void {
    this.isOpen = false;
    this.signOut.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as Node | null;
    if (!target) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }
}
