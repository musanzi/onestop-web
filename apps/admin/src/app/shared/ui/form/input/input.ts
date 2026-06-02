import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, input } from '@angular/core';
import { computed, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-ui-input',
  templateUrl: './input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiInput), multi: true }],
})
export class UiInput implements ControlValueAccessor {
  readonly #cdr = inject(ChangeDetectorRef);
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  name = input<string>('');
  disabled = input<boolean>(false);
  id = input<string>('');
  invalid = input<boolean>(false);
  required = input<boolean>(false);
  value = '';
  isControlDisabled = signal(false);
  isDisabled = computed(() => this.disabled() || this.isControlDisabled());

  onChange!: (value: string) => void;
  onTouched!: () => void;

  writeValue(value: string): void {
    this.value = value || '';
    this.#cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isControlDisabled.set(isDisabled);
    this.#cdr.markForCheck();
  }

  onInput(event: Event): void {
    if (this.isDisabled()) return;
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }
}
