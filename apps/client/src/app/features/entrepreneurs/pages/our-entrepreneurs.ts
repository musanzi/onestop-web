import { Component, inject, OnInit, computed } from '@angular/core';
import { LucideAngularModule, UserRound, Users, Sparkles } from 'lucide-angular';
import { HeroCard } from '../../../layout/components/hero-card/hero-card';
import { PublicVenturesStore } from '../store/ventures.store';
import { EntrepreneurUserCard } from '../components/entrepreneur-user-card/entrepreneur-user-card';
import { EntrepreneurCardSkeleton } from '../components/entrepreneur-card-skeleton/entrepreneur-card-skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '@shared/ui';
import { PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-our-entrepreneurs',
  providers: [PublicVenturesStore],
  imports: [
    LucideAngularModule,
    HeroCard,
    PaginationComponent,
    EntrepreneurUserCard,
    EntrepreneurCardSkeleton,
    TranslateModule,
    PublicSection,
    PublicContainer
  ],
  templateUrl: './our-entrepreneurs.html'
})
export class OurEntrepreneurs implements OnInit {
  icons = { users: Users, userRound: UserRound, sparkles: Sparkles };
  venturesStore = inject(PublicVenturesStore);

  first = 0;
  rows = 8;
  readonly pageSize = this.rows;

  totalItems = computed(() => this.venturesStore.ventures().length);
  loading = computed(() => this.venturesStore.isLoading());

  ngOnInit() {
    this.venturesStore.loadVentures();
  }

  get currentPage(): number {
    return Math.floor(this.first / this.rows) + 1;
  }

  get pagedVentures() {
    const data = this.venturesStore.ventures();
    return data.slice(this.first, this.first + this.rows);
  }

  onPageChange(page: number) {
    this.first = (page - 1) * this.rows;
  }
}
