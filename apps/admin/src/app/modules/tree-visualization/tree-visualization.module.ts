import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeVisualizationRoutingModule } from './tree-visualization-routing.module';
import { MatchingTreePageComponent } from './pages/matching-tree-page/matching-tree-page.component';
import { MatrixTreePageComponent } from './pages/matrix-tree-page/matrix-tree-page.component';
import { MlmTreeVisComponent } from '@shared';

@NgModule({
  declarations: [MatchingTreePageComponent, MatrixTreePageComponent],
  imports: [CommonModule, TreeVisualizationRoutingModule, MlmTreeVisComponent],
})
export class TreeVisualizationModule {}
