import {
  Component,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  TemplateRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, ArrowLeft, ArrowRight } from 'lucide-angular';

interface CarouselItemContext<TItem> {
  $implicit: TItem;
  index: number;
}

type CarouselTrackBy<TItem> = (index: number, item: TItem) => unknown;

@Component({
  selector: 'app-cards-carousel',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './cards-carousel.html',

  styles: [
    `
      :host {
        display: block;
      }

      .landing-card-carousel-track {
        scroll-padding-inline: 0.125rem;
      }

      .landing-card-carousel-slide {
        flex: 0 0 100%;
        min-width: 0;
      }

      @media (min-width: 768px) {
        .landing-card-carousel-slide {
          flex-basis: calc((100% - 1.5rem) / 2);
        }
      }

      @media (min-width: 1280px) {
        .landing-card-carousel-slide {
          flex-basis: calc((100% - 3rem) / 3);
        }
      }
    `
  ]
})
export class CardsCarousel<TItem> {
  readonly items = input<readonly TItem[]>([]);
  readonly itemTemplate = input.required<TemplateRef<CarouselItemContext<TItem>>>();
  readonly trackBy = input<CarouselTrackBy<TItem>>((index) => index);
  readonly ariaLabel = input('Carrousel');
  readonly autoSlideIntervalMs = input(5000);

  readonly viewport = viewChild<ElementRef<HTMLDivElement>>('viewport');
  readonly slidesPerView = signal(1);
  readonly activeIndex = signal(0);

  readonly maxIndex = computed(() => Math.max(0, this.items().length - this.slidesPerView()));
  readonly slideIndexes = computed(() => Array.from({ length: this.maxIndex() + 1 }, (_, index) => index));
  readonly canGoPrev = computed(() => this.activeIndex() > 0);
  readonly canGoNext = computed(() => this.activeIndex() < this.maxIndex());
  readonly showControls = computed(() => this.items().length > this.slidesPerView());

  readonly icons = {
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight
  };

  readonly #platformId = inject(PLATFORM_ID);
  readonly #isBrowser = isPlatformBrowser(this.#platformId);

  constructor() {
    if (!this.#isBrowser) {
      return;
    }

    afterNextRender(() => {
      this.updateSlidesPerView();
      this.scrollToIndex(this.activeIndex(), 'auto');
    });

    effect(() => {
      this.items();
      this.slidesPerView();
      queueMicrotask(() => this.syncViewport());
    });

    effect((onCleanup) => {
      const intervalMs = this.autoSlideIntervalMs();

      if (!this.showControls() || intervalMs <= 0) {
        return;
      }

      const intervalId = window.setInterval(() => this.goNextAutomatically(), intervalMs);
      onCleanup(() => window.clearInterval(intervalId));
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.#isBrowser) {
      return;
    }

    this.updateSlidesPerView();
    this.scrollToIndex(this.activeIndex(), 'auto');
  }

  onTrackScroll(): void {
    const viewport = this.viewport()?.nativeElement;
    const slides = this.getSlides();

    if (!viewport || !slides.length) {
      this.activeIndex.set(0);
      return;
    }

    const scrollLeft = viewport.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    this.activeIndex.set(Math.min(closestIndex, this.maxIndex()));
  }

  goPrev(): void {
    this.scrollToIndex(this.activeIndex() - 1);
  }

  goNext(): void {
    this.scrollToIndex(this.activeIndex() + 1);
  }

  goTo(index: number): void {
    this.scrollToIndex(index);
  }

  private goNextAutomatically(): void {
    const nextIndex = this.activeIndex() >= this.maxIndex() ? 0 : this.activeIndex() + 1;
    this.scrollToIndex(nextIndex);
  }

  private syncViewport(): void {
    const viewport = this.viewport()?.nativeElement;
    if (!viewport) {
      return;
    }

    const clampedIndex = Math.min(this.activeIndex(), this.maxIndex());
    if (clampedIndex !== this.activeIndex()) {
      this.activeIndex.set(clampedIndex);
    }

    this.scrollToIndex(clampedIndex, 'auto');
  }

  private scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth'): void {
    const viewport = this.viewport()?.nativeElement;
    const slides = this.getSlides();

    if (!viewport || !slides.length) {
      return;
    }

    const clampedIndex = Math.max(0, Math.min(index, this.maxIndex()));
    const targetSlide = slides[clampedIndex];

    this.activeIndex.set(clampedIndex);
    viewport.scrollTo({
      left: targetSlide.offsetLeft,
      behavior
    });
  }

  private updateSlidesPerView(): void {
    const width = window.innerWidth;
    this.slidesPerView.set(width >= 1280 ? 3 : width >= 768 ? 2 : 1);
  }

  private getSlides(): HTMLElement[] {
    return Array.from(this.viewport()?.nativeElement.querySelectorAll<HTMLElement>('[data-carousel-slide]') ?? []);
  }
}
