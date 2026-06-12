import { NgModule } from '@angular/core';
import { ROUTES, Routes } from '@angular/router';
import { MatchingTreePageComponent } from './pages/matching-tree-page/matching-tree-page.component';
import { MatrixTreePageComponent } from './pages/matrix-tree-page/matrix-tree-page.component';
import { GenealogyTreePageComponent } from './pages/genealogy-tree-page/genealogy-tree-page.component';

const routes: Routes = [
  { path: 'matching-tree', component: MatchingTreePageComponent },
  { path: 'matrix-tree', component: MatrixTreePageComponent },
  { path: 'genealogy', component: GenealogyTreePageComponent },
  { path: '', redirectTo: 'genealogy', pathMatch: 'full' },
];

@NgModule({
  providers: [
    { provide: ROUTES, multi: true, useValue: routes },
  ],
})
export class TreeVisualizationRoutingModule {}
