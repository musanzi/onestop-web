import { Component, OnDestroy, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { About } from '../components/about/about';
import { Vision } from '../components/vision/vision';
import { History } from '../components/history/history';
import { OurImpact } from '../components/our-impact/our-impact';
import { OurTeam } from '../components/our-team/our-team';
import { ArrowRight, LucideAngularModule, Sprout } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PublicContainer, PublicPageHero } from '@shared/public';

const ABOUT_SECTION_IDS = ['story', 'vision', 'history', 'impact', 'team'] as const;
type AboutSectionId = (typeof ABOUT_SECTION_IDS)[number];

@Component({
  selector: 'app-about-us',
  imports: [
    About,
    Vision,
    History,
    OurImpact,
    OurTeam,
    LucideAngularModule,
    TranslateModule,
    RouterLink,
    PublicContainer,
    PublicPageHero
  ],
  templateUrl: './about-us.html'
})
export class AboutUs implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private sectionObserver?: IntersectionObserver;

  activeSection = signal<AboutSectionId>('story');

  icons = {
    arrowRight: ArrowRight,
    sprout: Sprout
  };

  constructor() {
    afterNextRender(() => this.initSectionObserver());
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
  }

  scrollToSection(sectionId: AboutSectionId, event: MouseEvent): void {
    event.preventDefault();
    const target = this.document.getElementById(sectionId);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeSection.set(sectionId);
  }

  isActiveSection(sectionId: AboutSectionId): boolean {
    return this.activeSection() === sectionId;
  }

  private initSectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const sections = ABOUT_SECTION_IDS.map((id) => this.document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );

    if (!sections.length) {
      return;
    }

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const id = visible[0]?.target.id;
        if (id && ABOUT_SECTION_IDS.includes(id as AboutSectionId)) {
          this.activeSection.set(id as AboutSectionId);
        }
      },
      {
        rootMargin: '-35% 0px -50% 0px',
        threshold: [0, 0.15, 0.35, 0.5]
      }
    );

    sections.forEach((section) => this.sectionObserver?.observe(section));
  }
}
