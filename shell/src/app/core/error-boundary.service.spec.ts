import { TestBed } from '@angular/core/testing';
import { ErrorBoundaryService } from './error-boundary.service';

describe('ErrorBoundaryService', () => {
  let service: ErrorBoundaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorBoundaryService],
    });
    service = TestBed.inject(ErrorBoundaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('captureError', () => {
    it('should capture error and set hasError to true', (done) => {
      const error = new Error('Test error');
      service.captureError(error);

      service.hasError().subscribe((hasError) => {
        expect(hasError).toBe(true);
        done();
      });
    });

    it('should capture error with context', (done) => {
      const error = 'Test error message';
      const context = {
        remoteApp: 'admin',
        userId: 'user-123',
        userAction: 'Navigation',
      };

      service.captureError(error, context);

      service.getError().subscribe((errorDetails) => {
        expect(errorDetails?.error).toBe(error);
        expect(errorDetails?.remoteApp).toBe('admin');
        expect(errorDetails?.userId).toBe('user-123');
        expect(errorDetails?.userAction).toBe('Navigation');
        done();
      });
    });

    it('should include timestamp', (done) => {
      const beforeCapture = Date.now();
      service.captureError('Error');

      setTimeout(() => {
        service.getError().subscribe((errorDetails) => {
          expect(errorDetails?.timestamp).toBeGreaterThanOrEqual(beforeCapture);
          done();
        });
      }, 10);
    });
  });

  describe('clearError', () => {
    it('should clear error and set hasError to false', (done) => {
      service.captureError('Test error');
      service.clearError();

      service.hasError().subscribe((hasError) => {
        expect(hasError).toBe(false);
        done();
      });
    });

    it('should set error to null', (done) => {
      service.captureError('Test error');
      service.clearError();

      service.getError().subscribe((error) => {
        expect(error).toBeNull();
        done();
      });
    });
  });
});
