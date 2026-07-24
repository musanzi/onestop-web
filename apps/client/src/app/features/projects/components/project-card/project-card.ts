import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, CalendarCheck, CalendarX, MoveRight } from 'lucide-angular';
import { IProject } from '@shared/models/entities.models';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-card',
  imports: [LucideAngularModule, CommonModule, NgOptimizedImage, RouterLink, ApiImgPipe, TranslateModule],
  templateUrl: './project-card.html'
})
export class ProjectCard {
  project = input.required<IProject>();
  buttonTextKey = input<string>('recent_projects.explore');

  icons = {
    calendarCheck: CalendarCheck,
    calendarX: CalendarX,
    moveRight: MoveRight
  };
}
