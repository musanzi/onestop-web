import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  signal,
  viewChild
} from '@angular/core';
import { NgOptimizedImage, NgClass } from '@angular/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { EXPLORATION_LINKS } from '../../data/links.data';
import { DesktopNav } from './desktop-nav/desktop-nav';
import { MobileNav } from './mobile-nav/mobile-nav';
import { RouterLink } from '@angular/router';
import { ProgramsStore } from '@features/landing/store/programs.store';
import { environment } from '@environments/environment';
import { AuthStore } from '@core/auth/auth.store';
import { TOPBAR_ANIMATION } from './topbar.config';

@Component({
  selector: 'app-topbar',
  providers: [ProgramsStore],
  imports: [NgOptimizedImage, RouterLink, MobileNav, DesktopNav, NgClass],
  templateUrl: './app-topbar.html'
})
export class AppTopbar implements OnDestroy {
  readonly #elementRef = inject(ElementRef);
  readonly #ngZone = inject(NgZone);
  readonly #destroy$ = new Subject<void>();

  readonly authStore = inject(AuthStore);
  readonly programsStore = inject(ProgramsStore);

  readonly isFixed = signal(false);
  readonly links = signal(EXPLORATION_LINKS);
  readonly fixed = input(false);
  readonly onestopUrl = environment.onestopUrl;
  readonly mobileNav = viewChild(MobileNav);
  readonly isSolid = computed(() => this.fixed() || this.isFixed() || !!this.mobileNav()?.isOpen());

  constructor() {
    this.programsStore.loadPrograms();

    afterNextRender(() => {
      this.#ngZone.runOutsideAngular(() => {
        this.setupEventListeners();
      });
    });
  }

  closeNav(): void {
    this.mobileNav()?.closeNav();
  }

  setupEventListeners(): void {
    const click$ = fromEvent(document, 'click');
    const scroll$ = fromEvent(window, 'scroll');

    click$.pipe(takeUntil(this.#destroy$)).subscribe((event: Event) => {
      const isInside = this.#elementRef.nativeElement.contains(event.target);
      const isMenuOpen = this.mobileNav()?.isOpen();
      if (isMenuOpen && !isInside) {
        this.#ngZone.run(() => this.closeNav());
      }
    });

    scroll$.pipe(takeUntil(this.#destroy$)).subscribe(() => {
      const shouldFix = window.scrollY > TOPBAR_ANIMATION.scrollThreshold;
      const isMenuOpen = this.mobileNav()?.isOpen();

      if (this.isFixed() !== shouldFix || isMenuOpen) {
        this.#ngZone.run(() => {
          if (this.isFixed() !== shouldFix) {
            this.isFixed.set(shouldFix);
          }
          if (isMenuOpen) {
            this.closeNav();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}
