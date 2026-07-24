import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AmbassadorsStore } from '../../store/ambassadors.store';
import { getAmbassadorLevel, getInitials } from '@shared/helpers/ambassador.helpers';
import { environment } from '../../../../../environments/environment';
import { IUser } from '@shared/models';
import { Edit, LucideAngularModule, MapPin, Star, Users } from 'lucide-angular';
import { AmbassadorCard } from '../../components/ambassador-card/ambassador-card';
import { AmbassadorSkeleton } from '../../components/ambassador-skeleton/ambassador-skeleton';
import { PublicContainer, PublicSection } from '@shared/public';
import { PaginationComponent } from '@shared/ui';
import { HeroCard } from '../../../../layout/components/hero-card/hero-card';

@Component({
  selector: 'app-list-ambassadors',
  imports: [
    CommonModule,
    TranslateModule,
    HeroCard,
    LucideAngularModule,
    AmbassadorCard,
    AmbassadorSkeleton,
    PublicSection,
    PublicContainer,
    PaginationComponent
  ],
  providers: [AmbassadorsStore],
  templateUrl: './list-ambassadors.html'
})
export class ListAmbassadors implements OnInit {
  store = inject(AmbassadorsStore);

  icons = {
    edit: Edit,
    users: Users,
    star: Star,
    mapPin: MapPin
  };

  currentPage = signal(1);
  readonly pageSize = 20;

  ambassadorsList = computed(() => this.store.ambassadors()[0] ?? []);

  paginatedAmbassadors = computed(() => {
    const all = this.ambassadorsList();
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  totalItems = computed(() => this.store.ambassadors()[1] ?? 0);

  loading = computed(() => this.store.isLoading());

  ngOnInit(): void {
    this.store.loadAmbassadors({ page: 1, limit: this.pageSize });
  }

  goToPage(page: number): void {
    const totalPages = Math.max(1, Math.ceil(this.totalItems() / this.pageSize));
    if (page < 1 || page > totalPages || page === this.currentPage()) {
      return;
    }

    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getAvatarUrl(profile: string): string {
    if (!profile) return '';
    if (profile.startsWith('http://') || profile.startsWith('https://')) {
      return profile;
    }
    return `${environment.apiUrl}uploads/${profile}`;
  }

  getInitials(name: string): string {
    return getInitials(name);
  }

  getAmbassadorBadge(referralsCount?: number) {
    return getAmbassadorLevel(referralsCount);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  trackByAmbassadorId(_index: number, ambassador: IUser): string {
    return ambassador.id;
  }
}
