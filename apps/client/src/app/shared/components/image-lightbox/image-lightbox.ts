import {
  Component,
  DOCUMENT,
  HostListener,
  OnDestroy,
  effect,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChevronLeft, ChevronRight, LucideAngularModule, X } from 'lucide-angular';
import { ImageLightboxItem } from './image-lightbox.model';

@Component({
  selector: 'app-image-lightbox',
  imports: [LucideAngularModule, TranslateModule],
  templateUrl: './image-lightbox.html',
  styleUrl: './image-lightbox.css'
})
export class ImageLightboxComponent implements OnDestroy {
  private document = inject(DOCUMENT);

  open = model(false);
  images = input<ImageLightboxItem[]>([]);
  activeIndex = model(0);
  showCounter = input(true);

  closed = output<void>();

  protected readonly icons = {
    close: X,
    prev: ChevronLeft,
    next: ChevronRight
  } as const;

  protected current = signal<ImageLightboxItem | null>(null);

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const items = this.images();
      const index = this.activeIndex();

      if (isOpen && items.length > 0) {
        const safeIndex = Math.min(Math.max(index, 0), items.length - 1);
        if (safeIndex !== index) {
          this.activeIndex.set(safeIndex);
        }
        this.current.set(items[safeIndex]);
        this.lockScroll(true);
      } else {
        this.current.set(null);
        if (!isOpen) {
          this.lockScroll(false);
        }
      }
    });

    effect(() => {
      const items = this.images();
      const index = this.activeIndex();
      if (this.open() && items.length > 0) {
        this.current.set(items[Math.min(Math.max(index, 0), items.length - 1)]);
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }
    if (event.key === 'Escape') {
      this.close();
    }
    if (event.key === 'ArrowRight') {
      this.next();
    }
    if (event.key === 'ArrowLeft') {
      this.prev();
    }
  }

  protected close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  protected prev(event?: Event): void {
    event?.stopPropagation();
    const total = this.images().length;
    if (total <= 1) {
      return;
    }
    const nextIndex = this.activeIndex() <= 0 ? total - 1 : this.activeIndex() - 1;
    this.activeIndex.set(nextIndex);
  }

  protected next(event?: Event): void {
    event?.stopPropagation();
    const total = this.images().length;
    if (total <= 1) {
      return;
    }
    const nextIndex = this.activeIndex() >= total - 1 ? 0 : this.activeIndex() + 1;
    this.activeIndex.set(nextIndex);
  }

  ngOnDestroy(): void {
    this.lockScroll(false);
  }

  private lockScroll(lock: boolean): void {
    try {
      this.document.body.style.overflow = lock ? 'hidden' : '';
    } catch {
      void 0;
    }
  }
}
