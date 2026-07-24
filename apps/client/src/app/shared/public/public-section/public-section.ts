import { Component, computed, input } from '@angular/core';

export type PublicSectionVariant = 'default' | 'muted' | 'dark' | 'compact';

@Component({
  selector: 'app-public-section',
  template: `<section [class]="classes()" [attr.aria-label]="ariaLabel() || null"><ng-content /></section>`
})
export class PublicSection {
  readonly variant = input<PublicSectionVariant>('default');
  readonly ariaLabel = input<string>();
  readonly className = input<string>('');

  protected readonly classes = computed(() => {
    const variant = this.variant();
    const spacing = variant === 'compact' ? 'py-8 lg:py-12' : 'py-12 lg:py-20';
    const surface =
      variant === 'muted'
        ? 'public-band-muted bg-gray-50'
        : variant === 'dark'
          ? 'bg-gray-900 text-white'
          : 'public-band-surface bg-white';

    return [spacing, surface, this.className()].filter(Boolean).join(' ');
  });
}
