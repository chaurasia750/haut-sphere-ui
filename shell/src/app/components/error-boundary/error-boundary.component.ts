import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorBoundaryService } from '../../core/error-boundary.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-boundary.component.html',
  styleUrls: ['./error-boundary.component.scss'],
})
export class ErrorBoundaryComponent implements OnInit {
  hasError$: Observable<boolean>;
  error$: Observable<any>;

  constructor(private errorBoundaryService: ErrorBoundaryService) {
    this.hasError$ = this.errorBoundaryService.hasError();
    this.error$ = this.errorBoundaryService.getError();
  }

  ngOnInit(): void {}

  onRetry(): void {
    this.errorBoundaryService.retry();
  }

  onDismiss(): void {
    this.errorBoundaryService.clearError();
  }

  goHome(): void {
    window.location.href = '/';
  }
}
