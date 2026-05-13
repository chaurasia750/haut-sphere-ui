import { OnInit, OnDestroy, AfterViewInit, Component, ElementRef, HostListener, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Network, Options } from 'vis-network';
import { DataSet } from 'vis-data';
import { Subject, of, EMPTY, takeUntil, debounceTime, switchMap, map, catchError, tap } from 'rxjs';
import { MlmTreeService, Member, MemberDetail } from '../../services/mlm-tree.service';

@Component({
  selector: 'shared-mlm-tree-vis',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mlm-tree-vis.component.html',
  styleUrl: './mlm-tree-vis.component.scss',
})
export class MlmTreeVisComponent implements OnInit, OnDestroy, AfterViewInit {
  protected Math = Math;
  private service = inject(MlmTreeService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  @ViewChild('networkContainer') networkContainer!: ElementRef;
  @ViewChild('minimapContainer') minimapContainer!: ElementRef;
  @ViewChild('searchBox') searchBox!: ElementRef;
  @ViewChild('badgesContainer') badgesContainer!: ElementRef;

  nodeBadges: { id: number; x: number; y: number; name: string; reg: string; active: boolean; pending: boolean; deactivated: boolean }[] = [];
  private badgeSyncTimer: any = null;

  private network!: Network;
  private minimapNetwork: Network | null = null;
  currentRoot = 1;
  maxRenderDepthValue = 0;
  renderDepth = 3;
  private collapsedIds = new Set<number>();
  searchQuery = '';
  showSearch = false;

  breadcrumbPathData: { id: number; name: string; role: string }[] = [];
  searchResultsData: Member[] = [];
  totalMemberCount = 0;
  private treeLoad$ = new Subject<{ rootId: number; depth: number }>();
  private breadcrumbLoad$ = new Subject<number>();
  private search$ = new Subject<string>();
  private subtreeLoad$ = new Subject<{ parentId: number; depth: number }>();
  private memberLoad$ = new Subject<number>();

  // History
  historyStack: number[] = [1];
  historyIndex = 0;

  // Side panel
  selectedMember: Member | null = null;
  selectedMemberUpline: { id: number; name: string; role: string }[] = [];
  panelVisible = false;

  // Custom tooltip
  tipVisible = false;
  tipX = 0;
  tipY = 0;
  tipMember: Member | null = null;
  private tipTimeout: any = null;

  // Context menu
  ctxVisible = false;
  ctxX = 0;
  ctxY = 0;
  ctxMember: Member | null = null;

  // Fullscreen
  isFullscreen = false;

  // Heatmap toggle
  heatmapMode = false;

  // Highlight
  highlightId: number | null = null;
  private highlightTimeout: any = null;
  private clickTimer: any = null;
  private clickPending: (() => void) | null = null;

  // Lazy loading
  private subtreeCache = new Map<string, Member[]>();
  lazyLoadingNodes = new Set<number>();

  members: Member[] = [];
  loading = true;
  fitPending = false;

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    const el = this.searchBox?.nativeElement;
    if (el && !el.contains(event.target as Node)) {
      this.showSearch = false;
    }
    if (this.ctxVisible) {
      this.ctxVisible = false;
    }
    this.hideTip();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.panelVisible) {
      this.closePanel();
      return;
    }
    if (event.key === 'Escape' && this.ctxVisible) {
      this.ctxVisible = false;
      return;
    }
    if (event.key === 'Escape' && this.isFullscreen) {
      this.toggleFullscreen();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault();
      this.showSearch = true;
      setTimeout(() => {
        const inp = this.searchBox?.nativeElement?.querySelector('input');
        if (inp) inp.focus();
      }, 50);
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      event.preventDefault();
      this.goBack();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
      event.preventDefault();
      this.goForward();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
      event.preventDefault();
      this.exportPNG();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
      event.preventDefault();
      this.toggleHeatmap();
      return;
    }
    if (event.key === 'ArrowLeft' && !this.panelVisible) {
      this.navigateDirection('left');
    }
    if (event.key === 'ArrowRight' && !this.panelVisible) {
      this.navigateDirection('right');
    }
    if (event.key === 'ArrowUp' && !this.panelVisible) {
      this.navigateParent();
    }
    if (event.key === 'ArrowDown' && !this.panelVisible) {
      this.navigateChild();
    }
  }

  ngOnInit() {
    this.treeLoad$.pipe(
      switchMap(({ rootId, depth }) => this.service.getTree(rootId, depth).pipe(
        tap(() => this.loading = true),
        catchError(() => EMPTY),
      )),
      takeUntil(this.destroy$),
    ).subscribe(res => {
      this.members = res.members;
      this.currentRoot = res.meta.rootId;
      this.maxRenderDepthValue = res.meta.maxDepth;
      this.renderDepth = Math.min(this.renderDepth, this.maxRenderDepthValue);
      this.totalMemberCount = res.meta.rootTotal;
      this.loading = false;
      if (this.breadcrumbPathData.length === 0) {
        this.breadcrumbPathData = [{ id: res.root.id, name: res.root.name, role: res.root.role }];
      }
      if (this.networkContainer) {
        this.buildNetwork(this.currentRoot);
        this.buildMinimap();
      }
      this.cdr.detectChanges();
    });

    this.subtreeLoad$.pipe(
      switchMap(({ parentId, depth }) => this.service.getSubtree(this.currentRoot, parentId, depth).pipe(
        catchError(() => EMPTY),
      )),
      takeUntil(this.destroy$),
    ).subscribe(res => {
      const key = `${res.parentId}-${res.depth}`;
      this.subtreeCache.set(key, res.members);
      this.lazyLoadingNodes.delete(res.parentId);
      for (const m of res.members) {
        const existing = this.members.findIndex(x => x.id === m.id);
        if (existing >= 0) this.members[existing] = m;
        else this.members.push(m);
      }
      if (this.networkContainer) {
        this.buildNetwork(this.currentRoot);
        this.buildMinimap();
      }
    });

    this.memberLoad$.pipe(
      switchMap(id => this.service.getMember(id).pipe(
        catchError(() => EMPTY),
      )),
      takeUntil(this.destroy$),
    ).subscribe((m: MemberDetail) => {
      this.selectedMember = m;
      this.selectedMemberUpline = m.upline || [];
      this.panelVisible = true;
    });

    this.breadcrumbLoad$.pipe(
      switchMap(id => this.service.getUpline(id).pipe(
        catchError(() => EMPTY),
      )),
      takeUntil(this.destroy$),
    ).subscribe(res => {
      if (res && res.path.length > 0) {
        this.breadcrumbPathData = res.path;
      }
      this.cdr.detectChanges();
    });

    this.search$.pipe(
      debounceTime(300),
      switchMap(query => {
        if (!query.trim()) return of([] as Member[]);
        return this.service.search(query).pipe(map(r => r.results));
      }),
      takeUntil(this.destroy$),
    ).subscribe(results => {
      this.searchResultsData = results;
      setTimeout(() => this.positionSearchDropdown(), 0);
    });

    this.treeLoad$.next({ rootId: 1, depth: this.renderDepth });
    this.breadcrumbLoad$.next(1);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.highlightTimeout) clearTimeout(this.highlightTimeout);
    if (this.clickTimer) clearTimeout(this.clickTimer);
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    if (this.badgeSyncTimer) clearTimeout(this.badgeSyncTimer);
    if (this.minimapNetwork) this.minimapNetwork.destroy();
    if (this.network) this.network.destroy();
  }

  ngAfterViewInit(): void {
    if (this.members.length) {
      this.buildNetwork(1);
      this.buildMinimap();
    }
  }

  // History
  goBack() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const id = this.historyStack[this.historyIndex];
      this.selectRootDirect(id, false);
    }
  }

  goForward() {
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyIndex++;
      const id = this.historyStack[this.historyIndex];
      this.selectRootDirect(id, false);
    }
  }

  pushHistory(id: number) {
    this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
    this.historyStack.push(id);
    this.historyIndex = this.historyStack.length - 1;
  }

  // Side panel
  closePanel() {
    this.panelVisible = false;
    this.selectedMember = null;
    this.selectedMemberUpline = [];
  }

  // Fullscreen
  toggleFullscreen() {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => this.isFullscreen = true).catch(() => {});
    } else {
      document.exitFullscreen().then(() => this.isFullscreen = false).catch(() => {});
    }
  }

  // Heatmap
  toggleHeatmap() {
    this.heatmapMode = !this.heatmapMode;
    if (this.networkContainer) this.buildNetwork(this.currentRoot);
  }

  // Export
  exportPNG() {
    const canvas = this.networkContainer?.nativeElement?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `mlm-tree-${this.currentRoot}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  exportPDF() {
    window.print();
  }

  // Context menu
  onRightClick(event: MouseEvent, member: Member) {
    event.preventDefault();
    this.ctxX = event.clientX;
    this.ctxY = event.clientY;
    this.ctxMember = member;
    this.ctxVisible = true;
  }

  ctxSelectRoot() {
    if (this.ctxMember) this.selectRoot(this.ctxMember.id);
    this.ctxVisible = false;
  }

  ctxShowDetail() {
    if (this.ctxMember) this.showMemberDetail(this.ctxMember.id);
    this.ctxVisible = false;
  }

  ctxToggleCollapse() {
    if (this.ctxMember) this.toggleCollapse(this.ctxMember.id);
    this.ctxVisible = false;
  }

  ctxCopyId() {
    if (this.ctxMember) navigator.clipboard.writeText(String(this.ctxMember.id));
    this.ctxVisible = false;
  }

  // Lazy load
  loadSubtree(parentId: number) {
    if (this.lazyLoadingNodes.has(parentId)) return;
    const key = `${parentId}-1`;
    if (this.subtreeCache.has(key)) {
      const cached = this.subtreeCache.get(key)!;
      for (const m of cached) {
        const existing = this.members.findIndex(x => x.id === m.id);
        if (existing >= 0) this.members[existing] = m;
        else this.members.push(m);
      }
      this.buildNetwork(this.currentRoot);
      return;
    }
    this.lazyLoadingNodes.add(parentId);
    this.subtreeLoad$.next({ parentId, depth: 1 });
  }

  // Navigate
  navigateDirection(dir: 'left' | 'right') {
    const m = this.getNode(this.currentRoot);
    if (!m) return;
    const child = dir === 'left' ? this.getLeftChildId(this.currentRoot) : this.getRightChildId(this.currentRoot);
    if (child) this.selectRoot(child);
  }

  navigateParent() {
    const m = this.getNode(this.currentRoot);
    if (m && m.parentId) this.selectRoot(m.parentId);
  }

  navigateChild() {
    const left = this.getLeftChildId(this.currentRoot);
    if (left) this.selectRoot(left);
  }

  get visibleCount(): number {
    const ids = this.getDescendants(this.currentRoot, true);
    return ids.size;
  }

  get treeTotal(): number {
    return this.totalMemberCount || this.getDescendants(this.currentRoot, false).size;
  }

  canGoBack = () => this.historyIndex > 0;
  canGoForward = () => this.historyIndex < this.historyStack.length - 1;

  // Volume stats for heatmap
  private getVolumeRange(): { min: number; max: number } {
    let min = Infinity, max = -Infinity;
    for (const m of this.members) {
      const v = m.volume ?? 0;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    return { min, max };
  }

  private heatmapColor(volume: number | undefined): string {
    if (!this.heatmapMode || volume == null) return '';
    const { min, max } = this.getVolumeRange();
    if (max === min) return '#6366f1';
    const t = (volume - min) / (max - min);
    const r = Math.round(99 + t * (239 - 99));
    const g = Math.round(102 + t * (68 - 102));
    const b = Math.round(241 + t * (255 - 241));
    return `rgb(${r},${g},${b})`;
  }

  private getNode(id: number): Member | undefined {
    return this.members.find((m) => m.id === id);
  }

  private getLeftChildId(id: number): number | null {
    const left = this.members.find((m) => m.parentId === id && m.placement === 'left');
    return left ? left.id : null;
  }

  private getRightChildId(id: number): number | null {
    const right = this.members.find((m) => m.parentId === id && m.placement === 'right');
    return right ? right.id : null;
  }

  private hasChildren(id: number): boolean {
    const m = this.getNode(id);
    return m ? m.hasChildren : false;
  }

  private levelOf(id: number): number {
    let m = this.getNode(id);
    let lv = 0;
    while (m && m.parentId) { lv++; m = this.getNode(m.parentId); }
    return lv;
  }

  private getDescendants(rootId: number, respectRenderDepth: boolean): Set<number> {
    const ids = new Set<number>();
    const queue: { id: number; level: number }[] = [{ id: rootId, level: 0 }];
    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      if (ids.has(id)) continue;
      ids.add(id);
      if (respectRenderDepth && level >= this.renderDepth) continue;
      if (this.collapsedIds.has(id)) continue;
      const left = this.getLeftChildId(id);
      const right = this.getRightChildId(id);
      if (left) queue.push({ id: left, level: level + 1 });
      if (right) queue.push({ id: right, level: level + 1 });
    }
    return ids;
  }

  private clearBadges() {
    this.nodeBadges = [];
    this.cdr.detectChanges();
  }

  increaseDepth() {
    if (this.renderDepth < this.maxRenderDepth) {
      this.renderDepth++;
      this.clearBadges();
      this.treeLoad$.next({ rootId: this.currentRoot, depth: this.renderDepth });
    }
  }

  decreaseDepth() {
    if (this.renderDepth > 0) {
      this.renderDepth--;
      this.collapsedIds.clear();
      this.clearBadges();
      this.treeLoad$.next({ rootId: this.currentRoot, depth: this.renderDepth });
    }
  }

  setDepth(d: number) {
    this.renderDepth = Math.max(0, Math.min(d, this.maxRenderDepth));
    this.collapsedIds.clear();
    this.clearBadges();
    this.treeLoad$.next({ rootId: this.currentRoot, depth: this.renderDepth });
  }

  compactAmount(n: number): string {
    if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr';
    if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return String(n);
  }

  get maxRenderDepth(): number {
    return this.maxRenderDepthValue;
  }

  private networkScale = 1;
  private resizeTimer: any = null;

  @HostListener('window:resize')
  onResize() {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      if (this.network && this.members.length) {
        this.buildNetwork(this.currentRoot);
        this.buildMinimap();
      }
    }, 200);
  }

  isSmallScreen(): boolean {
    return (this.networkContainer?.nativeElement?.offsetWidth ?? window.innerWidth) < 540;
  }

  private getNetworkScale(): number {
    const w = this.networkContainer?.nativeElement?.offsetWidth ?? window.innerWidth;
    if (w < 380) return 0.5;
    if (w < 480) return 0.6;
    if (w < 640) return 0.7;
    if (w < 900) return 0.85;
    return 1;
  }

  private buildMinimap() {
    if (!this.minimapContainer) return;
    if (!this.members.length) return;
    const rootLevel = this.levelOf(this.currentRoot);
    const validIds = this.getDescendants(this.currentRoot, false);
    const allMembers = this.members.filter(m => validIds.has(m.id) || m.id === this.currentRoot);
    const nodes = new DataSet(allMembers.map(m => ({
      id: m.id,
      label: '',
      shape: 'dot' as const,
      size: 3,
      borderWidth: m.id === this.currentRoot ? 2 : 0.5,
      color: { background: m.id === this.currentRoot ? '#f97316' : '#94a3b8', border: '#f97316' },
    })));
    const edgeData: any[] = [];
    for (const m of allMembers) {
      if (m.parentId) edgeData.push({ from: m.parentId, to: m.id, color: { color: '#cbd5e1', opacity: 0.4 }, width: 0.5 });
    }
    const edges = new DataSet(edgeData);
    if (this.minimapNetwork) this.minimapNetwork.destroy();
    this.minimapNetwork = new Network(this.minimapContainer.nativeElement, { nodes, edges }, {
      physics: false,
      interaction: { dragView: false, zoomView: false, hover: false },
      layout: {
        hierarchical: { enabled: true, direction: 'UD', sortMethod: 'directed', levelSeparation: 8, nodeSpacing: 10, treeSpacing: 12, parentCentralization: true },
      },
      edges: { smooth: { enabled: true, type: 'curvedCW', roundness: 0.2 } },
    });
  }

  private syncNodeBadges() {
    if (!this.network || !this.badgesContainer) return;
    if (this.renderDepth >= 5) {
      this.nodeBadges = [];
      this.cdr.detectChanges();
      return;
    }
    const positions = this.network.getPositions();
    const ids = Object.keys(positions);
    this.nodeBadges = [];
    for (const idStr of ids) {
      const id = Number(idStr);
      if (!Number.isFinite(id) || id <= 0) continue;
      const m = this.getNode(id);
      if (!m) continue;
      const level = this.levelOf(id);
      const domPt = this.network.canvasToDOM(positions[idStr]);
      const nSize = Math.max(40, 56 - level * 3) * this.networkScale;
      const radius = nSize / 2;
      this.nodeBadges.push({
        id,
        x: domPt.x,
        y: domPt.y + radius + 4,
        name: m.name || '',
        reg: m.registrationNumber ? '#' + m.registrationNumber : '',
        active: String(m.status) === 'Active' || String(m.status) === '1',
        pending: String(m.status) === 'Pending' || String(m.status) === '2',
        deactivated: String(m.status) === 'Deactivated' || String(m.status) === '3',
      });
    }
    this.cdr.detectChanges();
  }

  private buildNetwork(rootId: number) {
    if (!this.members.length) return;
    this.nodeBadges = [];
    this.cdr.detectChanges();
    if (this.badgeSyncTimer) clearTimeout(this.badgeSyncTimer);
    this.networkScale = this.getNetworkScale();
    const s = this.networkScale;
    const validIds = this.getDescendants(rootId, true);
    const filtered = this.members.filter((m) => validIds.has(m.id));
    const rootLevel = this.levelOf(rootId);
    const heatVolumes = this.heatmapMode ? this.getVolumeRange() : null;

    const edgeItems: any[] = [];
    const phNodes: any[] = [];
    for (const id of validIds) {
      const m = this.getNode(id);
      const left = this.getLeftChildId(id);
      const right = this.getRightChildId(id);
      const hasLeftChild = m?.leftChildExists ?? false;
      const hasRightChild = m?.rightChildExists ?? false;
      if (left) {
        edgeItems.push({
          from: id, to: left,
          color: { color: '#60a5fa', highlight: '#f97316', hover: '#fb923c', opacity: 0.85 },
          width: id === rootId ? 2.5 * s : 1.5 * s,
          smooth: { enabled: true, type: 'curvedCCW', roundness: 0.25 * s },
          arrows: { to: { enabled: true, scaleFactor: 0.5 * s } },
          label: 'L',
          font: { size: 10 * s, color: '#3b82f6', background: '#ffffff', strokeWidth: 0 },
        });
      } else if (!hasLeftChild) {
        const phId = -(id * 10 + 1);
        phNodes.push({
          id: phId, label: '',
          shape: 'box', size: 16 * s,
          borderWidth: 1.5 * s,
          color: { border: '#cbd5e1', background: 'transparent' },
          font: { size: 10 * s, color: '#94a3b8' },
          margin: { top: 2, bottom: 2, left: 2, right: 2 },
        });
        edgeItems.push({
          from: id, to: phId,
          color: { color: '#cbd5e1', opacity: 0.4 },
          width: 1 * s,
          smooth: { enabled: true, type: 'curvedCCW', roundness: 0.25 * s },
          dashes: [4, 3],
          label: 'L',
          font: { size: 8 * s, color: '#94a3b8', background: '#ffffff', strokeWidth: 0 },
        });
      }
      if (right) {
        edgeItems.push({
          from: id, to: right,
          color: { color: '#34d399', highlight: '#f97316', hover: '#fb923c', opacity: 0.85 },
          width: id === rootId ? 2.5 * s : 1.5 * s,
          smooth: { enabled: true, type: 'curvedCW', roundness: 0.25 * s },
          arrows: { to: { enabled: true, scaleFactor: 0.5 * s } },
          label: 'R',
          font: { size: 10 * s, color: '#10b981', background: '#ffffff', strokeWidth: 0 },
        });
      } else if (!hasRightChild) {
        const phId = -(id * 10 + 2);
        phNodes.push({
          id: phId, label: '',
          shape: 'box', size: 16 * s,
          borderWidth: 1.5 * s,
          color: { border: '#cbd5e1', background: 'transparent' },
          font: { size: 10 * s, color: '#94a3b8' },
          margin: { top: 2, bottom: 2, left: 2, right: 2 },
        });
        edgeItems.push({
          from: id, to: phId,
          color: { color: '#cbd5e1', opacity: 0.4 },
          width: 1 * s,
          smooth: { enabled: true, type: 'curvedCW', roundness: 0.25 * s },
          dashes: [4, 3],
          label: 'R',
          font: { size: 8 * s, color: '#94a3b8', background: '#ffffff', strokeWidth: 0 },
        });
      }
    }
    const allNodeData = [...filtered.map(m => {
      const hasKids = this.hasChildren(m.id);
      const collapsed = this.collapsedIds.has(m.id);
      const toggleIcon = collapsed ? ' ▶' : hasKids ? ' ▼' : '';
      const isLeafAtLimit = hasKids && this.levelOf(m.id) - rootLevel >= this.renderDepth;
      const isHighlighted = this.highlightId === m.id;
      const heatBg = heatVolumes && m.volume != null ? this.heatmapColor(m.volume) : undefined;
      return {
        id: m.id,
        label: toggleIcon,
        shape: 'circularImage' as const,
        image: this.resolveImg(m),
        size: isHighlighted ? this.nodeSize(m) * 1.25 : this.nodeSize(m),
        borderWidth: (m.id === rootId ? 5 : collapsed ? 3 : isHighlighted ? 4 : this.isActiveMember(m) ? 3 : this.isPending(m) ? 2.5 : 1.5) * s,
        borderDashes: collapsed ? [4, 3] : isLeafAtLimit ? [2, 2] : false,
        color: {
          border: heatBg || (m.id === rootId ? '#f97316' : collapsed ? '#f59e0b' : this.memberBorderColor(m)),
          background: heatBg || (m.id === rootId ? this.memberBgColor(m) : collapsed ? '#fef3c7' : isLeafAtLimit ? '#f1f5f9' : this.memberBgColor(m)),
          hover: {
            border: this.memberBorderColor(m),
            background: this.memberBgColor(m),
          },
        },
        shadow: {
          enabled: !this.isDeactivated(m),
          color: isHighlighted ? 'rgba(249,115,22,0.8)' : m.id === rootId ? 'rgba(249,115,22,0.6)' : collapsed ? 'rgba(245,158,11,0.5)' : this.isActiveMember(m) ? this.roleShadow(m.role) : this.isPending(m) ? 'rgba(217,119,6,0.3)' : 'rgba(0,0,0,0.05)',
          size: isHighlighted ? 35 : m.id === rootId ? 25 : collapsed ? 18 : this.isActiveMember(m) ? this.shadowSize(m) : this.isPending(m) ? 10 : 2,
          x: 0, y: 4,
        },
        font: {
          color: this.isActiveMember(m) || this.isPending(m) ? '#1f2937' : '#9ca3af',
          size: this.fontSize(m),
          face: 'Inter, system-ui, sans-serif',
          align: 'center' as const,
          multi: true,
          bold: { color: this.isActiveMember(m) || this.isPending(m) ? '#111827' : '#9ca3af', size: this.boldSize(m) },
        },
        title: `${m.name}\n${m.role} | Earnings: ₹${(m.earnings || 0).toLocaleString()}\nVolume: ₹${(m.volume || 0).toLocaleString()}\nPackage: ${m.pkg} | Status: ${this.memberStatus(m)}\nOnline: ${m.online ? '✅ Yes' : '❌ No'} | Level: ${this.levelOf(m.id)}`,
        margin: { top: 6, bottom: 12, left: 8, right: 8 },
        membership: m,
      };
    }), ...phNodes];
    const allEdges = new DataSet(edgeItems);

    const opts: Options = {
      nodes: {
        borderWidth: 3,
        shape: 'circularImage',
        font: { color: '#1f2937', face: 'Inter, system-ui, sans-serif', align: 'center' },
        shadow: { enabled: true },
      },
      edges: {
        smooth: { enabled: true, type: 'curvedCW', roundness: 0.25 },
        color: { color: '#cbd5e1', highlight: '#f97316' },
        width: 1.5 * s,
      },
      layout: {
        hierarchical: {
          enabled: true, direction: 'UD', sortMethod: 'directed',
          levelSeparation: 140 * s, nodeSpacing: 150 * s,
          treeSpacing: 180 * s, blockShifting: true,
          edgeMinimization: true, parentCentralization: true,
        },
      },
      physics: {
        enabled: false,
      },
      interaction: {
        hover: true, tooltipDelay: 150, zoomView: true,
        dragView: true, dragNodes: false,
      },
      configure: { enabled: false },
    };

    if (this.network) {
      this.network.setData({ nodes: new DataSet(allNodeData), edges: allEdges });
      this.network.setOptions(opts);
      this.network.fit({ animation: false });
    } else {
      this.network = new Network(this.networkContainer.nativeElement, { nodes: new DataSet(allNodeData), edges: allEdges }, opts);
      this.network.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
      this.alignTreeTop();
    }

    this.network.off('click');
    this.network.off('doubleClick');
    this.network.off('oncontext');
    this.network.off('hoverNode');
    this.network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const id = params.nodes[0];
        if (typeof id !== 'number' || id <= 0) return;
        const node = this.getNode(id);
        this.network.selectNodes([id], false);
        const atEdge = node && node.hasChildren && this.levelOf(id) - this.levelOf(rootId) >= this.renderDepth;
        if (this.clickTimer) clearTimeout(this.clickTimer);
        this.clickPending = () => {
          if (id !== this.currentRoot) {
            this.loadSubtree(id);
            this.selectRoot(id);
          }
        };
        this.clickTimer = setTimeout(this.clickPending, 280);
      }
    });
    this.network.on('doubleClick', (params) => {
      if (params.nodes.length > 0) {
        const id = params.nodes[0];
        if (typeof id !== 'number' || id <= 0) return;
        if (this.clickTimer) clearTimeout(this.clickTimer);
        this.clickPending = null;
        this.showMemberDetail(id);
      }
    });
    this.network.on('hoverNode', (params: any) => {
      const id = params.node;
      if (typeof id !== 'number' || id <= 0) return;
      const m = this.getNode(id);
      if (m) {
        const evt: MouseEvent = params.event;
        this.showTip(m, evt.clientX + 15, evt.clientY - 10);
      }
    });
    this.network.on('blurNode', () => {
      this.hideTip();
    });
    this.network.on('oncontext', (params) => {
      if (params.nodes.length > 0) {
        const id = params.nodes[0];
        if (typeof id !== 'number' || id <= 0) return;
        const member = this.getNode(id);
        if (member) {
          const rect = this.networkContainer.nativeElement.getBoundingClientRect();
          this.onRightClick({ clientX: rect.left + params.pointer.DOM.x, clientY: rect.top + params.pointer.DOM.y, preventDefault: () => {} } as MouseEvent, member);
        }
      }
    });
    this.network.on('dragEnd', () => this.syncNodeBadges());
    this.network.on('zoom', () => this.syncNodeBadges());
    this.badgeSyncTimer = setTimeout(() => this.syncNodeBadges(), 100);
  }

  private showTip(m: Member, x: number, y: number) {
    this.tipMember = m;
    this.tipX = Math.min(x, window.innerWidth - 210);
    this.tipY = Math.min(y, window.innerHeight - 260);
    this.tipVisible = true;
    this.cdr.detectChanges();
  }

  hideTip() {
    this.tipVisible = false;
    this.tipMember = null;
    this.cdr.detectChanges();
  }

  private alignTreeNow() {
    setTimeout(() => {
      try {
        const box = this.network.getBoundingBox(this.currentRoot);
        if (box && Number.isFinite(box.top)) {
          const canvas = this.network.canvasToDOM({ x: 0, y: box.top });
          const offset = canvas.y - 20;
          if (offset > 0) {
            this.network.moveTo({ offset: { x: 0, y: -offset }, animation: false });
          }
        }
      } catch {}
    }, 0);
  }

  private alignTreeTop() {
    setTimeout(() => {
      try {
        const box = this.network.getBoundingBox(this.currentRoot);
        const canvas = this.network.canvasToDOM({ x: 0, y: box.top });
        const offset = canvas.y - 20;
        if (offset > 0) {
          this.network.moveTo({ offset: { x: 0, y: -offset }, animation: { duration: 200, easingFunction: 'easeInOutQuad' } });
        }
      } catch {}
    }, 450);
  }

  private highlightNode(id: number) {
    if (!this.network) return;
    this.network.selectNodes([id], false);
    if (this.highlightTimeout) clearTimeout(this.highlightTimeout);
    this.highlightTimeout = setTimeout(() => {
      if (this.network && this.network.getSelectedNodes().length > 0) {
        this.network.selectNodes([]);
      }
    }, 1500);
  }

  toggleCollapse(id: number) {
    if (!this.hasChildren(id)) return;
    if (this.collapsedIds.has(id)) {
      this.collapsedIds.delete(id);
    } else {
      this.collapsedIds.add(id);
    }
    this.buildNetwork(this.currentRoot);
  }

  expandAll() {
    this.collapsedIds.clear();
    this.buildNetwork(this.currentRoot);
  }

  collapseAll() {
    for (const m of this.members) {
      if (this.hasChildren(m.id)) {
        this.collapsedIds.add(m.id);
      }
    }
    this.buildNetwork(this.currentRoot);
  }

  private nodeSize(m: Member): number {
    return Math.max(40, 56 - this.levelOf(m.id) * 3) * this.networkScale;
  }
  private fontSize(m: Member): number {
    return Math.max(13, 17 - this.levelOf(m.id)) * this.networkScale;
  }
  private boldSize(m: Member): number {
    return Math.max(14, 18 - this.levelOf(m.id)) * this.networkScale;
  }
  private shadowSize(m: Member): number {
    return Math.max(6, 14 - this.levelOf(m.id)) * this.networkScale;
  }

  private memberBorderColor(m: Member): string {
    const s = String(m.status);
    if (s === 'Active' || s === '1') return '#10b981';
    if (s === 'Pending' || s === '2') return '#f59e0b';
    if (s === 'Deactivated' || s === '3') return '#ef4444';
    return '#94a3b8';
  }

  private memberBgColor(m: Member): string {
    return '#f1f5f9';
  }

  private memberStatus(m: Member): string {
    const s = String(m.status);
    if (s === 'Active' || s === '1') return 'Active';
    if (s === 'Pending' || s === '2') return 'Pending';
    if (s === 'Deactivated' || s === '3') return 'Deactivated';
    return String(m.status);
  }

  roleColor(role: string, id?: number): string {
    const nameMap: Record<string, string> = {
      Crown: '#8b5cf6', Emerald: '#10b981', Diamond: '#6366f1',
      Gold: '#f59e0b', Silver: '#8b9dc3', Bronze: '#cd7f32', Basic: '#6b7280',
    };
    const rankMap: Record<string, string> = {
      '1': '#8b5cf6', '2': '#10b981', '3': '#6366f1',
      '4': '#f59e0b', '5': '#8b9dc3', '6': '#cd7f32', '7': '#6b7280',
    };
    const c = nameMap[role] || rankMap[role];
    if (c) return c;
    if (id != null) {
      const palette = ['#8b5cf6', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];
      return palette[id % palette.length];
    }
    return '#14b8a6';
  }

  resolveImg(m: Member): string {
    if (m.img) return m.img;
    const color = '#cbd5e1';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${color}"/><path d="M50 48c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15zm0 5c-10 0-30 5-30 15v7h60v-7c0-10-20-15-30-15z" fill="white" opacity="0.9"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  private roleShadow(role: string): string {
    const map: Record<string, string> = {
      Crown: 'rgba(139,92,246,0.5)', Emerald: 'rgba(16,185,129,0.5)',
      Diamond: 'rgba(99,102,241,0.5)', Gold: 'rgba(245,158,11,0.5)',
      Silver: 'rgba(139,157,195,0.4)', Bronze: 'rgba(205,127,50,0.4)',
      Basic: 'rgba(107,114,128,0.3)',
    };
    return map[role] || 'rgba(0,0,0,0.2)';
  }

  roleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      Crown: 'badge-crown', Emerald: 'badge-emerald', Diamond: 'badge-diamond',
      Gold: 'badge-gold', Silver: 'badge-silver', Bronze: 'badge-bronze', Basic: 'badge-basic',
    };
    return map[role] || 'badge-basic';
  }

  statusLabel(s: string | number): string {
    const v = String(s);
    if (v === '1' || v === 'Active') return 'Active';
    if (v === '2' || v === 'Pending') return 'Pending';
    if (v === '3' || v === 'Deactivated') return 'Deactivated';
    return v;
  }

  statusClass(s: string | number): string {
    const v = String(s);
    if (v === '1' || v === 'Active') return 'status-active';
    if (v === '2' || v === 'Pending') return 'status-pending';
    if (v === '3' || v === 'Deactivated') return 'status-deactivated';
    return 'status-inactive';
  }

  private isActiveMember(m: Member): boolean {
    const s = String(m.status);
    return s === 'Active' || s === '1';
  }

  private isPending(m: Member): boolean {
    const s = String(m.status);
    return s === 'Pending' || s === '2';
  }

  private isDeactivated(m: Member): boolean {
    const s = String(m.status);
    return s === 'Deactivated' || s === '3';
  }

  get breadcrumbPath(): { id: number; name: string; role: string }[] {
    return this.breadcrumbPathData;
  }

  get isAtRoot(): boolean { return this.currentRoot === 1; }

  get searchResults(): Member[] {
    return this.searchResultsData;
  }

  onSearchSelect(event: MouseEvent, id: number) {
    event.stopPropagation();
    this.selectRoot(id);
    this.searchQuery = '';
    this.showSearch = false;
  }

  onSearchInput() {
    this.showSearch = true;
    this.search$.next(this.searchQuery);
  }

  private positionSearchDropdown() {
    if (!this.isSmallScreen()) return;
    setTimeout(() => {
      const input = this.searchBox?.nativeElement?.querySelector('input');
      const dropdown = this.searchBox?.nativeElement?.querySelector('.search-dropdown');
      if (input && dropdown) {
        const rect = input.getBoundingClientRect();
        (dropdown as HTMLElement).style.position = 'fixed';
        (dropdown as HTMLElement).style.left = rect.left + 'px';
        (dropdown as HTMLElement).style.top = (rect.bottom + 4) + 'px';
        (dropdown as HTMLElement).style.width = rect.width + 'px';
        (dropdown as HTMLElement).style.zIndex = '9999';
      }
    }, 50);
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.searchQuery = '';
      this.showSearch = false;
      (event.target as HTMLInputElement).blur();
    }
  }

  selectRoot(id: number) {
    this.pushHistory(id);
    this.selectRootDirect(id, true);
  }

  private selectRootDirect(id: number, push = true) {
    this.currentRoot = id;
    this.renderDepth = 3;
    this.breadcrumbPathData = [];
    this.clearBadges();
    this.cdr.detectChanges();
    this.treeLoad$.next({ rootId: id, depth: this.renderDepth });
    this.breadcrumbLoad$.next(id);
    this.subtreeCache.clear();
  }

  showMemberDetail(id: number) {
    this.memberLoad$.next(id);
  }

  resetTree() { this.selectRoot(1); }
  fit() { this.network?.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } }); }
  zoomIn() { (this.network as any)?.zoomIn(0.2); }
  zoomOut() { (this.network as any)?.zoomOut(0.2); }
}
