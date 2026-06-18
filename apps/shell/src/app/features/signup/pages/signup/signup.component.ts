import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SponsorRegistrationComponent } from '@shared/members/src';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    SponsorRegistrationComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {}

