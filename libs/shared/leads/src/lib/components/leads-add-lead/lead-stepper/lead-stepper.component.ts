import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

export interface Step {
  id: number;
  label: string;
}

@Component({
  selector: 'lib-lead-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lead-stepper.component.html',
})
export class LeadStepperComponent {
  readonly steps = input<Step[]>([]);
  readonly currentStep = input<number>(1);
}
