import { CommonModule } from '@angular/common';
import { Component, booleanAttribute, input } from '@angular/core';

@Component({
  selector: 'ui-input',
  imports: [CommonModule],
  templateUrl: './input.html'
})
export class InputComponent {
  readonly inputId = input('');
  readonly label = input('');
  readonly error = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
}
