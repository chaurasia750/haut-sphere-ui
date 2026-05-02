import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@libs/shared/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { roleRouteMap } from '@libs/shared/auth';
import { TranslateModule } from '@ngx-translate/core';

/**
 * LoginComponent - Main login page component
 * Handles user credential input, form validation, and authentication
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormValueChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize reactive form with validators
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * Clear error message when user modifies form
   */
  private setupFormValueChanges(): void {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.errorMessage) {
          this.errorMessage = '';
        }
      });
  }

  /**
   * Handle form submission
   * Validates form, submits credentials to backend, and navigates based on role
   */
  onSubmit(): void {
    // Prevent submission if form is invalid or already loading
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.isLoading = true;
    this.loginForm.disable();

    this.authService.login(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Navigate based on role
          const route = roleRouteMap[response.roleId];
          this.router.navigate([route]);
        },
        error: (err) => {
          this.isLoading = false;
          this.loginForm.enable();
          this.handleLoginError(err);
        }
      });
  }

  /**
   * Map backend errors to user-friendly messages
   */
  private handleLoginError(error: any): void {
    const status = error.status;

    if (status === 401) {
      this.errorMessage = 'Invalid email or password';
    } else if (status >= 500) {
      this.errorMessage = 'System unavailable. Please try again later';
    } else if (status === 400) {
      this.errorMessage = 'Please check your email and password';
    } else {
      this.errorMessage = 'An error occurred. Please try again';
    }
  }

  /**
   * Get error message for a specific form field
   */
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }

    if (fieldName === 'email' && field.errors['email']) {
      return 'Please enter a valid email';
    }

    return '';
  }

  /**
   * Check if a field is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
