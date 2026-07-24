import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { TestimonialCard } from './testimonial-card/testimonial-card';
import { TESTIMONIALS } from '@features/landing/data/testimonials.data';

@Component({
  selector: 'app-testimonials',
  imports: [TestimonialCard],
  templateUrl: './testimonials-section.html'
})
export class TestimonialsSection implements OnInit, OnDestroy {
  readonly #platformId = inject(PLATFORM_ID);
  #intervalId: number | null = null;

  testimonials = TESTIMONIALS;
  activeTestimonial = signal(0);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.#platformId)) {
      return;
    }

    this.#intervalId = window.setInterval(() => {
      this.activeTestimonial.update((current) => (current + 1) % this.testimonials.length);
    }, 5000);
  }

  setActiveTestimonial(index: number): void {
    this.activeTestimonial.set(index);
  }

  ngOnDestroy(): void {
    if (this.#intervalId !== null) {
      window.clearInterval(this.#intervalId);
    }
  }
}
