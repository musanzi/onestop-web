import { Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { UI_BUTTON_ICONS } from '@shared/data';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'info' | 'contrast' | 'success' | 'outlined';
type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-ui-button',
  imports: [LucideAngularModule],
  templateUrl: './button.html'
})
export class UiButton {
  icons = UI_BUTTON_ICONS;
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('medium');
  outlined = input<boolean>(false);
  text = input<boolean>(false);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  clicked = output<MouseEvent>();

  handleClick(event: MouseEvent) {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }

  spinnerSize(): number {
    switch (this.size()) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  }
}
