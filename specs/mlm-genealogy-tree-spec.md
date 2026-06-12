# MLM Genealogy Tree — Complete UI Implementation Specification

---

## Table of Contents
1. [Architecture & Component Tree](#1-architecture--component-tree)
2. [API Contract & Data Mapping](#2-api-contract--data-mapping)
3. [Complete UI Flow](#3-complete-ui-flow)
4. [User Interaction Flow](#4-user-interaction-flow)
5. [API Call Sequences](#5-api-call-sequences)
6. [Search Flow](#6-search-flow)
7. [Locate Member Flow](#7-locate-member-flow)
8. [Expand Node Flow](#8-expand-node-flow)
9. [Member Details Flow](#9-member-details-flow)
10. [State Management Strategy](#10-state-management-strategy)
11. [Performance Strategy](#11-performance-strategy)
12. [Library Integration Strategy](#12-library-integration-strategy)
13. [Complete UI Behaviour Specification](#13-complete-ui-behaviour-specification)
14. [Edge Cases](#14-edge-cases)
15. [Recommended UX for Large Trees](#15-recommended-ux-for-large-trees)

---

## 1. Architecture & Component Tree

### 1.1 Library Structure (under `libs/shared/ui/src/lib/shared-ui/`)

```
shared-ui/
├── models/
│   └── genealogy.model.ts                  # All interfaces
├── services/
│   ├── genealogy-api.service.ts             # API calls + mapping
│   └── genealogy-tree.store.ts              # State management
├── components/
│   ├── genealogy-tree/
│   │   ├── genealogy-tree.component.ts       # Main tree component
│   │   ├── genealogy-tree.component.html
│   │   └── genealogy-tree.component.scss
│   ├── genealogy-member-card/
│   │   ├── genealogy-member-card.component.ts
│   │   └── genealogy-member-card.component.html
│   ├── genealogy-search/
│   │   ├── genealogy-search.component.ts
│   │   └── genealogy-search.component.html
│   └── genealogy-member-detail/
│       ├── genealogy-member-detail.component.ts
│       └── genealogy-member-detail.component.html
├── genealogy-tree.module.ts                # Shared module for NgModule consumers
└── index.ts                                # Barrel exports
```

### 1.2 Re-export from `libs/shared/ui/src/index.ts`

```typescript
export * from './lib/shared-ui/models/genealogy.model';
export * from './lib/shared-ui/services/genealogy-api.service';
export * from './lib/shared-ui/services/genealogy-tree.store';
export * from './lib/shared-ui/components/genealogy-tree/genealogy-tree.component';
export * from './lib/shared-ui/components/genealogy-member-card/genealogy-member-card.component';
export * from './lib/shared-ui/components/genealogy-search/genealogy-search.component';
export * from './lib/shared-ui/components/genealogy-member-detail/genealogy-member-detail.component';
```

### 1.3 App Integration

Both **member** and **tenant (admin)** apps import the component:

```typescript
// apps/member/src/app/modules/genealogy/genealogy-page.component.ts
// apps/admin/src/app/modules/tree-visualization/pages/genealogy-page.component.ts
import { GenealogyTreeComponent } from '@shared/ui/src';
```

```html
<shared-genealogy-tree
  rootMemberId="12345"
  apiBaseUrl="/api/genealogy"
  (onMemberSelect)="handleMemberSelect($event)"
/>
```

---

## 2. API Contract & Data Mapping

### 2.1 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `GET /api/genealogy/node/{memberId}` | GET | Load single node + its immediate children |
| `GET /api/genealogy/expand/{memberId}` | GET | Load children of a specific node (lazy expand) |
| `GET /api/genealogy/search?keyword=` | GET | Search members by name/ID |
| `GET /api/genealogy/path/{memberId}` | GET | Get upline path from member to root |
| `GET /api/genealogy/member/{memberId}` | GET | Get full member details for side panel |

### 2.2 Assumed API Response Shapes

```typescript
// GET /api/genealogy/node/{memberId}
interface ApiNodeResponse {
  data: {
    node: ApiMember;
    children?: ApiMember[];   // immediate children (left/right)
  };
}

// GET /api/genealogy/expand/{memberId}
interface ApiExpandResponse {
  data: {
    parentId: number;
    children: ApiMember[];    // children of the requested node
  };
}

// GET /api/genealogy/search?keyword=
interface ApiSearchResponse {
  data: {
    results: ApiMember[];
    total: number;
  };
}

// GET /api/genealogy/path/{memberId}
interface ApiPathResponse {
  data: {
    path: ApiAncestor[];
  };
}

// GET /api/genealogy/member/{memberId}
interface ApiMemberResponse {
  data: ApiMemberDetail;
}

interface ApiAncestor {
  id: number;
  name: string;
  registrationNumber?: string;
  level?: number;
}

interface ApiMember {
  id: number;
  name: string;
  sponsorId: number;
  placement: 'L' | 'R' | null;
  position: 'left' | 'right' | null;
  level: number;
  status: string | number;
  package: string | null;
  image: string | null;
  registrationNumber: string | null;
  hasChildren: boolean;
  childrenCount: number;
  isActive: boolean;
  joinDate: string;
  volume?: number;
  earnings?: number;
}

interface ApiMemberDetail extends ApiMember {
  sponsorName: string;
  upline: ApiAncestor[];
  downlineCount: number;
  totalTeamSize: number;
  leftCount: number;
  rightCount: number;
  mobile: string;
  email: string;
  address: string;
  kycStatus: string;
  totalIncome: number;
  totalWithdrawal: number;
  availableBalance: number;
  lastActivity: string;
}
```

### 2.3 Frontend Models

```typescript
export interface TreeNode {
  id: number;
  name: string;
  sponsorId: number;
  placement: 'left' | 'right' | null;
  level: number;
  status: MemberStatus;
  package: string;
  image: string;
  registrationNumber: string;
  hasChildren: boolean;
  childrenCount: number;
  isActive: boolean;
  joinDate: string;
  volume: number;
  earnings: number;
  // Frontend-only state
  isEmpty: boolean;
  isLoading: boolean;
  isExpanded: boolean;
  isHighlighted: boolean;
  children: TreeNode[];
}

export type MemberStatus = 'Active' | 'Pending' | 'Deactivated' | 'Blocked';

export interface Ancestor {
  id: number;
  name: string;
  registrationNumber: string;
  level: number;
}

export interface MemberDetail {
  // Basic
  id: number;
  name: string;
  registrationNumber: string;
  sponsorId: number;
  sponsorName: string;
  placement: 'left' | 'right' | null;
  level: number;
  status: MemberStatus;
  package: string;
  image: string;
  // Contact
  mobile: string;
  email: string;
  address: string;
  // KYC
  kycStatus: string;
  joinDate: string;
  lastActivity: string;
  // Business
  volume: number;
  earnings: number;
  totalIncome: number;
  totalWithdrawal: number;
  availableBalance: number;
  // Team
  downlineCount: number;
  totalTeamSize: number;
  leftCount: number;
  rightCount: number;
  activeCount: number;
  // Upline
  upline: Ancestor[];
}

export interface TreeNodeMap {
  [id: number]: TreeNode;
}

export interface GenealogyState {
  rootId: number;
  nodes: TreeNodeMap;
  rootNodeId: number;
  highlightedNodeId: number | null;
  selectedMemberId: number | null;
  memberDetail: MemberDetail | null;
  detailLoading: boolean;
  memberDetailError: string | null;
  searchResults: SearchResultItem[];
  searchQuery: string;
  isSearching: boolean;
  searchError: string | null;
  pathNodes: Ancestor[];
  loading: boolean;
  loadingMessage: string;
  error: string | null;
  expandQueue: number[];
  isExpanding: Set<number>;
}

export interface SearchResultItem {
  id: number;
  name: string;
  registrationNumber: string;
  package: string;
  image: string;
  status: MemberStatus;
  level: number;
  placement: 'left' | 'right' | null;
}
```

### 2.4 API Mapping Functions

```typescript
function mapApiMemberToNode(api: ApiMember, isEmpty = false): TreeNode {
  return {
    id: api.id,
    name: isEmpty ? '' : api.name || '',
    sponsorId: api.sponsorId,
    placement: api.placement === 'L' ? 'left' : api.placement === 'R' ? 'right' : null,
    level: api.level || 0,
    status: mapStatus(api.status),
    package: isEmpty ? '' : api.package || '',
    image: isEmpty ? '' : api.image || '',
    registrationNumber: isEmpty ? '' : api.registrationNumber || '',
    hasChildren: api.hasChildren,
    childrenCount: api.childrenCount || 0,
    isActive: api.isActive,
    joinDate: api.joinDate || '',
    volume: api.volume || 0,
    earnings: api.earnings || 0,
    isEmpty,
    isLoading: false,
    isExpanded: false,
    isHighlighted: false,
    children: [],
  };
}

function mapStatus(status: string | number): MemberStatus {
  const s = String(status);
  if (s === '1' || s === 'Active') return 'Active';
  if (s === '2' || s === 'Pending') return 'Pending';
  if (s === '3' || s === 'Deactivated') return 'Deactivated';
  if (s === '4' || s === 'Blocked') return 'Blocked';
  return 'Pending';
}
```

---

## 3. Complete UI Flow

### 3.1 Initial Load

```
1. User navigates to genealogy tree page
2. Page component renders <shared-genealogy-tree rootMemberId="12345" />
3. GenealogyTreeComponent.ngOnInit()
   → dispatch LOAD_ROOT
4. Store sets loading=true, loadingMessage="Loading genealogy tree..."
5. GenealogyApiService.getNode(rootMemberId) called
   → GET /api/genealogy/node/12345
6. On success:
   → mapApiMemberToNode() for root + children
   → Store: nodes populated, loading=false
   → Render tree via vis-network / canvas
7. On error:
   → Store: error="Failed to load tree", loading=false
   → Show error state with retry button
```

### 3.2 Page Layout

```
┌──────────────────────────────────────────────────────┐
│  Toolbar                                             │
│  [← Back] [→ Forward] [Root] [Fit] [Zoom] [Search]  │
│  Breadcrumb: Root > Level 1 > Level 2                 │
├──────────────────────────────────────────────────────┤
│                                                        │
│              ┌───── Root ─────┐                        │
│              │   (highlight)   │                        │
│         Left ┴───┐       ┌───┴ Right                   │
│              ┌───┴──┐ ┌───┴──┐                         │
│              │ L1 C │ │ L1 D │                         │
│           ┌──┴──┐     ┌──┴──┐                          │
│           │ L2  │     │ L2  │                          │
│         ┌──┴──┐       ┌──┴──┐                          │
│         │ L3  │       │ L3  │                          │
│                                                        │
├──────────────────────────────────────────────────────┤
│  Status: Showing 4 levels | 30/15,423 visible/total    │
└──────────────────────────────────────────────────────┘
```

### 3.3 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| ≥1200px | Full tree + side panel side-by-side |
| 768–1199px | Tree full-width, side panel as overlay |
| <768px | Tree with simplified nodes, side panel full-screen drawer |

---

## 4. User Interaction Flow

### 4.1 Click / Double-click

```
Click on non-root node:
  → Navigate to that node as new root (re-root)
  → Load node + children
  → Update breadcrumb

Double-click on any node:
  → Show member detail in side panel
  → GET /api/genealogy/member/{id}

Click on "+" expand icon:
  → Load children via GET /api/genealogy/expand/{id}
  → Insert children into tree
  → Mark node as expanded
```

### 4.2 Right-click Context Menu

```
Right-click on node:
  → Show context menu at cursor position:
    • View as Root
    • Show Details
    • Expand/Collapse
    • Copy ID
    • Locate in Full Tree (if in search context)
```

### 4.3 Keyboard Navigation

| Shortcut | Action |
|---|---|
| Ctrl+F | Focus search |
| Ctrl+Z | Go back in history |
| Ctrl+Y | Go forward in history |
| Arrow Up | Navigate to parent |
| Arrow Left/Right | Navigate to left/right child |
| Arrow Down | Navigate to first child |
| Escape | Close panel / context menu |
| +/- | Zoom in/out |
| Ctrl+E | Export PNG |
| Ctrl+M | Toggle heatmap mode |

---

## 5. API Call Sequences

### 5.1 Initial Tree Load

```
UI                          Store                       API
 │                           │                           │
 ├─ ngOnInit() ─────────────►│                           │
 │                           ├─ loading=true             │
 │                           ├─ dispatch(loadRoot) ─────►│
 │                           │                           ├─ GET /api/genealogy/node/{rootId}
 │                           │                           │
 │                           │◄──── ApiNodeResponse ─────┤
 │                           ├─ loading=false            │
 │                           ├─ nodes[rootId] = mapped   │
 │                           ├─ for child in children:   │
 │                           │   nodes[child.id] = mapped │
 │◄──── render tree ─────────┤                           │
```

### 5.2 Expand Node

```
UI                          Store                       API
 │                           │                           │
 ├─ click expand(+) ───────►│                           │
 │                           ├─ nodes[id].isLoading=true │
 │                           ├─ dispatch(expandNode) ───►│
 │                           │                           ├─ GET /api/genealogy/expand/{id}
 │                           │                           │
 │                           │◄── ApiExpandResponse ─────┤
 │                           ├─ nodes[id].isExpanded=true│
 │                           ├─ nodes[id].isLoading=false│
 │                           ├─ for child in children:   │
 │                           │   nodes[child.id] = mapped│
 │◄──── update tree ─────────┤                           │
```

### 5.3 Re-root Navigation

```
UI                          Store                       API
 │                           │                           │
 ├─ click node(id=567) ────►│                           │
 │                           ├─ rootNodeId = 567          │
 │                           ├─ loading=true              │
 │                           ├─ dispatch(loadRoot) ─────►│
 │                           │                           ├─ GET /api/genealogy/node/567
 │                           │                           │
 │                           │◄──── ApiNodeResponse ─────┤
 │                           ├─ loading=false             │
 │◄──── render new tree ─────┤                           │
 │                           │                           │
 ├─ also fetch breadcrumb ──►│                           │
 │                           ├─ dispatch(loadPath) ─────►│
 │                           │                           ├─ GET /api/genealogy/path/567
 │                           │                           │
 │                           │◄─── ApiPathResponse ──────┤
 │◄──── update breadcrumb ───┤                           │
```

### 5.4 Member Detail

```
UI                          Store                       API
 │                           │                           │
 ├─ double-click node ──────►│                           │
 │                           ├─ detailLoading=true        │
 │                           ├─ dispatch(loadDetail) ───►│
 │                           │                           ├─ GET /api/genealogy/member/{id}
 │                           │                           │
 │                           │◄─── ApiMemberResponse ────┤
 │                           ├─ memberDetail = mapped     │
 │                           ├─ detailLoading=false       │
 │◄──── show side panel ─────┤                           │
```

### 5.5 Search

```
UI                          Store                       API
 │                           │                           │
 ├─ type in search box ─────►│                           │
 │   (debounce 300ms)        │                           │
 │                           ├─ dispatch(search) ───────►│
 │                           │                           ├─ GET /api/genealogy/search?keyword=...
 │                           │                           │
 │                           │◄─── ApiSearchResponse ────┤
 │                           ├─ searchResults = mapped    │
 │◄──── show dropdown ───────┤                           │
 │                           │                           │
 ├─ click result ───────────►│                           │
 │                           ├─ rootNodeId = result.id    │
 │                           ├─ clear search              │
 │                           ├─ dispatch(loadRoot) ─────►│
 │                           │                           ├─ GET /api/genealogy/node/{id}
 │                           │                           │
 │                           │◄──── response ────────────┤
 │◄──── render tree ─────────┤                           │
```

### 5.6 Locate Member

```
UI                          Store                       API
 │                           │                           │
 ├─ click "Locate" ─────────►│                           │
 │                           ├─ dispatch(loadPath) ─────►│
 │                           │                           ├─ GET /api/genealogy/path/{id}
 │                           │                           │
 │                           │◄─── ApiPathResponse ─────┤
 │                           ├─ path = response.path      │
 │                           │                           │
 │                           ├─ for each ancestor:       │
 │                           │   if not loaded:           │
 │                           │   dispatch(expandAncestor)►│
 │                           │                           ├─ GET /api/genealogy/expand/{id}
 │                           │                           │
 │                           ├─ highlightedNodeId = id    │
 │◄──── render tree ─────────┤                           │
 │   (highlighted node)      │                           │
 │   (expanded path)         │                           │
```

---

## 6. Search Flow

### 6.1 UX Behaviour

1. Search box visible in toolbar (magnifying glass icon or inline input)
2. Typing triggers debounced API call (300ms)
3. Dropdown shows max 15 results with:
   - Avatar/placeholder image
   - Name (bold)
   - Registration number + ID
   - Package + Status badge
   - Role/level indicator
4. "No results" state when query returns empty
5. Clicking a result:
   a. Re-roots tree to that member
   b. Clears search query
   c. Closes dropdown
6. Pressing Escape clears search and closes dropdown
7. Clicking outside closes dropdown

### 6.2 Search Result Item Template

```
┌──────────────────────────────────────────────────┐
│  [img]  John Doe                    [Active]     │
│         #12345 · Gold Package · Level 3           │
└──────────────────────────────────────────────────┘
```

### 6.3 Edge Cases

| Scenario | Behaviour |
|---|---|
| Empty query | No API call, dropdown hidden |
| Whitespace-only query | Trimmed, treated as empty |
| Network error | Show "Search failed" inline message |
| Rapid typing | Debounce ensures last keystroke wins |
| Search while loading | Previous subscription cancelled via switchMap |
| 500+ results | Show "Showing 15 of 500+ results" footer |

---

## 7. Locate Member Flow

### 7.1 Trigger Points

- From search result dropdown: "Locate in Tree" action
- From member detail panel: "Show in Tree" button
- From context menu: "Locate" option
- From external link/page: `?locateMemberId=12345` query param

### 7.2 Algorithm

```
locateMember(memberId):
  1. GET /api/genealogy/path/{memberId}
  2. Receive path = [root, ..., parent, member]
  3. For each ancestor in path (top-down):
     a. If ancestor not in nodes map → expand its parent
     b. Ensure ancestor is visible (not collapsed)
  4. Set highlightedNodeId = memberId
  5. Set rootNodeId = first common ancestor (or root)
  6. Fit view to highlighted node
  7. Flash highlight animation (pulse 3x)
  8. Auto-clear highlight after 3 seconds
```

### 7.3 Visual Indication

- Node border: glowing orange (#f97316) pulse animation
- Path from root to node: edges highlighted in orange
- Node size: temporarily enlarged 25%
- Duration: 3 seconds, then fade back to normal

---

## 8. Expand Node Flow

### 8.1 Lazy Loading Strategy

```
Tree is divided into two states:
├── Loaded: nodes currently visible in the viewport + 1 level buffer
├── Unloaded: children not yet fetched

Expand triggers:
├── Click on expand icon/collapsed node
├── Depth slider increase (load next level)
├── Locate member (expand path ancestors)
├── Programmatic expandAll (limited to current root, max 4 levels)
```

### 8.2 Expand Behaviour

```
Before expand:
  Node A [hasChildren=true, isExpanded=false, isLoading=false]
  Children: [] (empty)

Click expand:
  Node A [hasChildren=true, isExpanded=false, isLoading=true]
  → Show spinner overlay on node
  → GET /api/genealogy/expand/A

On success:
  Node A [hasChildren=true, isExpanded=true, isLoading=false]
  Children: [B, C] (populated)
  → Insert B and C into nodes map
  → Re-render tree
  → If B/C have children → show expand icon

On error:
  Node A [hasChildren=true, isExpanded=false, isLoading=false]
  → Show error toast
  → Keep collapsed state
```

### 8.3 Collapse Behaviour

```
Click collapse (on expanded node):
  Node A [isExpanded=false]
  Children: [B, C]
  → Remove B, C and all their descendants from nodes map
  → Re-render tree
  → Memory freed

Note: collapsed children are NOT removed from cache (subtreeCache),
       only from the active rendering. Re-expand uses cache if available.
```

### 8.4 Expand Queue (Bulk Operations)

```typescript
// When "Expand All Levels" is clicked:
expandQueue = [rootId, child1, child2, ...];
processing = false;

processExpandQueue():
  if expandQueue is empty → return
  if processing → return
  processing = true
  
  nextId = expandQueue.shift()
  GET /api/genealogy/expand/{nextId}
  
  On success:
    → Insert children
    → Push children with hasChildren into expandQueue
    → Limit queue to 50 nodes max (prevent unlimited expansion)
    → processing = false
    → processExpandQueue()  // recursive

  On error:
    → Skip this node
    → processing = false
    → processExpandQueue()
```

---

## 9. Member Details Flow

### 9.1 Side Panel Layout

```
┌─────────────────────┐
│ [X] Close button     │
├─────────────────────┤
│  [Avatar]            │
│  Name                │
│  #ID · Registration  │
│  [Active] [Gold]     │
├─────────────────────┤
│  Contact             │
│  📞 +91 9876543210   │
│  ✉️ email@domain.com │
│  📍 Address here     │
├─────────────────────┤
│  Business Stats      │
│  ┌─────┬─────┬────┐ │
│  │Vol  │Earn │Team│ │
│  │₹50L │₹12L │1.2K│ │
│  └─────┴─────┴────┘ │
├─────────────────────┤
│  KYC Status: ✅      │
│  Join Date: 01-Jan  │
├─────────────────────┤
│  Upline              │
│  Root ─► Sponsor ─► │
│  ─► You              │
├─────────────────────┤
│  [Set as Root]       │
│  [Locate in Tree]    │
└─────────────────────┘
```

### 9.2 Loading State

```
While fetching:
┌─────────────────────┐
│  [X] Close button    │
├─────────────────────┤
│  ┌────────────────┐  │
│  │  Skeleton load │  │
│  │  placeholder   │  │
│  │  animations    │  │
│  └────────────────┘  │
└─────────────────────┘
```

### 9.3 Error State

```
On API error:
┌─────────────────────┐
│  ⚠️ Failed to load  │
│  member details     │
│  [Retry] [Close]    │
└─────────────────────┘
```

---

## 10. State Management Strategy

### 10.1 Service-based State (Signal Store)

```typescript
@Injectable({ providedIn: 'root' })
export class GenealogyTreeStore {
  // --- State signals ---
  readonly rootId = signal<number>(0);
  readonly nodes = signal<TreeNodeMap>({});
  readonly rootNodeId = signal<number>(0);
  readonly highlightedNodeId = signal<number | null>(null);
  readonly selectedMemberId = signal<number | null>(null);
  readonly memberDetail = signal<MemberDetail | null>(null);
  readonly detailLoading = signal(false);
  readonly memberDetailError = signal<string | null>(null);
  readonly searchResults = signal<SearchResultItem[]>([]);
  readonly searchQuery = signal('');
  readonly isSearching = signal(false);
  readonly searchError = signal<string | null>(null);
  readonly pathNodes = signal<Ancestor[]>([]);
  readonly loading = signal(false);
  readonly loadingMessage = signal('');
  readonly error = signal<string | null>(null);
  readonly historyStack = signal<number[]>([]);
  readonly historyIndex = signal(-1);
  readonly visibleDepth = signal(3);
  readonly isExpanding = signal<Set<number>>(new Set());

  // --- Derived signals ---
  readonly rootNode = computed(() => this.nodes()[this.rootNodeId()] ?? null);
  readonly visibleNodes = computed(() => this.computeVisibleNodes());
  readonly canGoBack = computed(() => this.historyIndex() > 0);
  readonly canGoForward = computed(() => this.historyIndex() < this.historyStack().length - 1);
  readonly totalLoadedNodes = computed(() => Object.keys(this.nodes()).length);
  readonly totalMembers = computed(() => this.rootNode()?.childrenCount ?? 0);

  // --- Computed visible nodes based on expand/collapse state ---
  private computeVisibleNodes(): TreeNode[] { ... }

  // --- Actions ---
  loadRoot(memberId: number): void { ... }
  expandNode(memberId: number): void { ... }
  collapseNode(memberId: number): void { ... }
  reRoot(memberId: number): void { ... }
  navigateBack(): void { ... }
  navigateForward(): void { ... }
  search(keyword: string): void { ... }
  loadDetail(memberId: number): void { ... }
  loadPath(memberId: number): void { ... }
  locateMember(memberId: number): void { ... }
  highlight(memberId: number | null): void { ... }
  clearHighlight(): void { ... }
  setDepth(depth: number): void { ... }
  reset(): void { ... }
}
```

### 10.2 History Management

```typescript
pushHistory(memberId: number): void {
  const stack = this.historyStack();
  const idx = this.historyIndex();
  // Truncate forward history when navigating from middle
  const newStack = stack.slice(0, idx + 1);
  newStack.push(memberId);
  this.historyStack.set(newStack);
  this.historyIndex.set(newStack.length - 1);
}

navigateBack(): void {
  if (!this.canGoBack()) return;
  const idx = this.historyIndex() - 1;
  this.historyIndex.set(idx);
  this.reRoot(this.historyStack()[idx], false); // pushHistory=false
}
```

### 10.3 Cache Strategy

```typescript
// Subtree cache for quick re-expand
private subtreeCache = new Map<string, TreeNode[]>();
// Max cache entries: 200
private readonly MAX_CACHE = 200;

cacheSubtree(parentId: number, children: TreeNode[]): void {
  const key = `subtree-${parentId}`;
  if (this.subtreeCache.size >= this.MAX_CACHE) {
    // LRU eviction: delete oldest entry
    const firstKey = this.subtreeCache.keys().next().value;
    this.subtreeCache.delete(firstKey);
  }
  this.subtreeCache.set(key, children);
}

getFromCache(parentId: number): TreeNode[] | null {
  return this.subtreeCache.get(`subtree-${parentId}`) ?? null;
}
```

---

## 11. Performance Strategy

### 11.1 Virtual Scrolling / Canvas Rendering

**Approach**: Use `vis-network` (canvas-based, already proven in existing `MlmTreeVisComponent`).

**Why vis-network over DOM-based:**
- Canvas rendering: 100k+ nodes at <60fps
- Built-in hierarchical layout with physics
- Zoom, pan, fit, select, hover natively
- No DOM node overhead for hidden nodes
- Proven in existing codebase

### 11.2 Node Limit Strategy

| Strategy | Threshold | Behaviour |
|---|---|---|
| **Depth limit** | Default: 3 levels | User can increase via depth slider |
| **Node count limit** | >5,000 nodes visible | Show warning: "Showing 5,000 of 15,423 nodes. Zoom in or reduce depth." |
| **Render throttle** | >2,000 nodes | Debounce re-renders by 100ms |
| **Badge sync** | Depth >= 5 | Disable name badges below nodes (only show for depth < 5) |

### 11.3 Memory Management

| Technique | Implementation |
|---|---|
| **Node pooling** | Keep loaded nodes in Map, not array |
| **Subtree cache** | Max 200 entries, LRU eviction |
| **Image lazy loading** | Use placeholder SVG, load actual image only when visible |
| **Cleanup on destroy** | Cancel all pending subscriptions, clear cache |
| **Collapse cleanup** | Remove descendants from nodes map, keep in cache |
| **Worker for layout** | Move hierarchical layout computation to Web Worker if >10k nodes |

### 11.4 Web Worker (Optional, for >50k nodes)

```typescript
// hierarchy.worker.ts
self.onmessage = (e: { data: TreeNode[] }) => {
  const positioned = computeHierarchicalLayout(e.data);
  self.postMessage(positioned);
};
```

### 11.5 Change Detection Strategy

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Use markForCheck() only when tree data actually changes
})
```

### 11.6 Debouncing & Throttling

| Operation | Strategy |
|---|---|
| Search input | debounce 300ms |
| Window resize | debounce 200ms |
| Node badge sync | debounce 100ms |
| Depth increase | immediate |
| Expand queue | sequential, no debounce |

---

## 12. Library Integration Strategy

### 12.1 vis-network Integration

Since the existing `MlmTreeVisComponent` uses `vis-network` + `vis-data`, the new component should use the same libraries.

```typescript
import { Network, Options } from 'vis-network';
import { DataSet } from 'vis-data';
```

**Node data structure for vis-network:**

```typescript
interface VisNode {
  id: number;
  label: string;
  shape: 'circularImage' | 'image' | 'dot' | 'custom';
  image?: string;
  size: number;
  borderWidth: number;
  borderDashes: boolean | number[];
  color: {
    border: string;
    background: string;
    hover?: { border: string; background: string };
  };
  shadow: {
    enabled: boolean;
    color: string;
    size: number;
    x: number;
    y: number;
  };
  font: {
    color: string;
    size: number;
    face: string;
    align: 'center';
    multi?: boolean;
  };
  title?: string; // HTML tooltip content
  membership: TreeNode; // custom data
  level: number;
}
```

**Edge data structure:**

```typescript
interface VisEdge {
  from: number;
  to: number;
  color: {
    color: string;
    highlight: string;
    hover: string;
    opacity: number;
  };
  width: number;
  smooth: {
    enabled: boolean;
    type: 'curvedCCW' | 'curvedCW';
    roundness: number;
  };
  arrows?: {
    to: { enabled: boolean; scaleFactor: number };
  };
  label?: 'L' | 'R';
  font?: { size: number; color: string; background: string };
}
```

**Options:**

```typescript
const options: Options = {
  nodes: {
    shape: 'circularImage',
    borderWidth: 2,
    font: { face: 'Inter, system-ui, sans-serif', align: 'center' },
    shadow: { enabled: true },
  },
  edges: {
    smooth: { enabled: true, type: 'curvedCW', roundness: 0.25 },
    color: { color: '#cbd5e1', highlight: '#f97316' },
    width: 1.5,
  },
  layout: {
    hierarchical: {
      enabled: true,
      direction: 'UD',
      sortMethod: 'directed',
      levelSeparation: 140,
      nodeSpacing: 150,
      treeSpacing: 180,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
    },
  },
  physics: { enabled: false }, // Hierarchical layout handles positioning
  interaction: {
    hover: true,
    tooltipDelay: 150,
    zoomView: true,
    dragView: true,
    dragNodes: false, // Prevent node dragging
  },
  configure: { enabled: false },
};
```

### 12.2 Canvas-based Node Badges

Since vis-network doesn't natively support HTML overlays on nodes, use a separate absolutely-positioned `div` layer synced to canvas coordinates:

```typescript
syncBadges(): void {
  if (!this.network) return;
  if (this.visibleDepth >= 5) return; // Skip for dense trees
  
  const positions = this.network.getPositions();
  this.nodeBadges = Object.entries(positions).map(([idStr, pos]) => {
    const id = Number(idStr);
    const node = this.store.nodes()[id];
    if (!node) return null;
    const domPt = this.network.canvasToDOM(pos);
    return { id, x: domPt.x, y: domPt.y, name: node.name, reg: node.registrationNumber };
  }).filter(Boolean);
  this.cdr.markForCheck();
}
```

### 12.3 No PrimeNG Required

The project uses Tailwind CSS + Angular CDK. The component uses:
- `vis-network` + `vis-data` for tree rendering (canvas-based, fast)
- Tailwind CSS for styling panels, buttons, overlays
- Angular CDK `OverlayModule` for dropdowns/context menu (if needed)

---

## 13. Complete UI Behaviour Specification

### 13.1 Toolbar

```
┌─────────────────────────────────────────────────────────────┐
│ [←] [→] │ [Fit] │ [Export] [PDF] │ [Root] │ [−] Depth 3/12 [+] │ 12/1,234 visible │ L● R● │ [🔍 Search...] │
│ Breadcrumb: John Root › Alice › Bob                         │
└─────────────────────────────────────────────────────────────┘
```

| Element | Behaviour |
|---|---|
| ← Back | Navigate to previous root in history stack |
| → Forward | Navigate to next root in history stack |
| Fit | Fit viewport to show all visible nodes |
| Export | Download PNG of current view |
| Root | Reset to top-most root (ID from input) |
| −/+ Depth | Decrease/increase visible tree depth |
| Depth label | Shows "Depth {current}/{max}" |
| Count label | Shows "{visible}/{total}" nodes |
| L/R legend | Color indicators for left/right placement |
| Search | Type to search, dropdown with results |
| Breadcrumb | Click any ancestor to re-root there |
| Breadcrumb active | Current root (last item, bold) |

### 13.2 Node Visual States

| State | Border | Background | Shadow | Icon |
|---|---|---|---|---|
| Active member | `#10b981` green | `#f1f5f9` | Theme-based glow | Profile image |
| Pending member | `#f59e0b` amber | `#fef3c7` | Amber glow | Profile image |
| Deactivated | `#ef4444` red | `#fef2f2` | Red glow | Profile image |
| Empty slot | `#cbd5e1` dashed | `#ffffff` | None | Dashed circle |
| Current root | `#f97316` orange | `#fff7ed` | Orange glow (size 25) | Profile image + ring |
| Highlighted | `#f97316` orange | `#fff7ed` | Orange glow (size 35) | 25% enlarged |
| Collapsed | `#f59e0b` amber | `#fef3c7` | Amber glow | `▶` indicator |
| Limit leaf | `#94a3b8` dashed | `#f1f5f9` | None | `▼` indicator |
| Loading | Animated | Skeleton pulse | None | Spinner overlay |

### 13.3 Tooltip (Hover)

```
┌─────────────────────────────┐
│  [img]  Name                 │
│         #ID · RegNo          │
│  ─────────────────────────── │
│  [Gold]   [Active]           │
│  Earnings: ₹1,23,456         │
│  Volume:   ₹50,00,000        │
│  Package:  Gold Plan         │
│  Online:   ✅ Yes            │
│  ─────────────────────────── │
│  Double-click for details    │
└─────────────────────────────┘
```

- Appears after 150ms hover delay
- Positioned near cursor (offset +15px, -10px)
- Max width: 280px
- Auto-hides on mouse leave or 5 seconds
- No tooltip on empty slots

### 13.4 Loading States

| Scenario | Visual |
|---|---|
| Initial tree load | Full-screen spinner with "Loading genealogy tree..." message |
| Depth increase | Semi-transparent overlay + spinner, existing tree visible |
| Node expand | Small spinner on the specific node being expanded |
| Search | "Searching..." text in dropdown, or spinner icon in search box |
| Member detail | Skeleton placeholder in side panel |
| Export/PDF | Toast: "Generating export..." |

### 13.5 Error States

| Scenario | Visual | User Action |
|---|---|---|
| Tree load failed | Error banner + "Failed to load tree" + retry button | Click retry |
| Node expand failed | Toast: "Failed to load children for Node X" | Click again to retry |
| Search failed | Inline: "Search failed. Try again." | Type again |
| Detail failed | Panel: "Failed to load member details" + retry | Click retry |
| Network offline | Toast: "Network error. Check your connection." | Fix connection, retry |
| Node limit exceeded | Warning bar: "Showing 5,000 of 15,423 nodes. Zoom in or reduce depth for better performance." | Reduce depth or zoom |

### 13.6 Empty States

| Scenario | Visual |
|---|---|
| No children | No expand icon shown on leaf nodes |
| Empty placement slot | Dashed circle with "+" icon |
| Search no results | "No members found matching '{query}'" |
| No member selected in detail | "Select a member to view details" (side panel closed) |
| No tree data | "No genealogy data available for this member" |

### 13.7 Context Menu

```
┌─────────────────────┐
│  [img] John Doe      │
│  #1234 · Gold        │
│  ─────────────────── │
│  ◎ View as Root      │
│  👤 Show Details     │
│  ◀ Expand/Collapse   │
│  📋 Copy ID          │
│  🔍 Locate in Tree   │
└─────────────────────┘
```

- Triggered by right-click on any non-empty node
- Positioned at cursor, clamped to viewport
- Dismissed by: clicking outside, Escape key, selecting an action
- Desktop only (mobile uses long-press)

---

## 14. Edge Cases

### 14.1 Data Edge Cases

| Case | Handling |
|---|---|
| Member not found (404) | Show error state with `memberId` not found message |
| Empty tree (no children) | Show root node only, no expand icons, show empty state message |
| Circular reference in tree | Prevented by API; client-side: max depth check (stop at 50) |
| Duplicate member IDs | Last one wins in nodes map |
| Negative/zero memberId | Ignore, show validation error |
| Invalid JSON response | Catch parsing error, show generic error |
| Very long member names (50+ chars) | Truncate with ellipsis in cards/badges |
| Special characters in names | HTML-escape before rendering in tooltips |

### 14.2 Interaction Edge Cases

| Case | Handling |
|---|---|
| Double-click vs single-click | 280ms delay timer: single-click = re-root, double-click = detail |
| Rapid expand/collapse | Ignore if already loading (isLoading check) |
| Click on empty slot | No action (re-root not possible) |
| Search while panel open | Panel stays open, search results appear above |
| Depth slider at max | Disable + button |
| History stack overflow | Max 50 entries, oldest auto-removed |
| Click same node twice | Push to history only if different from last entry |
| Navigate while loading | Cancel previous load, start new load |

### 14.3 Performance Edge Cases

| Case | Handling |
|---|---|
| 100k+ nodes in tree | Canvas rendering, depth-limited view, virtual scrolling |
| 10k+ visible nodes | Show performance warning, disable badges |
| Slow API (>5s) | Show "Still loading..." message after 5s with cancel option |
| API timeout | Show timeout error with retry |
| Browser tab hidden | Pause API polling if any, resume on visibility change |
| Low memory on mobile | Reduce max cache size to 50, disable badge rendering |
| Offline/fetch error | Show network error with auto-retry on online event |

### 14.4 Mobile/Tablet Edge Cases

| Case | Handling |
|---|---|
| Touch drag vs pan | vis-network handles touch natively |
| Small screen (320px) | Toolbar collapses icons, search becomes full-width below toolbar |
| Orientation change | Re-fit tree after 300ms debounce |
| Long-press on node | Show context menu (after 500ms hold) |
| Soft keyboard (search) | Push toolbar up, don't overlap tree |

---

## 15. Recommended UX for Large Trees

### 15.1 Default Depth Strategy

| Total Members | Default Depth | Max Depth | Why |
|---|---|---|---|
| < 1,000 | 4 | 20 | Small trees can show more levels |
| 1,000 – 10,000 | 3 | 15 | Balance visibility and performance |
| 10,000 – 100,000 | 2 | 10 | Limit initial load |
| > 100,000 | 1 | 8 | Start with root + children, expand on demand |

### 15.2 Progressive Loading

```
Level 0: Root (always loaded)
Level 1: Children of root (always loaded)
Level 2+: Loaded on demand via expand/collapse or depth increase
```

### 15.3 Smart Depth Calculation

```typescript
// Automatically suggest a default depth based on total members
computeDefaultDepth(totalMembers: number): number {
  if (totalMembers <= 0) return 1;
  // Rough estimate: binary tree with 2^depth nodes
  const suggested = Math.ceil(Math.log2(totalMembers + 1));
  // Cap at reasonable values
  if (totalMembers < 1000) return Math.min(suggested, 4);
  if (totalMembers < 10000) return Math.min(suggested, 3);
  if (totalMembers < 100000) return Math.min(suggested, 2);
  return 1;
}
```

### 15.4 Node Aggregation (For Very Large Sub-trees)

When a node has >50 children (unlikely in binary tree, but for matrix/multi-leg):
```typescript
// Show aggregated node with child count
{
  id: -1, // virtual ID
  name: '50+ children',
  isEmpty: true,
  hasChildren: true,
  childrenCount: 50,
  isAggregated: true,
}
```

### 15.5 Lazy Image Loading

```typescript
// Use a simple placeholder initially, swap to actual image when visible
const placeholder = `data:image/svg+xml,...`; // SVG silhouette
// Only load actual image after node becomes visible for 500ms
// Cache loaded images in a Map<id, string>
```

### 15.6 Responsive Node Sizing

```typescript
nodeSize(level: number): number {
  const base = 56 - level * 3;    // Decrease size with depth
  const scale = this.currentScale; // Zoom level from vis-network
  return Math.max(32, base * scale);
}
```

### 15.7 Keyboard-first Navigation

Since the tree can be too large to navigate by mouse scrolling, provide keyboard shortcuts:
- Arrow keys for directional navigation (as specified in Section 4.3)
- Type-ahead: typing characters selects the next node starting with that letter (within visible nodes)
- Tab to move between toolbar elements

### 15.8 Visual Density Modes

| Mode | Node Size | Badges | Spacing | Use |
|---|---|---|---|---|
| Comfortable | 56px | Full (name + reg) | 200px | Default, < 500 nodes |
| Compact | 40px | Name only | 140px | > 500 nodes |
| Dense | 32px | None | 100px | Depth > 5 or > 2,000 nodes |
| Micro | 24px + initials | None | 70px | > 10,000 nodes (with warning) |

Auto-switch modes based on visible node count:

```typescript
getDensityMode(): DensityMode {
  const count = this.store.visibleNodes().length;
  if (count < 500) return 'comfortable';
  if (count < 2000) return 'compact';
  if (count < 10000) return 'dense';
  return 'micro';
}
```

---

## 16. Component Inputs/Outputs

### GenealogyTreeComponent

```typescript
@Component({
  selector: 'shared-genealogy-tree',
  standalone: true,
  imports: [
    CommonModule,
    GenealogySearchComponent,
    GenealogyMemberDetailComponent,
  ],
  templateUrl: './genealogy-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenealogyTreeComponent implements OnInit, OnDestroy {
  // --- Inputs ---
  @Input({ required: true }) rootMemberId!: number;
  @Input() apiBaseUrl = '/api/genealogy';
  @Input() initialDepth = 3;
  @Input() appPrefix = '';

  // --- Outputs ---
  @Output() onMemberSelect = output<number>();
  @Output() onError = output<string>();
  @Output() onRootChange = output<number>();

  // --- Internal ---
  private store = inject(GenealogyTreeStore);
  private apiService = inject(GenealogyApiService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  // ViewChild references
  @ViewChild('networkContainer') networkContainer!: ElementRef;
  @ViewChild('badgesContainer') badgesContainer!: ElementRef;

  // vis-network
  private network!: Network;
  private networkInitialized = false;

  // Badge sync
  nodeBadges: NodeBadge[] = [];
  private badgeSyncTimer: any;

  // ... implementation
}
```

---

## 17. File-by-File Implementation Plan

| File | Purpose |
|---|---|
| `libs/shared/ui/src/lib/shared-ui/models/genealogy.model.ts` | All TypeScript interfaces |
| `libs/shared/ui/src/lib/shared-ui/services/genealogy-api.service.ts` | API calls with mapping |
| `libs/shared/ui/src/lib/shared-ui/services/genealogy-tree.store.ts` | Signal-based state management |
| `libs/shared/ui/src/lib/shared-ui/components/genealogy-tree/genealogy-tree.component.ts` | Main tree component |
| `libs/shared/ui/src/lib/shared-ui/components/genealogy-tree/genealogy-tree.component.html` | Tree template |
| `libs/shared/ui/src/lib/shared-ui/components/genealogy-tree/genealogy-tree.component.scss` | Tree styles |
| `libs/shared/ui/src/lib/shared-ui/components/genealogy-member-detail/genealogy-member-detail.component.ts` | Side panel |
| `libs/shared/ui/src/lib/shared-ui/components/genealogy-member-detail/genealogy-member-detail.component.html` | Panel template |
| `libs/shared/ui/src/lib/shared-ui/components/genealogy-search/genealogy-search.component.ts` | Search component |
| `libs/shared/ui/src/lib/shared-ui/components/genealogy-search/genealogy-search.component.html` | Search template |
| `apps/admin/src/app/modules/tree-visualization/pages/genealogy-page/genealogy-page.component.ts` | Admin integration |
| `apps/member/src/app/modules/genealogy/genealogy-page/genealogy-page.component.ts` | Member integration |

---

## 18. Sequence Diagrams

### 18.1 Full Expand + Locate Flow

```
  User         GenealogyTreeComp        GenealogyTreeStore      GenealogyApiService
   │                  │                         │                       │
   │ click "Locate"   │                         │                       │
   │─────────────────►│                         │                       │
   │                  │ locateMember(789)        │                       │
   │                  │────────────────────────►│                       │
   │                  │                         │ highlighted=789       │
   │                  │                         │ loadPath(789)          │
   │                  │                         │──────────────────────►│
   │                  │                         │                       ├─ GET /api/genealogy/path/789
   │                  │                         │                       │
   │                  │                         │◄── ApiPathResponse ───┤
   │                  │                         │ path = [1, 50, 200,   │
   │                  │                         │         500, 789]      │
   │                  │                         │                       │
   │                  │                         │ for each ancestor:    │
   │                  │                         │   if not in nodes:    │
   │                  │                         │     expandNode(id)     │
   │                  │                         │     │                  │
   │                  │                         │     ├─ GET expand/1  ─►│
   │                  │                         │     │◄──── children ──┤
   │                  │                         │     ├─ load complete  │
   │                  │                         │     ├─ GET expand/50 ─►│
   │                  │                         │     │◄──── children ──┤
   │                  │                         │     ├─ load complete  │
   │                  │                         │     ...               │
   │                  │                         │                       │
   │                  │                         │ rootNodeId = first    │
   │                  │                         │   common ancestor     │
   │                  │                         │ highlightedNode = 789 │
   │                  │◄──── state update ───────│                       │
   │                  │                         │                       │
   │                  ├─ buildNetwork()          │                       │
   │                  ├─ fit() to highlighted    │                       │
   │                  ├─ flash animation 3s     │                       │
   │◄── tree rendered ─│                        │                       │
   │  with highlight   │                        │                       │
```

### 18.2 Re-root Flow

```
  User         GenealogyTreeComp        GenealogyTreeStore      GenealogyApiService
   │                  │                         │                       │
   │ click node(456)  │                         │                       │
   │─────────────────►│                         │                       │
   │                  │ selectRoot(456)          │                       │
   │                  │────────────────────────►│                       │
   │                  │                         │ pushHistory(456)       │
   │                  │                         │ rootNodeId = 456       │
   │                  │                         │ loading = true          │
   │                  │                         │ loadRoot(456)           │
   │                  │                         │──────────────────────►│
   │                  │                         │                       ├─ GET /api/genealogy/node/456
   │                  │                         │                       │
   │                  │                         │◄── ApiNodeResponse ───┤
   │                  │                         │ nodes[456] = mapped   │
   │                  │                         │ for child in children │
   │                  │                         │   nodes[child.id] = x │
   │                  │                         │ loading = false         │
   │                  │                         │                       │
   │                  │                         │ loadPath(456)           │
   │                  │                         │──────────────────────►│
   │                  │                         │                       ├─ GET /api/genealogy/path/456
   │                  │                         │                       │
   │                  │                         │◄── ApiPathResponse ───┤
   │                  │                         │ pathNodes = [...]      │
   │                  │◄──── state update ───────│                       │
   │                  ├─ buildNetwork(456)       │                       │
   │◄── tree rendered ─│                        │                       │
   │  with new root    │                        │                       │
```
