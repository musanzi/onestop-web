import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Layers, CalendarDays, CalendarCheck } from 'lucide-angular';
import type { IPhase } from '@shared/models/entities.models';

@Component({
  selector: 'app-project-detail-phases',

  imports: [DatePipe, TranslateModule, LucideAngularModule],
  templateUrl: './project-detail-phases.html'
})
export class ProjectDetailPhasesComponent {
  phases = input.required<IPhase[]>();

  icons = { layers: Layers, calendarDays: CalendarDays, calendarCheck: CalendarCheck };
}
