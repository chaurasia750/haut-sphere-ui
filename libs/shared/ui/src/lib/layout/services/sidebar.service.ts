import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly isExpandedSubject = new BehaviorSubject<boolean>(true);
  private readonly isMobileOpenSubject = new BehaviorSubject<boolean>(false);
  private readonly isHoveredSubject = new BehaviorSubject<boolean>(false);

  readonly isExpanded$ = this.isExpandedSubject.asObservable();
  readonly isMobileOpen$ = this.isMobileOpenSubject.asObservable();
  readonly isHovered$ = this.isHoveredSubject.asObservable();

  setExpanded(val: boolean) {
    this.isExpandedSubject.next(val);
  }

  toggleExpanded() {
    this.isExpandedSubject.next(!this.isExpandedSubject.value);
  }

  setMobileOpen(val: boolean) {
    this.isMobileOpenSubject.next(val);
  }

  toggleMobileOpen() {
    this.isMobileOpenSubject.next(!this.isMobileOpenSubject.value);
  }

  setHovered(val: boolean) {
    this.isHoveredSubject.next(val);
  }
}
