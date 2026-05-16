import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';

@NgModule({
  declarations: [ProjectsPageComponent],
  imports: [CommonModule, ProjectsRoutingModule],
})
export class ProjectsModule {}
