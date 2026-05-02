import { Component, Input } from '@angular/core';
@Component({ selector: 'app-card-description', standalone: true, template: '<p>{{description}}</p>' })
export class CardDescriptionComponent { @Input() description = ''; }
