import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, SquaresSubtract, CalendarSync, Share2, UserPlus } from 'lucide-angular';
import type { IProject } from '@shared/models/entities.models';

@Component({
  selector: 'app-project-detail-quick-actions',

  imports: [NgClass, TranslateModule, LucideAngularModule],
  templateUrl: './project-detail-quick-actions.html'
})
export class ProjectDetailQuickActionsComponent {
  project = input.required<IProject>();
  projectStatus = input.required<string | null>();
  statusBadgeClasses = input.required<string>();
  isProjectOpen = input.required<boolean>();

  addToCalendar = output<void>();
  share = output<void>();
  apply = output<void>();

  icons = { squaresSubtract: SquaresSubtract, calendarSync: CalendarSync, share: Share2, userPlus: UserPlus };

  onAddToCalendar(): void {
    this.addToCalendar.emit();
  }

  onShare(): void {
    this.share.emit();
  }

  onApply(): void {
    this.apply.emit();
  }
}
