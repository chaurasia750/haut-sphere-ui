import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { USERS_SERVICE } from '../../services/users.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

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
export class SharedUserSelectComponent implements ControlValueAccessor {
  private readonly usersService = inject(USERS_SERVICE);

  @Input() placeholderText = 'Select user';
  @Input() theme: 'light' | 'dark' = 'dark';

  readonly users$: Observable<User[]> = this.usersService.getUsers();
  value: number | string = '';
  disabled = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

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
