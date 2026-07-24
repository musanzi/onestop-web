import { Component, input } from '@angular/core';
import { IProject } from '@shared/models/entities.models';
import {
  Calendar1,
  ArrowLeft,
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
  Tags,
  ThumbsUp,
  UserPlus
} from 'lucide-angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { QuillViewComponent } from 'ngx-quill';
import { TagComponent } from '@shared/ui';

@Component({
  selector: 'app-subprogram-card',
  imports: [LucideAngularModule, CommonModule, NgOptimizedImage, ApiImgPipe, TagComponent, QuillViewComponent],
  templateUrl: './subprogram-card.html',
  styleUrl: '../../../../shared/styles/quill-view.css'
})
export class SubprogramCard {
  icons = {
    moveLeft: ArrowLeft,
    fileText: FileText,
    notepadText: NotepadText,
    userPlus: UserPlus,
    tag: Tags,
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

  project = input.required<IProject>();

  getStatut(project: IProject): string {
    const now = new Date();
    const startedAt = new Date(project.started_at);
    const endedAt = new Date(project.ended_at);

    if (startedAt <= now && endedAt >= now) {
      return 'En cours';
    } else if (startedAt > now) {
      return 'À venir';
    } else {
      return 'Terminé';
    }
  }
}
