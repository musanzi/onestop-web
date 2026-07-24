import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, CalendarDays, CalendarCheck } from 'lucide-angular';
import type { IProject } from '@shared/models/entities.models';

@Component({
  selector: 'app-project-detail-dates',

  imports: [DatePipe, TranslateModule, LucideAngularModule],
  templateUrl: './project-detail-dates.html'
})
export class ProjectDetailDatesComponent {
  project = input.required<IProject>();

  icons = { calendarDays: CalendarDays, calendarCheck: CalendarCheck };
}
