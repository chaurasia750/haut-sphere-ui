import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutNotification } from '../../models/layout.models';

interface NotificationItem extends AppLayoutNotification {
  read: boolean;
}

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-dropdown.component.html',
})
export class NotificationDropdownComponent {
  isOpen = false;

  @Input() set notifications(value: AppLayoutNotification[]) {
    if (value && value.length > 0) {
      this._notifications = value.map((item) => ({ ...item, read: !!item.read }));
      return;
    }

    this._notifications = this.defaultNotifications();
  }

  private _notifications: NotificationItem[] = this.defaultNotifications();

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  get unreadCount() {
    return this._notifications.filter((item) => !item.read).length;
  }

  get items() {
    return this._notifications;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  markAllRead() {
    this._notifications = this._notifications.map((item) => ({ ...item, read: true }));
  }

  markRead(id: number) {
    this._notifications = this._notifications.map((item) =>
      item.id === id ? { ...item, read: true } : item
    );
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

  private defaultNotifications(): NotificationItem[] {
    return [
      { id: 1, title: 'Profile verification completed', time: '2m ago', read: false },
      { id: 2, title: 'New payout request update', time: '15m ago', read: false },
      { id: 3, title: 'Security alert: new login', time: '1h ago', read: true },
    ];
  }
}
