import { Component, inject, OnDestroy, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { AppConfigService } from '@core/services/config/config.service';
import { AppConfig } from '@core/services/config/config.types';
import { EmptyLayout } from './pages/empty-layout/empty-layout';
import { FixedLayout } from './pages/fixed-layout/fixed-layout';
import { FullLayout } from './pages/full-layout/full-layout';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  imports: [FixedLayout, EmptyLayout, FullLayout]
})
export class Layout implements OnInit, OnDestroy {
  config = signal<AppConfig>({} as AppConfig);
  layout = signal('full-layout');
  #unsubscribeAll = new Subject();
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #configService = inject(AppConfigService);
  #cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.#configService.config$.pipe(takeUntil(this.#unsubscribeAll)).subscribe((config) => {
      this.config.set(config as AppConfig);
      this._updateLayout();
    });
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.#unsubscribeAll)
      )
      .subscribe(() => {
        this._updateLayout();
      });
  }

  private _updateLayout(): void {
    let route = this.#activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const currentConfig = this.config();
    let newLayout = currentConfig.layout || 'full-layout';
    const layoutFromQueryParam = route.snapshot.queryParamMap.get('layout');
    if (layoutFromQueryParam) {
      newLayout = layoutFromQueryParam;
      this.config.update((cfg) => ({ ...cfg, layout: layoutFromQueryParam }));
    }
    const paths = route.pathFromRoot;
    paths.forEach((path) => {
      if (path.routeConfig?.data?.['layout']) {
        newLayout = path.routeConfig.data['layout'];
      }
    });
    this.layout.set(newLayout);
    this.#cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll.next(null);
    this.#unsubscribeAll.complete();
  }
}
