import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-tag',
  template: `<span
    class="inline-flex items-center rounded-lg border px-2.5 py-1.5 text-xs font-bold leading-[1.2] uppercase tracking-wide"
    [class]="variantClasses[variant()]"
    ><ng-content
  /></span>`
})
export class TagComponent {
  readonly variant = input<'primary' | 'info' | 'warning' | 'danger' | 'success'>('primary');

  protected readonly variantClasses: Record<string, string> = {
    primary: 'border-primary-200 bg-primary-50 text-primary-700',
    info: 'border-sky-200 bg-sky-50 text-sky-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    danger: 'border-red-200 bg-red-50 text-red-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700'
  };
}
