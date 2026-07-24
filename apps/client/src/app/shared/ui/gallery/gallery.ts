import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'ui-gallery',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './gallery.html'
})
export class GalleryComponent<T> {
  readonly items = input<T[]>([]);
  readonly activeIndex = model(0);

  protected readonly leftIcon = ChevronLeft;
  protected readonly rightIcon = ChevronRight;

  protected previous(): void {
    const total = this.items().length;
    if (total <= 1) return;
    this.activeIndex.set((this.activeIndex() - 1 + total) % total);
  }

  protected next(): void {
    const total = this.items().length;
    if (total <= 1) return;
    this.activeIndex.set((this.activeIndex() + 1) % total);
  }

  protected select(index: number): void {
    this.activeIndex.set(index);
  }
}
