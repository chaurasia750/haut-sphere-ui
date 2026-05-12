import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchingTreePageComponent } from './pages/matching-tree-page/matching-tree-page.component';
import { MatrixTreePageComponent } from './pages/matrix-tree-page/matrix-tree-page.component';

const routes: Routes = [
  { path: 'matching-tree', component: MatchingTreePageComponent },
  { path: 'matrix-tree', component: MatrixTreePageComponent },
  { path: '', redirectTo: 'matching-tree', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreeVisualizationRoutingModule {}
