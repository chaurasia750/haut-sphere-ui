import { Component } from '@angular/core';
import { MlmTreeVisComponent } from '@shared';

@Component({
  selector: 'app-matching-tree',
  imports: [MlmTreeVisComponent],
  template: `<shared-mlm-tree-vis />`,
})
export class MatchingTreeComponent {}
