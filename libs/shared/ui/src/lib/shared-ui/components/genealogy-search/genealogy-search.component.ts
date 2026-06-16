import { Component, OnInit, OnDestroy, input, output, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, of, debounceTime, switchMap, map, catchError, takeUntil } from 'rxjs';
import { SearchResult } from '../../services/genealogy-api.service';

@Component({
  selector: 'shared-genealogy-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative" #container>
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          #inputEl
          type="text"
          [(ngModel)]="query"
          (input)="onInput()"
          (keydown)="onKeydown($event)"
          (focus)="open.set(true)"
          [placeholder]="placeholder()"
          autocomplete="off"
          class="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-8 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors"
        />
        <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button *ngIf="query() && !loading()" type="button" (click)="clear(); $event.stopPropagation()"
            class="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <svg *ngIf="loading()" class="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      </div>

      @if (open() && query().trim() && results().length) {
        <div class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] overflow-hidden">
          @for (r of results(); track r.memberId) {
            <button
              class="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
              (click)="select(r); $event.stopPropagation()"
            >
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {{ r.name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-sm font-medium text-gray-800 truncate">{{ r.name }}</span>
                <span class="text-xs text-gray-400 truncate">{{ r.registrationNumber }}</span>
              </div>
            </button>
          }
          @if (totalResults() > results().length) {
            <div class="px-4 py-2 text-xs text-center text-gray-400 bg-gray-50">
              {{ totalResults() }} result{{ totalResults() !== 1 ? 's' : '' }} — type more to narrow
            </div>
          }
        </div>
      }

      @if (open() && query().trim() && !results().length && !loading()) {
        <div class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999]">
          <div class="flex flex-col items-center py-6 px-4 text-center">
            <svg class="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <p class="text-sm text-gray-400">No members found</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; position: relative; }
  `],
})
export class GenealogySearchComponent implements OnInit, OnDestroy {
  readonly searchFn = input.required<(query: string) => Observable<SearchResult[]>>();
  readonly placeholder = input('Search members...');
  readonly onSelect = output<SearchResult>();

  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<string>();

  readonly query = signal('');
  readonly results = signal<SearchResult[]>([]);
  readonly totalResults = signal(0);
  readonly loading = signal(false);
  readonly open = signal(false);

  ngOnInit(): void {
    this.search$.pipe(
      debounceTime(300),
      switchMap((q) => {
        const trimmed = q.trim();
        if (!trimmed) return of([]);
        this.loading.set(true);
        return this.searchFn()(trimmed).pipe(
          map((r) => r ?? []),
          catchError(() => of([])),
        );
      }),
      takeUntil(this.destroy$),
    ).subscribe((r) => {
      this.results.set(r);
      this.totalResults.set(r.length);
      this.loading.set(false);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(): void {
    this.open.set(true);
    this.search$.next(this.query());
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.query.set('');
      this.open.set(false);
      (event.target as HTMLInputElement).blur();
    }
  }

  select(result: SearchResult): void {
    this.query.set(`${result.name} (${result.registrationNumber})`);
    this.open.set(false);
    this.results.set([]);
    this.onSelect.emit(result);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    const el = (event.target as HTMLElement).closest('shared-genealogy-search');
    if (!el) {
      this.open.set(false);
    }
  }

  clear(): void {
    this.query.set('');
    this.open.set(false);
    this.results.set([]);
  }
}
