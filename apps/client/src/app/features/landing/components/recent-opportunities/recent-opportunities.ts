import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, BriefcaseBusiness } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { OpportunitiesStore } from '../../../opportunities/store/opportunities.store';
import { OpportunityCard } from '../../../opportunities/components/opportunity-card/opportunity-card';
import { OpportunityCardSkeleton } from '../../../opportunities/components/opportunity-card-skeleton/opportunity-card-skeleton';
import { LandingSectionHeader } from '../landing-section-header/landing-section-header';
import { PublicButton, PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-recent-opportunities',
  providers: [OpportunitiesStore],
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    TranslateModule,
    OpportunityCard,
    OpportunityCardSkeleton,
    LandingSectionHeader,
    PublicSection,
    PublicContainer,
    PublicButton
  ],
  templateUrl: './recent-opportunities.html'
})
export class RecentOpportunities {
  protected readonly store = inject(OpportunitiesStore);
  protected readonly icons = {
    arrowRight: ArrowRight,
    briefcase: BriefcaseBusiness
  };
  protected readonly visibleOpportunities = computed(() => this.store.opportunities().slice(0, 3));

  constructor() {
    this.store.load();
  }
}
