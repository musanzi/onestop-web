import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LabelComponent } from '../label/label';
import { FORM_CONTROL_BASE, FORM_CONTROL_DISABLED, FORM_CONTROL_ERROR } from '../form/form-control.classes';

@Component({
  selector: 'ui-textfield',
  imports: [LabelComponent],
  template: `
    <div class="block">
      @if (label()) {
        <ui-label [forId]="inputId()">{{ label() }}</ui-label>
      }
      <input
        [id]="inputId()"
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled"
        [value]="value"
        [class]="inputClasses"
        (input)="onInput($event)"
        (blur)="onTouched()" />
      @if (error()) {
        <p class="mt-1.5 text-xs text-error-500">{{ error() }}</p>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextfieldComponent),
      multi: true
    }
  ]
})
export class TextfieldComponent implements ControlValueAccessor {
  readonly inputId = input('');
  readonly label = input('');
  readonly type = input<'text' | 'email'>('text');
  readonly placeholder = input('');
  readonly error = input('');

  value = '';
  isDisabled = false;

  protected onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected get inputClasses(): string {
    const parts = [FORM_CONTROL_BASE];
    if (this.isDisabled) {
      parts.push(FORM_CONTROL_DISABLED);
    } else if (this.error()) {
      parts.push(FORM_CONTROL_ERROR);
    }
    return parts.join(' ');
  }

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
