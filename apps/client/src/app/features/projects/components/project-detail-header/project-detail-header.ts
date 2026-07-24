import { Component, input, output } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, CheckCircle2, CalendarDays, Hourglass, UserPlus } from 'lucide-angular';
import type { IProject } from '@shared/models/entities.models';

@Component({
  selector: 'app-project-detail-header',

  imports: [DatePipe, TitleCasePipe, TranslateModule, LucideAngularModule],
  templateUrl: './project-detail-header.html'
})
export class ProjectDetailHeaderComponent {
  project = input.required<IProject>();
  projectStatus = input.required<string | null>();
  isProjectOpen = input.required<boolean>();

  apply = output<void>();

  icons = { checkCircle2: CheckCircle2, calendarDays: CalendarDays, hourglass: Hourglass, userPlus: UserPlus };

  onApply(): void {
    this.apply.emit();
  }
}
