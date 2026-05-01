import { Component, Input } from '@angular/core';
@Component({ selector: 'app-faq-item-two', standalone: true, template: '<div></div>' })
export class FaqItemTwoComponent { @Input() answer = ''; @Input() question = ''; }
