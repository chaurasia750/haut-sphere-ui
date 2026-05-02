import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SharedTranslationService {
  constructor(private readonly translate: TranslateService) {}

  init(defaultLang = 'en'): Observable<any> {
    this.translate.setDefaultLang(defaultLang);
    return this.translate.use(defaultLang).pipe(
      catchError(() => of(null))
    );
  }

  get(key: string | string[], params?: Record<string, unknown>): Observable<any> {
    return this.translate.get(key, params);
  }

  setDocumentTitle(title: Title, key = 'app.title', fallbackTitle = 'Anon India'): void {
    title.setTitle(fallbackTitle);

    this.init('en')
      .pipe(
        take(1),
        switchMap(() => this.get(key).pipe(take(1))),
        map((value) => {
          if (typeof value !== 'string') return fallbackTitle;
          const normalized = value.trim();
          if (!normalized || normalized === key) return fallbackTitle;
          return normalized;
        }),
        catchError(() => of(fallbackTitle))
      )
      .subscribe((resolvedTitle) => title.setTitle(resolvedTitle));
  }
}
