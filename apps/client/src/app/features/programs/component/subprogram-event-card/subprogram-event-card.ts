import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IEvent } from '@shared/models/entities.models';
import {
  BookmarkCheck,
  Calendar1,
  CalendarCheck,
  CalendarMinus,
  FileText,
  FolderOpenDot,
  LucideAngularModule,
  MapPin,
  MessageCircleMore,
  MoveRight,
  MoveUpRight,
  NotepadText,
  ThumbsUp
} from 'lucide-angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { QuillViewComponent } from 'ngx-quill';
import { ButtonComponent, TagComponent } from '@shared/ui';

@Component({
  selector: 'app-subprogram-event-card',
  imports: [
    LucideAngularModule,
    CommonModule,
    NgOptimizedImage,
    ApiImgPipe,
    TagComponent,
    ButtonComponent,
    QuillViewComponent,
    RouterLink
  ],
  templateUrl: './subprogram-event-card.html',
  styleUrl: '../../../../shared/styles/quill-view.css'
})
export class SubprogramEventCard {
  icons = {
    fileText: FileText,
    notepadText: NotepadText,
    tag: BookmarkCheck,
    comment: MessageCircleMore,
    like: ThumbsUp,
    calendar: Calendar1,
    moveUp: MoveUpRight,
    thumbsUp: ThumbsUp,
    program: FolderOpenDot,
    arrow: MoveRight,
    place: MapPin,
    startedAt: CalendarCheck,
    endedAt: CalendarMinus
  };

  event = input.required<IEvent>();

  getStatut(event: IEvent): string {
    const now = new Date();
    const startedAt = new Date(event.started_at);
    const endedAt = new Date(event.ended_at);

    if (startedAt <= now && endedAt >= now) {
      return 'En cours';
    } else if (startedAt > now) {
      return 'À venir';
    } else {
      return 'Terminé';
    }
  }

  canApply(event: IEvent | null | undefined): boolean {
    if (!event) {
      return false;
    }

    const statut = this.getStatut(event);
    return statut === 'En cours' || statut === 'À venir';
  }
}
