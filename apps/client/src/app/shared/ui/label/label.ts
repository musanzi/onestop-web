import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-label',
  template: `
    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" [attr.for]="forId() || null">
      <ng-content />
    </label>
  `
})
export class LabelComponent {
  readonly forId = input('');
}
