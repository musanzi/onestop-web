import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Hourglass, Users } from 'lucide-angular';
import type { IProject } from '@shared/models/entities.models';

@Component({
  selector: 'app-project-detail-meta',

  imports: [TranslateModule, LucideAngularModule],
  templateUrl: './project-detail-meta.html'
})
export class ProjectDetailMetaComponent {
  project = input.required<IProject>();

  icons = { hourglass: Hourglass, users: Users };
}
