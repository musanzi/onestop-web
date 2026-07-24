import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, MoveRight, CalendarCheck, MapPin } from 'lucide-angular';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { IEvent } from '@shared/models/entities.models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-event-card',
  imports: [LucideAngularModule, CommonModule, NgOptimizedImage, RouterLink, ApiImgPipe, TranslateModule],
  templateUrl: './event-card.html'
})
export class EventCard {
  event = input.required<IEvent>();
  buttonTextKey = input<string>('recent_events.explore');
  icons = { MoveRight, CalendarCheck, MapPin };
}
