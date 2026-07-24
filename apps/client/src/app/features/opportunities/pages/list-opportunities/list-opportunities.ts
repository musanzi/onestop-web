import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, BriefcaseBusiness, CalendarRange, SearchX } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { OpportunitiesStore } from '../../store/opportunities.store';
import { OpportunityCard } from '../../components/opportunity-card/opportunity-card';
import { OpportunityCardSkeleton } from '../../components/opportunity-card-skeleton/opportunity-card-skeleton';
import { FilterOpportunitiesDto } from '../../dto/filter-opportunities.dto';
import { OpportunityLanguage } from '@shared/models';
import { ButtonComponent } from '@shared/ui';
import { PublicContainer, PublicPageHero, PublicSection } from '@shared/public';

@Component({
  selector: 'app-list-opportunities',
  providers: [OpportunitiesStore],
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    TranslateModule,
    OpportunityCard,
    OpportunityCardSkeleton,
    ButtonComponent,
    PublicPageHero,
    PublicSection,
    PublicContainer
  ],
  templateUrl: './list-opportunities.html'
})
export class ListOpportunities {
  #router = inject(Router);
  #route = inject(ActivatedRoute);

  protected readonly store = inject(OpportunitiesStore);
  protected readonly query = signal<FilterOpportunitiesDto>({
    language: (this.#route.snapshot.queryParams['language'] as OpportunityLanguage | undefined) ?? null,
    from: this.#route.snapshot.queryParams['from'] ?? null,
    to: this.#route.snapshot.queryParams['to'] ?? null
  });
  protected readonly icons = {
    briefcase: BriefcaseBusiness,
    calendar: CalendarRange,
    empty: SearchX
  };
  protected readonly languages = [OpportunityLanguage.FR, OpportunityLanguage.EN];

  constructor() {
    this.store.load(this.query());
  }

  protected async onFilterChange(): Promise<void> {
    const current = this.query();
    await this.#router.navigate(['/opportunities'], {
      queryParams: {
        language: current.language || null,
        from: current.from || null,
        to: current.to || null
      }
    });
    this.store.load(current);
  }

  protected async clearFilters(): Promise<void> {
    this.query.set({ language: null, from: null, to: null });
    await this.onFilterChange();
  }
}
