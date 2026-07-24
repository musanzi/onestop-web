import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, CalendarDays, ExternalLink, Globe2, Link2 } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { QuillViewComponent } from 'ngx-quill';
import { OpportunityStore } from '../../store/opportunity.store';
import { ApiImgPipe } from '@shared/pipes';
import { ButtonComponent, BadgeComponent } from '@shared/ui';
import { AnalyticsService } from '@core/services/analytics/analytics.service';
import { SeoService } from '@core/services/seo';
import { PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-detail-opportunity',
  providers: [OpportunityStore],
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterLink,
    DatePipe,
    LucideAngularModule,
    TranslateModule,
    QuillViewComponent,
    ApiImgPipe,
    ButtonComponent,
    BadgeComponent,
    PublicSection,
    PublicContainer
  ],
  templateUrl: './detail-opportunity.html',
  styleUrl: '../../../../shared/styles/quill-view.css'
})
export class DetailOpportunity {
  #route = inject(ActivatedRoute);
  #analytics = inject(AnalyticsService);
  #seo = inject(SeoService);

  protected readonly store = inject(OpportunityStore);
  protected readonly icons = {
    back: ArrowLeft,
    calendar: CalendarDays,
    globe: Globe2,
    external: ExternalLink,
    link: Link2
  };

  constructor() {
    const slug = this.#route.snapshot.params['slug'];
    if (slug) {
      this.store.load(slug);
    }

    effect(() => {
      const opportunity = this.store.opportunity();
      if (!opportunity?.slug) return;
      this.#analytics.trackPageView(`/opportunities/${opportunity.slug}`, opportunity.title);
      this.#seo.updateEntityPage({
        name: opportunity.title,
        description: opportunity.description,
        path: `/opportunities/${opportunity.slug}`
      });
    });
  }

  protected onExternalLinkClick(url: string): void {
    this.#analytics.trackOutboundLink(this.normalizeExternalUrl(url));
  }

  protected isOpportunityExpired(dueDate?: string | Date | null): boolean {
    if (!dueDate) {
      return false;
    }

    return new Date(dueDate).getTime() < Date.now();
  }

  protected normalizeExternalUrl(url?: string | null): string {
    const trimmedUrl = url?.trim();

    if (!trimmedUrl) {
      return '#';
    }

    if (/^https?:\/\//i.test(trimmedUrl)) {
      return trimmedUrl;
    }

    return `https://${trimmedUrl}`;
  }
}
