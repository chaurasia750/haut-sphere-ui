import { Component, OnInit, OnDestroy, Input, inject, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, catchError, takeUntil } from 'rxjs';
import { Tree } from 'primeng/tree';
import { TreeNode, PrimeTemplate } from 'primeng/api';
import { GenealogyApiService, SearchResult } from '../../services/genealogy-api.service';
import { GenealogySearchComponent } from '../genealogy-search/genealogy-search.component';

interface PTreeNode extends TreeNode {
  data: {
    memberId: string;
    name: string;
    registrationNumber: string;
    joiningDate: string;
    childrenCount: number;
  };
  children: PTreeNode[];
  loading?: boolean;
  childrenFetched?: boolean;
}

@Component({
  selector: 'shared-genealogy-tree',
  standalone: true,
  imports: [CommonModule, Tree, PrimeTemplate, GenealogySearchComponent],
  templateUrl: './genealogy-tree.component.html',
  styleUrls: ['./genealogy-tree.component.scss'],
})
export class GenealogyTreeComponent implements OnInit, OnDestroy {
  @Input({ required: true }) rootMemberId!: string;

  private readonly api = inject(GenealogyApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  loading = true;
  error = '';
  totalMembers = 0;
  treeNodes = signal<PTreeNode[]>([]);
  selectedMember = signal<PTreeNode['data'] | null>(null);

  ngOnInit(): void {
    this.loadRoot();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w.charAt(0).toUpperCase()).join('');
  }

  closeDetail(): void {
    this.selectedMember.set(null);
  }

  onCardClick(event: MouseEvent, node: PTreeNode): void {
    event.stopPropagation();
    this.selectedMember.set(node.data);
  }

  readonly searchFn = (q: string) => this.api.search(q);

  onSearchSelect(result: SearchResult): void {
    this.loading = true;
    this.api.getNode(result.memberId).pipe(
      catchError(() => {
        this.error = 'Member not found';
        this.loading = false;
        return [];
      }),
      takeUntil(this.destroy$),
    ).subscribe((n) => {
      const root = this.toPTreeNode(n);
      this.treeNodes.set([root]);
      this.totalMembers = 1;
      this.loading = false;
    });
  }

  onNodeExpand(event: any): void {
    this.loadChildren(event.node as PTreeNode);
  }

  loadRoot(): void {
    this.loading = true;
    this.error = '';
    this.treeNodes.set([]);
    this.totalMembers = 0;
    this.selectedMember.set(null);
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

  private loadChildren(parent: PTreeNode): void {
    if (parent.loading || parent.children) return;
    parent.loading = true;
    this.treeNodes.set([...this.treeNodes()]);

    this.api.expandNode(parent.data.memberId).pipe(
      catchError(() => {
        parent.loading = false;
        this.treeNodes.set([...this.treeNodes()]);
        this.cdr.markForCheck();
        return [];
      }),
      takeUntil(this.destroy$),
    ).subscribe((children) => {
      parent.loading = false;
      parent.children = children.length ? children.map((n) => {
        const child = this.toPTreeNode(n);
        child.parent = parent;
        return child;
      }) : [];
      this.totalMembers = this.countAll(this.treeNodes()[0]);
      this.treeNodes.set([...this.treeNodes()]);
      this.cdr.markForCheck();
    });
  }

  private toPTreeNode(n: { memberId: string; name: string; registrationNumber: string; joiningDate: string; hasChildren: boolean; childrenCount: number }): PTreeNode {
    return {
      key: n.memberId,
      label: n.name,
      type: 'node',
      data: { memberId: n.memberId, name: n.name, registrationNumber: n.registrationNumber, joiningDate: n.joiningDate, childrenCount: n.childrenCount },
      leaf: !n.hasChildren,
      expanded: false,
      childrenFetched: false,
    } as PTreeNode;
  }

  private countAll(node: PTreeNode): number {
    let c = 1;
    for (const ch of node.children || []) c += this.countAll(ch);
    return c;
  }
}
