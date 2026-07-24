import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PUBLIC_BUTTON_VARIANTS } from '../public.tokens';

export type PublicButtonVariant = keyof typeof PUBLIC_BUTTON_VARIANTS;

@Component({
  selector: 'app-public-button',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './public-button.html'
})
export class PublicButton {
  readonly variant = input<PublicButtonVariant>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly routerLink = input<string | string[]>();
  readonly href = input<string>();
  readonly external = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly className = input<string>('');
  readonly clicked = output<MouseEvent>();

  protected readonly classes = computed(() => {
    const base = PUBLIC_BUTTON_VARIANTS[this.variant()];
    const width = this.fullWidth() ? 'w-full' : '';
    return [base, width, this.className()].filter(Boolean).join(' ');
  });
}
