import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { STATS } from '../../data/stats.data';
import { LucideAngularModule, HandCoins, Lightbulb, MoveUpRight, User, UserPlus } from 'lucide-angular';
import { CountUpDirective } from '@shared/directives/count-up.directive';
import { FadeInOnScrollDirective } from '@shared/directives/animations-on-scroll.directive';
import { REASONS } from '../../data/reasons-join-us.data';
import { LandingSectionHeader } from '../landing-section-header/landing-section-header';
import { PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-why-join-us',
  imports: [
    LucideAngularModule,
    CountUpDirective,
    FadeInOnScrollDirective,
    TranslateModule,
    LandingSectionHeader,
    PublicSection,
    PublicContainer
  ],
  templateUrl: './why-join-us.html'
})
export class WhyJoinUs {
  stats = STATS;
  reason = REASONS;
  icons = {
    lightbulb: Lightbulb,
    moveUp: MoveUpRight,
    donate: HandCoins,
    users: User,
    userPlus: UserPlus
  };

  statsLabelKeys: Record<string, string> = {
    Bénéficiaires: 'why_join_us.stats.beneficiaries',
    'Entrepreneurs accompagnés': 'why_join_us.stats.entrepreneurs',
    'Femmes formées & inspirées avec F360': 'why_join_us.stats.women_trained',
    "Programmes et forums d'innovation régionale": 'why_join_us.stats.programs',
    'Un réseau de partenaires stratégique': 'why_join_us.stats.partners'
  };

  trackByIndex(index: number): number {
    return index;
  }

  getStatLabelKey(label: string): string {
    return this.statsLabelKeys[label] || label;
  }
}
