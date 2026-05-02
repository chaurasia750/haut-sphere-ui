import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({ selector: 'app-ai-sidebar-history', standalone: true, template: '<div></div>' })
export class AiSidebarHistoryComponent {
	@Input() isSidebarOpen = false;
	@Output() closeSidebar = new EventEmitter<void>();
}
