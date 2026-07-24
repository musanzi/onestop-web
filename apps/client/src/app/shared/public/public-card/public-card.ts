import { Component, computed, input } from '@angular/core';
import { PUBLIC_CARD_VARIANTS } from '../public.tokens';

export type PublicCardVariant = keyof typeof PUBLIC_CARD_VARIANTS;

@Component({
  selector: 'app-public-card',
  template: `<article [class]="classes()"><ng-content /></article>`
})
export class PublicCard {
  readonly variant = input<PublicCardVariant>('default');
  readonly className = input<string>('');

  protected readonly classes = computed(() =>
    [PUBLIC_CARD_VARIANTS[this.variant()], this.className()].filter(Boolean).join(' ')
  );
}
