import { Component } from '@angular/core';
import { GenealogyTreeComponent } from '@shared';

@Component({
  selector: 'app-member-genealogy-tree',
  imports: [GenealogyTreeComponent],
  template: `<shared-genealogy-tree [rootMemberId]="'1'" appPrefix="member" />`,
})
export class MemberGenealogyTreeComponent {}
