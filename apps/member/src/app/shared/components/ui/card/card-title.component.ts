import { Component, Input } from '@angular/core';
@Component({ selector: 'app-card-title', standalone: true, template: '<span>{{title}}</span>' })
export class CardTitleComponent { @Input() title = ''; }
