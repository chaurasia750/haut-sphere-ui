import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { USERS_SERVICE } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'shared-user-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-user-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedUserSelectComponent),
      multi: true,
    },
  ],
})
export class SharedUserSelectComponent implements ControlValueAccessor, OnInit {
  private readonly usersService = inject(USERS_SERVICE);

  @Input() placeholderText = 'Select user';
  @Input() theme: 'light' | 'dark' = 'dark';

  users: User[] = [];
  value: number | string = '';
  disabled = false;
  loading = true;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: () => { this.users = []; this.loading = false; },
    });
  }

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const val = select.value;
    const num = parseInt(val, 10);
    this.value = isNaN(num) ? val : num;
    this.onChange(this.value);
    this.onTouched();
  }
}
