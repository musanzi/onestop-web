import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { AppTopbar } from '../../components/app-topbar/app-topbar';
import { Footer } from '../../components/footer/footer';
import { BackButton } from '@shared/components/back-button/back-button';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.html',
  imports: [RouterOutlet, AppTopbar, Footer, BackButton]
})
export class FullLayout implements OnInit, OnDestroy {
  readonly topbarFixed = signal(false);

  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.updateTopbarMode();

    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.#destroy$)
      )
      .subscribe(() => {
        this.updateTopbarMode();
      });
  }

  private updateTopbarMode(): void {
    let route = this.#activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const shouldFixTopbar = route.snapshot.data['topbarFixed'] === true;
    this.topbarFixed.set(shouldFixTopbar);
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}
