import { Component } from '@angular/core';
import { BreadcrumbItem } from '@shared/ui/src';

@Component({
  selector: 'app-projects-page',
  standalone: false,
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss'],
})
export class ProjectsPageComponent {
  title = 'Projects';
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Projects' },
  ];
}
