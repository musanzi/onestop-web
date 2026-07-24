import { trigger, transition, style, animate } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PublicContainer, PublicContainerWidth } from '../public-container/public-container';
import { PUBLIC_BODY_CLASSES, PUBLIC_H1_CLASSES } from '../public.tokens';

export type PublicPageHeroVariant = 'image' | 'minimal';
export type PublicPageHeroAlign = 'left' | 'center';

@Component({
  selector: 'app-public-page-hero',
  imports: [LucideAngularModule, TranslateModule, NgClass, PublicContainer],
  templateUrl: './public-page-hero.html',

  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))])
    ])
  ]
})
export class PublicPageHero {
  readonly variant = input<PublicPageHeroVariant>('image');
  readonly align = input<PublicPageHeroAlign>('center');
  readonly background = input<string>();
  readonly badgeIcon = input<LucideIconData>();
  readonly badgeText = input<string>();
  readonly badgeTextKey = input<string>();
  readonly title = input<string>();
  readonly titleKey = input<string>();
  readonly highlight = input<string>();
  readonly highlightKey = input<string>();
  readonly description = input<string>();
  readonly descriptionKey = input<string>();
  readonly overlayColor = input<string>('bg-black/60');
  readonly ariaLabel = input<string>();
  readonly containerWidth = input<PublicContainerWidth>('default');

  protected readonly h1Classes = computed(() => {
    const align = this.align() === 'center' ? 'text-center' : 'text-left';
    return `mb-4 ${PUBLIC_H1_CLASSES} ${align}`;
  });

  protected readonly descriptionClasses = computed(() => {
    const width = this.align() === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl';
    return `${width} ${PUBLIC_BODY_CLASSES}`;
  });

  protected readonly headerAlignClass = computed(() => (this.align() === 'center' ? 'text-center' : 'text-left'));
}
