import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgramsStore } from '../../store/programs.store';
import { NgOptimizedImage } from '@angular/common';
import { ApiImgPipe } from '@shared/pipes';
import { LucideAngularModule, MoveRight } from 'lucide-angular';
import { IProgram } from '@shared/models';
import { TranslateModule } from '@ngx-translate/core';
import { LandingSectionHeader } from '../landing-section-header/landing-section-header';
import { ButtonComponent } from '@shared/ui';
import { PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-programs',
  providers: [ProgramsStore],
  imports: [
    ButtonComponent,
    RouterLink,
    ApiImgPipe,
    NgOptimizedImage,
    LucideAngularModule,
    TranslateModule,
    LandingSectionHeader,
    PublicSection,
    PublicContainer
  ],
  templateUrl: './programs.html'
})
export class Programs {
  icons = {
    MoveRight: MoveRight
  };
  store = inject(ProgramsStore);

  constructor() {
    this.store.loadPrograms();
  }

  trackByProgramId(_index: number, program: IProgram): string {
    return program.id;
  }
}
