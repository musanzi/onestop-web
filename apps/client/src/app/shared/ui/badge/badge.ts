import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-badge',
  template: `<span
    class="inline-flex items-center rounded-full border px-2.5 py-1.5 text-xs font-semibold leading-[1.2]"
    [class]="variantClasses[variant()]"
    ><ng-content
  /></span>`
})
export class BadgeComponent {
  readonly variant = input<'primary' | 'secondary' | 'success' | 'warning' | 'danger'>('primary');

  protected readonly variantClasses: Record<string, string> = {
    primary: 'border-primary-200 bg-primary-50 text-primary-700',
    secondary: 'border-slate-200 bg-slate-50 text-slate-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    danger: 'border-red-200 bg-red-50 text-red-700'
  };
}
