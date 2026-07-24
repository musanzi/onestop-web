import { afterNextRender, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  LucideAngularModule,
  ArrowRight,
  ExternalLink,
  Lightbulb,
  Rocket,
  TrendingUp,
  LucideIconData
} from 'lucide-angular';
import { CountUpDirective } from '@shared/directives/count-up.directive';
import { FadeInOnScrollDirective } from '@shared/directives/animations-on-scroll.directive';

interface JourneyStep {
  key: string;
  image: string;
  icon: LucideIconData;
}

interface Stat {
  key: string;
  value: number;
}

@Component({
  selector: 'app-hero',
  imports: [LucideAngularModule, CountUpDirective, FadeInOnScrollDirective, TranslateModule, RouterLink],
  templateUrl: './hero.html'
})
export class Hero {
  private readonly platformId = inject(PLATFORM_ID);

  readonly ready = signal(false);

  icons = {
    arrowRight: ArrowRight,
    externalLink: ExternalLink
  };

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    afterNextRender(() => {
      setTimeout(() => this.ready.set(true), 350);
    });
  }

  journey: JourneyStep[] = [
    { key: 'ideation', image: 'blog.jpg', icon: Lightbulb },
    { key: 'prototype', image: 'events.webp', icon: Rocket },
    { key: 'scale', image: 'member.jpg', icon: TrendingUp }
  ];

  stats: Stat[] = [
    { key: 'projects', value: 500 },
    { key: 'partners', value: 30 }
  ];
}
