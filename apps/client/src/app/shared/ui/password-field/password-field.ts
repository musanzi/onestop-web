import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { LabelComponent } from '../label/label';

@Component({
  selector: 'ui-password-field',
  imports: [LabelComponent, LucideAngularModule],
  template: `
    <div class="block">
      @if (label()) {
        <ui-label [forId]="inputId()">{{ label() }}</ui-label>
      }
      <div
        class="flex overflow-hidden rounded-lg border shadow-theme-xs focus-within:ring-3 dark:bg-gray-900"
        [class.border-error-500]="!!error()"
        [class.focus-within:border-error-300]="!!error()"
        [class.focus-within:ring-error-500/20]="!!error()"
        [class.border-gray-300]="!error()"
        [class.focus-within:border-brand-300]="!error()"
        [class.focus-within:ring-brand-500/20]="!error()"
        [class.dark:border-gray-700]="!error()"
        [class.dark:focus-within:border-brand-800]="!error()">
        <input
          [id]="inputId()"
          [type]="visible() ? 'text' : 'password'"
          [placeholder]="placeholder()"
          [disabled]="isDisabled"
          [value]="value"
          class="min-h-11 w-full border-0 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0 dark:text-white/90 dark:placeholder:text-white/30"
          (input)="onInput($event)"
          (blur)="onTouched()" />
        <button
          type="button"
          class="inline-flex shrink-0 items-center justify-center px-4 text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/5 dark:hover:text-gray-200"
          [attr.aria-label]="visible() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          (click)="visible.update((v) => !v)">
          <i-lucide [name]="visible() ? icons.eyeOff : icons.eye" class="size-4" />
        </button>
      </div>
      @if (error()) {
        <p class="mt-1.5 text-xs text-error-500">{{ error() }}</p>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordFieldComponent),
      multi: true
    }
  ]
})
export class PasswordFieldComponent implements ControlValueAccessor {
  readonly inputId = input('');
  readonly label = input('');
  readonly placeholder = input('');
  readonly error = input('');

  readonly visible = signal(false);
  readonly icons = { eye: Eye, eyeOff: EyeOff };

  value = '';
  isDisabled = false;

  protected onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  protected onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value = next;
    this.onChange(next);
  }
}
