import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-section-card',
  template: `
    <section
      class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      [class]="className()">
      @if (title()) {
        <div class="px-6 py-5">
          <h3 class="text-base font-medium text-gray-800 dark:text-white/90">{{ title() }}</h3>
          @if (description()) {
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ description() }}</p>
          }
        </div>
      }
      <div
        [class]="bodyClass()"
        [class.border-t]="!!title()"
        [class.border-gray-100]="!!title()"
        [class.dark:border-gray-800]="!!title()">
        <div class="space-y-6">
          <ng-content />
        </div>
      </div>
    </section>
  `
})
export class SectionCardComponent {
  readonly title = input('');
  readonly description = input('');
  readonly className = input('');
  readonly bodyClass = input('p-4 sm:p-6');
}
