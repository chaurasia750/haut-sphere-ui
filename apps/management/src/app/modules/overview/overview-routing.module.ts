import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewRoutingModule {}
