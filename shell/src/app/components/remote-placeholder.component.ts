import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoteMetadata, RemoteLoadState } from '@shared';

/**
 * Remote Placeholder Component
 * Displays loading spinner and error states while remotes are loading
 */
@Component({
  selector: 'app-remote-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="remote-placeholder" [ngSwitch]="getState()">
      <!-- Loading State -->
      <div *ngSwitchCase="'loading'" class="loading-state">
        <div class="spinner"></div>
        <p class="text-sm text-gray-600">Loading {{ displayName }}...</p>
      </div>

      <!-- Error State -->
      <div *ngSwitchCase="'error'" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Failed to Load</h3>
        <p class="error-message">
          {{ metadata?.error || 'Unable to load remote application' }}
        </p>
        <button (click)="onRetry()" class="retry-button">
          Try Again
        </button>
      </div>

      <!-- Idle/Unloaded State -->
      <div *ngSwitchCase="'idle'" class="idle-state">
        <p>Remote {{ displayName }} ready to load</p>
      </div>

      <!-- Default -->
      <div *ngSwitchDefault class="default-state">
        <p>{{ displayName }}</p>
      </div>
    </div>
  `,
  styles: [`
    .remote-placeholder {
      padding: 2rem;
      text-align: center;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e0e0e0;
      border-top: 3px solid #1976d2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .text-sm {
      font-size: 0.875rem;
      color: #666;
    }

    .text-gray-600 {
      color: #666;
    }

    .error-state {
      padding: 2rem;
      background: #ffebee;
      border-radius: 8px;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .error-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #c62828;
      margin: 0.5rem 0;
    }

    .error-message {
      color: #d32f2f;
      margin: 1rem 0;
      font-size: 0.95rem;
    }

    .retry-button {
      background: #d32f2f;
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }

    .retry-button:hover {
      background: #b71c1c;
    }

    .idle-state {
      color: #666;
      padding: 1rem;
    }

    .default-state {
      color: #999;
      padding: 1rem;
    }
  `]
})
export class RemoteePlaceholderComponent {
  @Input() remoteKey?: string;
  @Input() metadata?: RemoteMetadata;
  @Input() displayName: string = 'Remote';
  @Output() retry = new EventEmitter<string>();

  getState(): RemoteLoadState | string {
    if (!this.metadata) return 'idle';
    return this.metadata.state;
  }

  onRetry(): void {
    if (this.remoteKey) {
      this.retry.emit(this.remoteKey);
    }
  }
}
