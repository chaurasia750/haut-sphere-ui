import { Component, Input } from '@angular/core';

@Component({ selector: 'app-faq-item-one', standalone: true, template: '<div></div>' })
export class FaqItemOneComponent {
	@Input() title = '';
	@Input() content = '';
	@Input() isOpen = false;
	@Input() toggleAccordion: (() => void) | null = null;
}
