import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ArrowLeft,
  FolderOpenDot,
  LucideAngularModule,
  MoveRight,
  ThumbsUp,
  UserPlus,
  MoveUpRight,
  ArrowRight,
  AlertTriangle
} from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { SubprogramsStore } from '../../../landing/store/subprogram.store';
import { IProject } from '@shared/models/entities.models';
import { SubprogramCardSkeleton } from '../../component/subprogram-card-skeleton/subprogram-card-skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectCard } from '@features/projects/components/project-card/project-card';
import { ProgramCardSkeletonComponent } from '@features/projects/components/project-card-skeleton/project-card-skeleton';
import { EventCard } from '@features/events/components/event-card/event-card';
import { ButtonComponent } from '@shared/ui';
import { PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-list-sub-programs',
  providers: [SubprogramsStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    SubprogramCardSkeleton,
    TranslateModule,
    ProjectCard,
    ProgramCardSkeletonComponent,
    EventCard,
    RouterLink,
    PublicSection,
    PublicContainer,
    ButtonComponent
  ],
  templateUrl: './list-sub-programs.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListSubPrograms implements OnInit {
  icons = {
    moveLeft: ArrowLeft,
    userPlus: UserPlus,
    moveUp: MoveUpRight,
    thumbsUp: ThumbsUp,
    program: FolderOpenDot,
    arrow: MoveRight,
    moveRight: ArrowRight,
    folderOpen: FolderOpenDot,
    alertTriangle: AlertTriangle
  };
  #route = inject(ActivatedRoute);
  store = inject(SubprogramsStore);

  ngOnInit(): void {
    const slug = this.#route.snapshot.params['subprogramSlug'] ?? this.#route.snapshot.params['slug'];
    this.store.loadSubprogram(slug);
  }

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
