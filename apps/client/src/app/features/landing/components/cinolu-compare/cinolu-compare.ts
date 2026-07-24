import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, Briefcase, TrendingUp, Check } from 'lucide-angular';
import { FadeInOnScrollDirective } from '@shared/directives/animations-on-scroll.directive';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LandingSectionHeader } from '../landing-section-header/landing-section-header';
import { PublicButton, PublicContainer, PublicSection } from '@shared/public';

interface CardData {
  id: string;
  badgeKey: string;
  icon: typeof Briefcase;
  titleKey: string;
  subtitleKey: string;
  quoteKey: string;
  benefitsKeys: readonly string[];
  ctaKey: string;
  ctaRoute: string;
  ctaStyle: 'primary' | 'outlined';
  imagePath: string;
}

@Component({
  selector: 'app-cinolu-compare',
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    FadeInOnScrollDirective,
    TranslateModule,
    LandingSectionHeader,
    PublicSection,
    PublicContainer,
    PublicButton
  ],
  templateUrl: './cinolu-compare.html'
})
export class CinoluCompare {
  readonly activeSide = signal<string | null>(null);

  readonly icons = {
    arrowRight: ArrowRight,
    briefcase: Briefcase,
    trendingUp: TrendingUp,
    check: Check
  } as const;

  readonly cards: readonly CardData[] = [
    {
      id: 'entrepreneur',
      badgeKey: 'compare.entrepreneur.badge',
      icon: Briefcase,
      titleKey: 'compare.entrepreneur.title',
      subtitleKey: 'compare.entrepreneur.subtitle',
      quoteKey: 'compare.entrepreneur.quote',
      benefitsKeys: [
        'compare.entrepreneur.benefits.network',
        'compare.entrepreneur.benefits.mentorship',
        'compare.entrepreneur.benefits.programs',
        'compare.entrepreneur.benefits.visibility',
        'compare.entrepreneur.benefits.funding'
      ],
      ctaKey: 'compare.entrepreneur.cta',
      ctaRoute: '/entrepreneurs',
      ctaStyle: 'primary',
      imagePath: '/images/gallery/15.jpg'
    },
    {
      id: 'investor',
      badgeKey: 'compare.investor.badge',
      icon: TrendingUp,
      titleKey: 'compare.investor.title',
      subtitleKey: 'compare.investor.subtitle',
      quoteKey: 'compare.investor.quote',
      benefitsKeys: [
        'compare.investor.benefits.dealflow',
        'compare.investor.benefits.startups',
        'compare.investor.benefits.risk',
        'compare.investor.benefits.impact',
        'compare.investor.benefits.coinvestment'
      ],
      ctaKey: 'compare.investor.cta',
      ctaRoute: '/partners',
      ctaStyle: 'outlined',
      imagePath: '/images/gallery/8.jpg'
    }
  ] as const;

  setHover(side: string | null): void {
    this.activeSide.set(side);
  }

  trackById(_index: number, card: CardData): string {
    return card.id;
  }
}
