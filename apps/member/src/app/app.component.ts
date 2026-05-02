import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SharedTranslationService } from '@shared/i18n';

@Component({
  selector: 'app-root',
  standalone: false,
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(
    private readonly title: Title,
    private readonly i18n: SharedTranslationService
  ) {}

  ngOnInit(): void {
    this.i18n.setDocumentTitle(this.title);
  }
}
