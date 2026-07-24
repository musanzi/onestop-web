import { ChangeDetectorRef, Component, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { LoadingService } from '@core/services/loading';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.html'
})
export class LoadingBar implements OnChanges, OnInit, OnDestroy {
  #loadingService = inject(LoadingService);
  #unsubscribeAll = new Subject();
  #cdr = inject(ChangeDetectorRef);
  mode: 'determinate' | 'indeterminate' = 'indeterminate';
  progress = 0;
  show = false;

  ngOnChanges(changes: SimpleChanges): void {
    if ('autoMode' in changes) {
      this.#loadingService.setAutoMode(changes['autoMode'].currentValue);
    }
  }

  ngOnInit(): void {
    this.#loadingService.mode$.pipe(takeUntil(this.#unsubscribeAll)).subscribe((value) => {
      this.mode = value;
      this.#cdr.detectChanges();
    });

    this.#loadingService.progress$.pipe(takeUntil(this.#unsubscribeAll)).subscribe((value) => {
      if (!value) return;
      this.progress = value;
      this.#cdr.detectChanges();
    });

    this.#loadingService.show$.pipe(takeUntil(this.#unsubscribeAll)).subscribe((value) => {
      this.show = value;
      this.#cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll.next(null);
    this.#unsubscribeAll.complete();
  }
}
