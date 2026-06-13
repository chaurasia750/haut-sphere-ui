import { Component, OnInit, OnDestroy, Input, inject, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';
import { Tree } from 'primeng/tree';
import { TreeNode, PrimeTemplate } from 'primeng/api';
import { GenealogyApiService } from '../../services/genealogy-api.service';

interface PTreeNode extends TreeNode {
  data: {
    id: number;
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
  imports: [CommonModule, Tree, PrimeTemplate],
  templateUrl: './genealogy-tree.component.html',
  styleUrls: ['./genealogy-tree.component.scss'],
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

  onNodeExpand(event: any): void {
    const node = event.node as PTreeNode;
    if (!node || (node.children && node.children.length > 0)) return;
    this.loadChildren(node);
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
    if (parent.loading) return;
    parent.loading = true;
    this.treeNodes.set([...this.treeNodes()]);

    const leftId = 2 * parent.data.id;
    const rightId = 2 * parent.data.id + 1;
    let count = 0;

    const done = () => {
      if (++count < 2) return;
      this.totalMembers = this.countAll(this.treeNodes()[0]);
      this.replaceTreeNode(parent, (n) => {
        n.loading = false;
        n.childrenFetched = true;
        return n;
      });
    };

    this.api.getNode(leftId).pipe(catchError(() => EMPTY), takeUntil(this.destroy$))
      .subscribe((n) => {
        if (!parent.expanded) return;
        const child = this.toPTreeNode(n);
        child.parent = parent;
        parent.children.push(child);
      })
      .add(done);

    this.api.getNode(rightId).pipe(catchError(() => EMPTY), takeUntil(this.destroy$))
      .subscribe((n) => {
        if (!parent.expanded) return;
        const child = this.toPTreeNode(n);
        child.parent = parent;
        parent.children.push(child);
      })
      .add(done);
  }

  private replaceTreeNode(target: PTreeNode, update: (n: PTreeNode) => void): void {
    const clone = (n: PTreeNode): PTreeNode => {
      const c = { ...n, children: n.children?.map(clone) ?? [] };
      return c;
    };
    const walk = (nodes: PTreeNode[]): PTreeNode[] =>
      nodes.map(n => {
        if (n === target) {
          const cloned = clone(n);
          update(cloned);
          return cloned;
        }
        if (n.children?.length) return { ...n, children: walk(n.children) };
        return n;
      });
    this.treeNodes.set(walk(this.treeNodes()));
  }

  private toPTreeNode(n: { id: number; name: string; registrationNumber: string; joiningDate: string; hasChildren: boolean; childrenCount: number }): PTreeNode {
    return {
      label: n.name,
      type: 'node',
      data: { id: n.id, name: n.name, registrationNumber: n.registrationNumber, joiningDate: n.joiningDate, childrenCount: n.childrenCount },
      leaf: !n.hasChildren,
      expanded: false,
      children: [],
      childrenFetched: false,
    } as PTreeNode;
  }

  private countAll(node: PTreeNode): number {
    let c = 1;
    for (const ch of node.children || []) c += this.countAll(ch);
    return c;
  }
}
