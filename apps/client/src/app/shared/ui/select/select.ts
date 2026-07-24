import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, input, model, output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface UiSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'ui-select',
  imports: [CommonModule, FormsModule],
  templateUrl: './select.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  readonly inputId = input('');
  readonly options = input<UiSelectOption[]>([]);
  readonly placeholder = input('');
  readonly multiple = input(false);
  readonly disabled = model(false);
  readonly changed = output<string | string[] | null>();

  protected readonly value = model<string | string[] | null>(null);
  protected readonly hasValue = computed(() => {
    const current = this.value();
    return Array.isArray(current) ? current.length > 0 : !!current;
  });

  #onChange: (value: string | string[] | null) => void = () => undefined;
  #onTouched: () => void = () => undefined;

  writeValue(value: string | string[] | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string | string[] | null) => void): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onValueChange(value: string | string[] | null): void {
    this.value.set(value);
    this.#onChange(value);
    this.changed.emit(value);
  }

  protected onBlur(): void {
    this.#onTouched();
  }
}
