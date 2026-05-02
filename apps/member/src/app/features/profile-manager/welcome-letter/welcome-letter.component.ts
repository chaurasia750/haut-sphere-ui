import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-welcome-letter',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
  ],
  templateUrl: './welcome-letter.component.html',
})
export class WelcomeLetterComponent {}
