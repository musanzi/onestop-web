import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-spinner',
  template: `<span
    class="inline-block animate-spin rounded-full border-2 border-current border-r-transparent"
    [class]="sizeClasses[size()]"></span>`
})
export class SpinnerComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  protected readonly sizeClasses: Record<string, string> = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-10'
  };
}
