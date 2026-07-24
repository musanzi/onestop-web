import { Component, computed, input } from '@angular/core';

/** Panneau formulaire auth. */

@Component({
  selector: 'ui-auth-panel',
  template: `
    <div [class]="shellClasses()">
      @if (variant() === 'card') {
        <div class="h-1 bg-linear-to-r from-brand-500 via-brand-600 to-brand-700"></div>
      }
      <div [class]="bodyClasses()">
        <ng-content />
      </div>
    </div>
  `
})
export class AuthPanelComponent {
  readonly variant = input<'card' | 'minimal'>('card');

  readonly shellClasses = computed(() =>
    this.variant() === 'minimal'
      ? 'rounded-xl border-0 bg-transparent shadow-none'
      : 'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]'
  );

  readonly bodyClasses = computed(() => (this.variant() === 'minimal' ? 'px-2 pt-2 sm:px-0 sm:pt-0' : 'p-6 sm:p-8'));
}
