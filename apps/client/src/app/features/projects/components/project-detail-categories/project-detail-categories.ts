import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Tag } from 'lucide-angular';
import type { IProject } from '@shared/models/entities.models';

@Component({
  selector: 'app-project-detail-categories',

  imports: [TranslateModule, LucideAngularModule],
  templateUrl: './project-detail-categories.html'
})
export class ProjectDetailCategoriesComponent {
  project = input.required<IProject>();

  icons = { tag: Tag };
}
