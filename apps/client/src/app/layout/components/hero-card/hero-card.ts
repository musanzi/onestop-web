import { Component, input } from '@angular/core';
import { LucideIconData } from 'lucide-angular';
import { PublicPageHero } from '@shared/public';

/** @deprecated Prefer `app-public-page-hero` directly. Thin wrapper kept for existing pages. */

@Component({
  selector: 'app-hero-card',
  imports: [PublicPageHero],
  templateUrl: './hero-card.html'
})
export class HeroCard {
  background = input.required<string>();
  badgeIcon = input<LucideIconData>();
  badgeText = input<string>();
  badgeTextKey = input<string>();
  title = input<string>();
  titleKey = input<string>();
  highlight = input<string>();
  highlightKey = input<string>();
  description = input<string>();
  descriptionKey = input<string>();
  overlayColor = input<string>('bg-black/60');
}
