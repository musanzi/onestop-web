import { Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { PUBLIC_BODY_CLASSES, PUBLIC_H2_CLASSES } from '../public.tokens';

export type PublicSectionHeaderAlign = 'left' | 'center';
export type PublicSectionHeaderLayout = 'stacked' | 'split';

@Component({
  selector: 'app-public-section-header',
  imports: [TranslateModule, LucideAngularModule],
  templateUrl: './public-section-header.html'
})
export class PublicSectionHeader {
  readonly badge = input<string>();
  readonly badgeKey = input<string>();
  readonly badgeIcon = input<LucideIconData>();
  readonly title = input<string>();
  readonly titleKey = input<string>();
  readonly titleHighlight = input<string>();
  readonly titleHighlightKey = input<string>();
  readonly description = input<string>();
  readonly descriptionKey = input<string>();
  readonly descriptionParams = input<Record<string, unknown>>();
  readonly align = input<PublicSectionHeaderAlign>('left');
  readonly layout = input<PublicSectionHeaderLayout>('split');
  readonly descriptionClass = input<string>();

  protected readonly titleClasses = computed(() => {
    const align = this.align() === 'center' ? 'text-center' : '';
    return `mb-4 hyphens-none ${PUBLIC_H2_CLASSES} ${align}`;
  });

  protected readonly descriptionClasses = computed(() => {
    const base = `mt-4 max-w-2xl ${PUBLIC_BODY_CLASSES}`;
    return [base, this.descriptionClass()].filter(Boolean).join(' ');
  });

  protected readonly splitDescriptionClasses = computed(() => {
    const base = 'max-w-sm border-l-2 border-brand-600 pl-6 text-sm italic leading-relaxed text-gray-500 sm:text-base';
    return [base, this.descriptionClass()].filter(Boolean).join(' ');
  });

  protected readonly contentWidthClass = computed(() =>
    this.align() === 'center' ? 'mx-auto max-w-3xl w-full' : 'max-w-2xl'
  );
}
