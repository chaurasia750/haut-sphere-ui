import { Component } from '@angular/core';

@Component({
  selector: 'app-genealogy-tree-page',
  standalone: false,
  template: `<shared-genealogy-tree [rootMemberId]="1" appPrefix="admin" />`,
})
export class GenealogyTreePageComponent {}
