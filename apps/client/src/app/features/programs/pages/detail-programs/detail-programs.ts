import { Component, inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertTriangle,
  FolderOpenDot,
  Layers3,
  LucideAngularModule,
  MoveRight,
  Tag
} from 'lucide-angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProgramStore } from '../../../landing/store/program.store';
import { Subject, takeUntil } from 'rxjs';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { PublicButton, PublicCard, PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-detail-programs',
  providers: [ProgramStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    PublicButton,
    PublicCard,
    PublicContainer,
    PublicSection,
    ApiImgPipe,
    NgOptimizedImage,
    TranslateModule
  ],
  templateUrl: './detail-programs.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailPrograms implements OnInit, OnDestroy {
  icons = {
    tag: Tag,
    program: FolderOpenDot,
    layers: Layers3,
    arrow: MoveRight,
    alertTriangle: AlertTriangle
  };
  #route = inject(ActivatedRoute);
  store = inject(ProgramStore);
  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.#route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const slug = params.get('slug');
      if (slug) this.store.loadProgram(slug);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
