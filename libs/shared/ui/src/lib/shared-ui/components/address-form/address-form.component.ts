import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NumberOnlyDirective } from '../../directives/number-only.directive';

@Component({
  selector: 'shared-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NumberOnlyDirective],
  templateUrl: './address-form.component.html',
})
export class SharedAddressFormComponent {
  @Input({ required: true }) formGroup!: FormGroup;
}
