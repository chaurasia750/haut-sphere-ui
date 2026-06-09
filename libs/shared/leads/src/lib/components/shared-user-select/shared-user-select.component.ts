import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { USERS_SERVICE } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'shared-user-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  private readonly cdr = inject(ChangeDetectorRef);

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
      next: (data) => { this.users = data; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.users = []; this.loading = false; this.cdr.detectChanges(); },
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

  onSelect(val: any): void {
    const num = parseInt(val, 10);
    this.value = isNaN(num) ? val : num;
    this.onChange(this.value);
    this.onTouched();
  }
}
