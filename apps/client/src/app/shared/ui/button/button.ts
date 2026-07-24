import { CommonModule } from '@angular/common';
import { Component, booleanAttribute, input } from '@angular/core';
import { LucideAngularModule, Loader2 } from 'lucide-angular';

@Component({
  selector: 'ui-button',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './button.html'
})
export class ButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly variant = input<'primary' | 'outline' | 'secondary' | 'danger' | 'ghost'>('primary');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(false, { transform: booleanAttribute });

  protected readonly loaderIcon = Loader2;

  protected readonly variantClasses: Record<string, string> = {
    primary: 'bg-brand-500 text-white border-brand-500 hover:bg-brand-600 hover:border-brand-600 disabled:bg-brand-300',
    outline:
      'bg-white text-gray-700 border-gray-300 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:ring-gray-700 dark:hover:bg-white/5',
    secondary:
      'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 shadow-theme-xs',
    ghost: 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100'
  };

  protected readonly sizeClasses: Record<string, string> = {
    sm: 'min-h-9 px-3.5 text-sm',
    md: 'min-h-11 px-4 text-sm',
    lg: 'min-h-12 px-5 text-base'
  };
}
