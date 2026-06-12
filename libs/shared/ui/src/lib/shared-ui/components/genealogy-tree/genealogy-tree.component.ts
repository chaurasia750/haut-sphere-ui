import { Component, OnInit, OnDestroy, Input, inject, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';
import { Tree } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { GenealogyApiService } from '../../services/genealogy-api.service';

interface PTreeNode extends TreeNode {
  data: {
    id: number;
    name: string;
    memberCode: string;
    childrenCount: number;
  };
  children: PTreeNode[];
  loading?: boolean;
}

@Component({
  selector: 'shared-genealogy-tree',
  standalone: true,
  imports: [CommonModule, Tree],
  template: `
    <div class="flex flex-col h-full w-full bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h16M4 20l6-6 4 4 6-6"/>
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-semibold text-gray-800">Sponsor Genealogy Tree</h2>
            <p class="text-xs text-gray-400" *ngIf="totalMembers > 0">{{ totalMembers }} members</p>
          </div>
        </div>
        <div *ngIf="loading" class="flex items-center gap-2 text-sm text-gray-400">
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Loading...
        </div>
      </div>

      <div class="flex-1 overflow-auto p-6 lg:p-8">
        <div *ngIf="loading && !treeNodes().length" class="flex items-center justify-center h-64">
          <div class="text-center">
            <svg class="w-10 h-10 mx-auto mb-3 text-blue-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h16M4 20l6-6 4 4 6-6"/>
            </svg>
            <p class="text-gray-400 text-sm">Loading genealogy tree...</p>
          </div>
        </div>
        <div *ngIf="!loading && error" class="flex items-center justify-center h-64">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-red-500 text-sm font-medium">{{ error }}</p>
            <button (click)="loadRoot()" class="mt-3 text-sm text-blue-600 hover:text-blue-700 underline">Retry</button>
          </div>
        </div>
        <div *ngIf="treeNodes().length" class="max-w-5xl mx-auto">
          <p-tree
            [value]="treeNodes()"
            (onNodeExpand)="onNodeExpand($event)"
            (onNodeCollapse)="onNodeCollapse($event)"
            class="genealogy-tree"
          >
            <ng-template pTreeNodeTemplate let-node>
              <div
                class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer select-none transition-all duration-200 min-w-[200px]"
                [class.border-amber-400]="selectedMember?.id === node.data.id"
                [class.border-gray-200]="selectedMember?.id !== node.data.id"
                [class.shadow-md]="selectedMember?.id === node.data.id"
                [class.shadow-sm]="selectedMember?.id !== node.data.id"
                [class.bg-amber-50]="selectedMember?.id === node.data.id"
                [class.bg-white]="selectedMember?.id !== node.data.id"
                [class.hover:border-blue-400]="selectedMember?.id !== node.data.id"
                [class.hover:shadow]="selectedMember?.id !== node.data.id"
                (click)="onNodeClick($event, node)">
                <div class="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  [class.bg-gradient-to-br]="true"
                  [class.from-blue-500]="true"
                  [class.to-indigo-600]="true"
                  [class.from-amber-500]="selectedMember?.id === node.data.id"
                  [class.to-orange-600]="selectedMember?.id === node.data.id">
                  {{ node.data.name.charAt(0).toUpperCase() }}
                </div>
                <div class="flex flex-col min-w-0 flex-1">
                  <span class="text-sm font-semibold text-gray-800 truncate">{{ node.data.name }}</span>
                  <span class="text-xs text-gray-400 truncate">{{ node.data.memberCode }}</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span *ngIf="node.data.childrenCount > 0" 
                    class="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {{ node.children?.length || 0 }}/{{ node.data.childrenCount }}
                  </span>
                  <div *ngIf="node.loading" class="w-4 h-4">
                    <svg class="w-4 h-4 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  </div>
                  <svg *ngIf="!node.leaf && node.children && node.expanded" class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                  <svg *ngIf="!node.leaf && !node.expanded" class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </ng-template>
          </p-tree>
        </div>
      </div>

      <div *ngIf="selectedMember"
        class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50 transition-transform duration-300">
        <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
              {{ selectedMember.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-800">{{ selectedMember.name }}</div>
              <div class="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                <span>Code: {{ selectedMember.memberCode }}</span>
                <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>ID: {{ selectedMember.id }}</span>
                <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{{ selectedMember.childrenCount }} child{{ selectedMember.childrenCount !== 1 ? 'ren' : '' }}</span>
              </div>
            </div>
          </div>
          <button (click)="closeDetail()"
            class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }

    :host ::ng-deep .genealogy-tree.p-tree {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
    }

    :host ::ng-deep .genealogy-tree .p-tree-node-content {
      padding: 3px 0 !important;
    }

    :host ::ng-deep .genealogy-tree .p-tree-node-toggler {
      display: none !important;
    }

    :host ::ng-deep .genealogy-tree .p-tree-node-children {
      position: relative !important;
      padding-left: 32px !important;
    }

    :host ::ng-deep .genealogy-tree .p-tree-node-children::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(to bottom, #93c5fd, #bfdbfe);
      border-radius: 1px;
    }

    :host ::ng-deep .genealogy-tree .p-tree-node {
      position: relative !important;
    }

    :host ::ng-deep .genealogy-tree .p-tree-node::before {
      content: '';
      position: absolute;
      left: -17px;
      top: 24px;
      width: 17px;
      height: 2px;
      background: linear-gradient(to right, #93c5fd, #bfdbfe);
    }

    :host ::ng-deep .genealogy-tree .p-tree-root-children > .p-tree-node::before {
      display: none;
    }

    :host ::ng-deep .genealogy-tree .p-tree-container {
      padding: 0 !important;
    }
  `],
})
export class GenealogyTreeComponent implements OnInit, OnDestroy {
  @Input({ required: true }) rootMemberId!: number;

  private readonly api = inject(GenealogyApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  loading = true;
  error = '';
  totalMembers = 0;
  treeNodes = signal<PTreeNode[]>([]);
  selectedMember: PTreeNode['data'] | null = null;

  ngOnInit(): void {
    this.loadRoot();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeDetail(): void {
    this.selectedMember = null;
  }

  onNodeClick(event: MouseEvent, node: PTreeNode): void {
    event.stopPropagation();
    this.selectedMember = node.data;

    if (node.leaf || node.loading) return;

    if (node.expanded) {
      node.expanded = false;
      this.treeNodes.set([...this.treeNodes()]);
      return;
    }

    if (node.children && node.children.length > 0) {
      node.expanded = true;
      this.treeNodes.set([...this.treeNodes()]);
      return;
    }

    this.loadChildren(node);
  }

  onNodeExpand(event: any): void {
    const node = event.node as PTreeNode;
    if (!node || (node.children && node.children.length > 0)) return;
    this.loadChildren(node);
  }

  onNodeCollapse(_event: any): void {
  }

  loadRoot(): void {
    this.loading = true;
    this.error = '';
    this.treeNodes.set([]);
    this.totalMembers = 0;
    this.selectedMember = null;
    this.cdr.markForCheck();

    this.api.getNode(this.rootMemberId).pipe(
      catchError(() => {
        this.error = 'Failed to load tree';
        return [];
      }),
      takeUntil(this.destroy$),
    ).subscribe((n) => {
      const root = this.toPTreeNode(n);
      this.treeNodes.set([root]);
      this.totalMembers = 1;
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  private swapTree(): void {
    const copy = [...this.treeNodes()];
    this.treeNodes.set([]);
    this.cdr.detectChanges();
    this.treeNodes.set(copy);
    this.cdr.detectChanges();
  }

  private loadChildren(parent: PTreeNode): void {
    if (parent.loading) return;
    parent.loading = true;
    this.cdr.detectChanges();

    const leftId = 2 * parent.data.id;
    const rightId = 2 * parent.data.id + 1;
    let count = 0;

    const done = () => {
      count++;
      if (count === 2) {
        parent.loading = false;
        parent.expanded = true;
        this.totalMembers = this.countAll(this.treeNodes()[0]);
        this.swapTree();
      }
    };

    this.api.getNode(leftId).pipe(catchError(() => EMPTY), takeUntil(this.destroy$))
      .subscribe((n) => {
        const child = this.toPTreeNode(n);
        child.parent = parent;
        parent.children = [...(parent.children || []), child];
      })
      .add(done);

    this.api.getNode(rightId).pipe(catchError(() => EMPTY), takeUntil(this.destroy$))
      .subscribe((n) => {
        const child = this.toPTreeNode(n);
        child.parent = parent;
        parent.children = [...(parent.children || []), child];
      })
      .add(done);
  }

  private toPTreeNode(n: { id: number; name: string; memberCode: string; hasChildren: boolean; childrenCount: number }): PTreeNode {
    return {
      label: n.name,
      data: { id: n.id, name: n.name, memberCode: n.memberCode, childrenCount: n.childrenCount },
      leaf: !n.hasChildren,
      expanded: false,
      children: [],
    } as PTreeNode;
  }

  private countAll(node: PTreeNode): number {
    let c = 1;
    for (const ch of node.children || []) c += this.countAll(ch);
    return c;
  }
}
