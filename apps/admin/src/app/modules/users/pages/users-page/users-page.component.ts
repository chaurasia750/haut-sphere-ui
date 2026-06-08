import { Component } from '@angular/core';
import { BreadcrumbItem } from '@shared/ui/src';

@Component({
  selector: 'app-users-page',
  standalone: false,
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
})
export class UsersPageComponent {
  title = 'User Management';
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Users' },
  ];
}
