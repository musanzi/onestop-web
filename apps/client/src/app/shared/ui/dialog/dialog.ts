import { CommonModule } from '@angular/common';
import { Component, HostListener, booleanAttribute, input, output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'ui-dialog',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dialog.html'
})
export class DialogComponent {
  readonly open = input(false, { transform: booleanAttribute });
  readonly closable = input(true, { transform: booleanAttribute });
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly title = input('');
  readonly maxWidthClass = input('max-w-2xl');
  readonly openChange = output<boolean>();

  protected readonly closeIcon = X;

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open() && this.closable()) {
      this.close();
    }
  }

  protected close(): void {
    this.openChange.emit(false);
  }

  protected onBackdropClick(): void {
    if (this.closeOnBackdrop() && this.closable()) {
      this.close();
    }
  }

  protected onBackdropKeydown(event: Event): void {
    event.preventDefault();
    this.onBackdropClick();
  }
}
