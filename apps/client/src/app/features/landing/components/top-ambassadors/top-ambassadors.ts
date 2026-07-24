import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Crown, MoveRight, UserCircle } from 'lucide-angular';
import { AmbassadorsStore } from '../../../ambassadors/store/ambassadors.store';
import { getInitials } from '@shared/helpers/ambassador.helpers';
import { IUser } from '@shared/models';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { LandingSectionHeader } from '../landing-section-header/landing-section-header';
import { PublicContainer, PublicSection } from '@shared/public';

export type AmbassadorDisplay = { type: 'real'; data: IUser; id: string } | { type: 'placeholder'; id: string };

const DISPLAY_ORDER_INDICES = [0, 1, 2, 3, 4] as const;

@Component({
  selector: 'app-top-ambassadors',
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    ApiImgPipe,
    LucideAngularModule,
    LandingSectionHeader,
    PublicSection,
    PublicContainer
  ],
  providers: [AmbassadorsStore],
  templateUrl: './top-ambassadors.html'
})
export class TopAmbassadors {
  private _store = inject(AmbassadorsStore);

  icons = {
    crown: Crown,
    MoveRight: MoveRight,
    userCircle: UserCircle
  };

  store = {
    isLoading: this._store.isLoading,
    ambassadors: computed(() => this._store.ambassadors()[0])
  };

  sortedAmbassadors = computed(() =>
    [...this.store.ambassadors()].sort((a, b) => (b.referralsCount ?? 0) - (a.referralsCount ?? 0)).slice(0, 5)
  );

  topFiveAmbassadors = computed((): AmbassadorDisplay[] => {
    const list = this.sortedAmbassadors();
    return DISPLAY_ORDER_INDICES.map((sortedIndex, displayIndex) => {
      const user = list[sortedIndex];
      if (user) return { type: 'real', data: user, id: user.id };
      return { type: 'placeholder', id: `placeholder-${displayIndex}` };
    });
  });

  realAmbassadorsCount = computed(() => {
    return this.topFiveAmbassadors().filter((item) => item.type === 'real').length;
  });

  constructor() {
    this._store.loadAmbassadors({ page: 1, limit: 5 });
  }

  getInitials(name: string): string {
    return getInitials(name);
  }

  trackByDisplayId(_index: number, item: AmbassadorDisplay): string {
    return item.id;
  }

  isTopOne(index: number): boolean {
    const item = this.topFiveAmbassadors()[index];
    if (item.type !== 'real') return false;
    const sorted = this.sortedAmbassadors();
    return sorted.length > 0 && sorted[0]?.id === item.data.id;
  }

  getRealRank(index: number): number {
    const item = this.topFiveAmbassadors()[index];
    if (item.type !== 'real') return index + 1;
    const sorted = this.sortedAmbassadors();
    const realIndex = sorted.findIndex((amb) => amb.id === item.data.id);
    return realIndex !== -1 ? realIndex + 1 : index + 1;
  }

  getMosaicClasses(index: number): string {
    const layouts = [
      'md:col-span-2 md:row-span-2',
      'md:col-span-2 md:row-span-1',
      'md:col-span-1 md:row-span-1',
      'md:col-span-1 md:row-span-1',
      'md:col-span-2 md:row-span-1'
    ];
    return layouts[index] || 'md:col-span-1';
  }
}
