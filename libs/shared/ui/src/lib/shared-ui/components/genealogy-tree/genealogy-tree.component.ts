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
    registrationNumber: string;
    joiningDate: string;
    childrenCount: number;
  };
  children: PTreeNode[];
  loading?: boolean;
}

@Component({
  selector: 'shared-genealogy-tree',
  standalone: true,
  imports: [CommonModule, Tree],
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

  private toPTreeNode(n: { id: number; name: string; registrationNumber: string; joiningDate: string; hasChildren: boolean; childrenCount: number }): PTreeNode {
    return {
      label: n.name,
      data: { id: n.id, name: n.name, registrationNumber: n.registrationNumber, joiningDate: n.joiningDate, childrenCount: n.childrenCount },
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
