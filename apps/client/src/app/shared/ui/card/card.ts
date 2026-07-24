import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  template: `<section
    class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    [class]="paddingClass()">
    <ng-content />
  </section>`
})
export class CardComponent {
  readonly paddingClass = input('p-5 md:p-6');
}
